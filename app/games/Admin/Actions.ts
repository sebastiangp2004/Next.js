"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { z } from "zod";

// ================================================================
//  PRISMA CLIENT
// ================================================================

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
    }),
});

// ================================================================
//  ZOD SCHEMA
//  z.coerce convierte automáticamente los strings del FormData
// ================================================================

const GameSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be under 100 characters"),
    developer: z
        .string()
        .min(1, "Developer is required")
        .max(100, "Developer must be under 100 characters"),
    genre: z
        .string()
        .min(1, "Genre is required")
        .max(50, "Genre must be under 50 characters"),
    price: z.coerce
        .number({ message: "Price must be a number" })
        .min(0, "Price cannot be negative")
        .max(999.99, "Price must be under $999.99"),
    releasedate: z
        .string()
        .min(1, "Release date is required")
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    description: z
        .string()
        .max(500, "Description must be under 500 characters")
        .optional(),
    console_id: z.coerce
        .number({ message: "Console is required" })
        .int()
        .positive("Please select a console"),
});

// ================================================================
//  TIPOS EXPORTADOS
// ================================================================

export type ActionState = {
    success: boolean;
    message?: string;
    errors?: Partial<Record<keyof z.infer<typeof GameSchema> | "cover", string>>;
    oldValues?: {
        title: string;
        developer: string;
        genre: string;
        price: string;
        releasedate: string;
        description: string;
        console_id: string;
    };
};

// ================================================================
//  HELPER — guardar imagen en /public/imgs/
// ================================================================

async function saveImage(
    file: File
): Promise<{ filename: string } | { error: string }> {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
        return { error: "Only JPG, PNG or WEBP images are allowed" };
    }
    if (file.size > 5 * 1024 * 1024) {
        return { error: "Image must be under 5MB" };
    }

    const filename = path.basename(file.name);
    const destDir = path.join(process.cwd(), "public", "imgs");
    const destPath = path.join(destDir, filename);

    try {
        await mkdir(destDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(destPath, buffer);
        return { filename };
    } catch (err: unknown) {
        console.error("saveImage error:", err);
        return {
            error: `Could not save image. ${err instanceof Error ? err.message : String(err)}`,
        };
    }
}

// ================================================================
//  CREATE GAME
// ================================================================

export async function createGame(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {

    // 1 — Extraer valores del form
    const rawValues = {
        title:       formData.get("title")       as string,
        developer:   formData.get("developer")   as string,
        genre:       formData.get("genre")       as string,
        price:       formData.get("price")       as string,
        releasedate: formData.get("releasedate") as string,
        description: formData.get("description") as string,
        console_id:  formData.get("console_id")  as string,
    };

    const coverFile = formData.get("cover") as File | null;
    const oldValues = { ...rawValues };

  

    // 2 — Validar campos con Zod
    const parsed = GameSchema.safeParse(rawValues);

    if (!parsed.success) {
        const errors: ActionState["errors"] = {};
        for (const issue of parsed.error.issues) {
            const field = issue.path[0] as keyof typeof errors;
            if (!errors[field]) errors[field] = issue.message;
        }
        return { success: false, errors, oldValues };
    }

    // 3 — Manejar imagen (opcional)
    let coverName = "no-cover.jpg"; // 👈 imagen por defecto

    if (coverFile && coverFile.size > 0) {
        const imageResult = await saveImage(coverFile);

        if ("error" in imageResult) {
            return {
                success: false,
                errors: { cover: imageResult.error },
                oldValues,
            };
        }

        coverName = imageResult.filename;
    }

    // 4 — Crear registro en DB
    try {
        await prisma.games.create({
            data: {
                title:       parsed.data.title,
                developer:   parsed.data.developer,
                genre:       parsed.data.genre,
                price:       parsed.data.price,
                releasedate: new Date(parsed.data.releasedate),
                description: parsed.data.description ?? "",
                cover:       coverName, // 👈 aquí usamos la variable
                console_id:  parsed.data.console_id,
            },
        });
    } catch (e: unknown) {
        if ((e as { code?: string })?.code === "P2002") {
            return {
                success: false,
                errors: { title: "A game with this title already exists" },
                oldValues,
            };
        }
        return {
            success: false,
            message: "Database error. Please try again.",
            oldValues,
        };
    }

    // 5 — Revalidar
    revalidatePath("/games");
    return { success: true, message: "Game added successfully!" };
}
// ================================================================
//  UPDATE GAME
// ================================================================

export async function updateGame(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {

    const id = parseInt(formData.get("id") as string);
    if (isNaN(id)) return { success: false, message: "Invalid game ID." };

    const rawValues = {
        title:       formData.get("title")       as string,
        developer:   formData.get("developer")   as string,
        genre:       formData.get("genre")        as string,
        price:       formData.get("price")        as string,
        releasedate: formData.get("releasedate")  as string,
        description: formData.get("description") as string,
        console_id:  formData.get("console_id")  as string,
    };

    const coverFile = formData.get("cover") as File | null;
    const oldValues = { ...rawValues };

    // Validar campos
    const parsed = GameSchema.safeParse(rawValues);
    if (!parsed.success) {
        const errors: ActionState["errors"] = {};
        for (const issue of parsed.error.issues) {
            const field = issue.path[0] as keyof typeof errors;
            if (!errors[field]) errors[field] = issue.message;
        }
        return { success: false, errors, oldValues };
    }

    // Si subió nueva imagen, guardarla; si no, mantener la actual
    let newCover: string | undefined;
    if (coverFile && coverFile.size > 0) {
        const imageResult = await saveImage(coverFile);
        if ("error" in imageResult) {
            return { success: false, errors: { cover: imageResult.error }, oldValues };
        }
        newCover = imageResult.filename;
    }

    try {
        await prisma.games.update({
            where: { id },
            data: {
                title:       parsed.data.title,
                developer:   parsed.data.developer,
                genre:       parsed.data.genre,
                price:       parsed.data.price,
                releasedate: new Date(parsed.data.releasedate),
                description: parsed.data.description ?? "",
                console_id:  parsed.data.console_id,
                ...(newCover ? { cover: newCover } : {}),
            },
        });
    } catch (e: unknown) {
        if ((e as { code?: string })?.code === "P2002") {
            return {
                success: false,
                errors:  { title: "A game with this title already exists" },
                oldValues,
            };
        }
        return { success: false, message: "Database error. Please try again.", oldValues };
    }

    revalidatePath("/games");
    return { success: true, message: "Game updated successfully!" };
}

// ================================================================
//  DELETE GAME
//  Se llama directo: deleteGame(game.id) — sin formData
// ================================================================

export async function deleteGame(
    id: number
): Promise<{ success: boolean; message?: string }> {

    if (!id || isNaN(id)) {
        return { success: false, message: "Invalid game ID." };
    }

    try {
        // 1 — Obtener el juego para saber el nombre de la imagen
        const game = await prisma.games.findUnique({ where: { id } });
        
        if (!game) {
            return { success: false, message: "Game not found." };
        }

        // 2 — Eliminar el juego de la base de datos
        await prisma.games.delete({ where: { id } });

        // 3 — Eliminar la imagen, excepto si es "no-cover.jpg"
        if (game.cover && game.cover !== "no-cover.jpg") {
            const imagePath = path.join(process.cwd(), "public", "imgs", game.cover);
            try {
                await unlink(imagePath);
            } catch (err: unknown) {
                // Silenciar error si la imagen no existe (no es crítico)
                console.warn(`Could not delete image: ${game.cover}`, err);
            }
        }
    } catch (e: unknown) {
        if ((e as { code?: string })?.code === "P2025") {
            return { success: false, message: "Game not found." };
        }
        return { success: false, message: "Database error. Please try again." };
    }

    revalidatePath("/games");
    return { success: true };
}