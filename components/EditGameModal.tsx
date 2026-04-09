"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { updateGame, type ActionState } from "@/app/games/Admin/Actions";
import Portal from "@/components/Portal";

// ================================================================
//  TIPOS
// ================================================================

interface Console {
    id: number;
    name: string;
}

interface Game {
    id: number;
    title: string;
    developer: string;
    genre: string;
    price: number;
    releasedate: Date;
    description: string;
    cover: string;
    console_id: number;
}

interface EditGameModalProps {
    game: Game;
    consoles: Console[];
}

// ================================================================
//  CONSTANTES DE ESTILO
// ================================================================

const INITIAL_STATE: ActionState = { success: false };

const INPUT_BASE = "w-full px-3.5 py-2 bg-white/[0.04] border rounded text-sm text-white/80 placeholder:text-white/20 outline-none transition-all duration-200 font-mono";
const INPUT_OK   = "border-white/[0.07] focus:border-info/40";
const INPUT_ERR  = "border-error/50 focus:border-error/70 bg-error/[0.03]";
const LABEL      = "block text-[10px] font-mono font-semibold uppercase tracking-widest text-white/30 mb-1.5";
const ERR_MSG    = "mt-1 text-[10px] font-mono text-error/80";

// ================================================================
//  COMPONENTE
// ================================================================

export default function EditGameModal({ game, consoles }: EditGameModalProps) {

    // ── Estado ──────────────────────────────────────────────────
    const [isOpen, setIsOpen]         = useState(false);
    const [preview, setPreview]       = useState<string>(`/imgs/${game.cover}`);
    const [coverName, setCoverName]   = useState<string>(game.cover);
    const [isNewImage, setIsNewImage] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction, isPending] = useActionState(updateGame, INITIAL_STATE);

    // ── Efectos ─────────────────────────────────────────────────

    useEffect(() => {
        if (state.success) handleClose();
    }, [state.success]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // ── Handlers ────────────────────────────────────────────────

    const handleOpen = () => {
        setPreview(`/imgs/${game.cover}`);
        setCoverName(game.cover);
        setIsNewImage(false);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setPreview(`/imgs/${game.cover}`);
        setCoverName(game.cover);
        setIsNewImage(false);
        formRef.current?.reset();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverName(file.name);
        setIsNewImage(true);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleClearNewImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(`/imgs/${game.cover}`);
        setCoverName(game.cover);
        setIsNewImage(false);
        if (fileRef.current) fileRef.current.value = "";
    };

    const fc = (field: keyof NonNullable<ActionState["errors"]>) =>
        `${INPUT_BASE} ${state.errors?.[field] ? INPUT_ERR : INPUT_OK}`;

    const formattedDate = new Date(game.releasedate).toISOString().split("T")[0];

    // ── Render ───────────────────────────────────────────────────

    return (
        <>
            {/* ── Trigger ── */}
            <button
                onClick={handleOpen}
                className="btn btn-sm btn-outline btn-info text-[11px] uppercase tracking-widest font-semibold transition-all duration-200 hover:scale-105"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </button>

            {/* ── Modal via Portal — escapa del overflow:hidden de la card ── */}
            {isOpen && (
                <Portal>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={handleClose}
                        />

                        {/* Panel */}
                        <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-base-200 border border-white/[0.08] rounded-2xl shadow-2xl">

                            {/* Header sticky */}
                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-base-200 border-b border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-info">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white tracking-tight">Edit Game</h2>
                                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest truncate max-w-xs">
                                            {game.title}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Formulario */}
                            <form ref={formRef} action={formAction} className="px-6 py-5 space-y-5">

                                {/* ID oculto */}
                                <input type="hidden" name="id" value={game.id} />

                                {/* Error global */}
                                {!state.success && state.message && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-error/10 border border-error/20 rounded-lg">
                                        <svg className="w-4 h-4 text-error shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 8v4M12 16h.01" />
                                        </svg>
                                        <p className="text-xs font-mono text-error/80">{state.message}</p>
                                    </div>
                                )}

                                {/* Cover */}
                                <div>
                                    <label className={LABEL}>
                                        Cover Image
                                        <span className="ml-2 text-white/20 normal-case tracking-normal font-normal">
                                            (leave as is or upload a new one)
                                        </span>
                                    </label>
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className={`relative w-full h-40 rounded-lg border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-200
                                            ${isNewImage ? "border-info/40" : "border-white/[0.08] hover:border-info/30"}
                                            ${state.errors?.cover ? "border-error/40" : ""}
                                        `}
                                    >
                                        <Image src={preview} alt="Cover preview" fill className="object-contain bg-base-300" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-base-300/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                {isNewImage && (
                                                    <span className="px-1.5 py-0.5 bg-info/20 border border-info/30 rounded text-[9px] font-mono text-info uppercase tracking-widest">
                                                        New
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-mono text-white/60 truncate max-w-[200px]">
                                                    {coverName}
                                                </span>
                                            </div>
                                            {isNewImage && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearNewImage}
                                                    className="shrink-0 w-5 h-5 rounded bg-error/20 border border-error/30 flex items-center justify-center text-error hover:bg-error/30 transition-colors"
                                                >
                                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 6 6 18M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-lg border border-white/10">
                                                <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Change image</span>
                                            </div>
                                        </div>
                                    </div>
                                    {state.errors?.cover && <p className={ERR_MSG}>⚠ {state.errors.cover}</p>}
                                    <input ref={fileRef} name="cover" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                                </div>

                                {/* Title */}
                                <div>
                                    <label className={LABEL}>Title <span className="text-error">*</span></label>
                                    <input name="title" type="text" required placeholder="e.g. Black Myth: Wukong" defaultValue={state.oldValues?.title ?? game.title} className={fc("title")} />
                                    {state.errors?.title && <p className={ERR_MSG}>⚠ {state.errors.title}</p>}
                                </div>

                                {/* Developer */}
                                <div>
                                    <label className={LABEL}>Developer <span className="text-error">*</span></label>
                                    <input name="developer" type="text" required placeholder="e.g. Game Science" defaultValue={state.oldValues?.developer ?? game.developer} className={fc("developer")} />
                                    {state.errors?.developer && <p className={ERR_MSG}>⚠ {state.errors.developer}</p>}
                                </div>

                                {/* Genre + Console */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={LABEL}>Genre <span className="text-error">*</span></label>
                                        <input name="genre" type="text" required placeholder="e.g. Action RPG" defaultValue={state.oldValues?.genre ?? game.genre} className={fc("genre")} />
                                        {state.errors?.genre && <p className={ERR_MSG}>⚠ {state.errors.genre}</p>}
                                    </div>
                                    <div>
                                        <label className={LABEL}>Console <span className="text-error">*</span></label>
                                        <select name="console_id" required defaultValue={state.oldValues?.console_id ?? game.console_id} className={`${fc("console_id")} appearance-none cursor-pointer`}>
                                            <option value="" disabled className="bg-base-300 text-white/30">Select console...</option>
                                            {consoles.map((c) => (
                                                <option key={c.id} value={c.id} className="bg-base-300 text-white/80">{c.name}</option>
                                            ))}
                                        </select>
                                        {state.errors?.console_id && <p className={ERR_MSG}>⚠ {state.errors.console_id}</p>}
                                    </div>
                                </div>

                                {/* Price + Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={LABEL}>Price (USD) <span className="text-error">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/50 font-mono text-sm font-bold pointer-events-none">$</span>
                                            <input name="price" type="number" step="0.01" min="0" required placeholder="59.99" defaultValue={state.oldValues?.price ?? game.price} className={`${fc("price")} pl-8`} />
                                        </div>
                                        {state.errors?.price && <p className={ERR_MSG}>⚠ {state.errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className={LABEL}>Release Date <span className="text-error">*</span></label>
                                        <input name="releasedate" type="date" required defaultValue={state.oldValues?.releasedate ?? formattedDate} className={`${fc("releasedate")} [color-scheme:dark] max-w-[130px] sm:max-w-none`} />
                                        {state.errors?.releasedate && <p className={ERR_MSG}>⚠ {state.errors.releasedate}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={LABEL}>Description</label>
                                    <textarea name="description" rows={3} placeholder="A short description..." defaultValue={state.oldValues?.description ?? game.description} className={`${fc("description")} resize-none`} />
                                    {state.errors?.description && <p className={ERR_MSG}>⚠ {state.errors.description}</p>}
                                </div>

                                <div className="border-t border-white/[0.06]" />

                                {/* Botones */}
                                <div className="flex items-center justify-end gap-3 pb-1">
                                    <button type="button" onClick={handleClose} className="btn btn-sm btn-ghost text-[11px] uppercase tracking-widest font-semibold text-white/40 hover:text-white/70">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isPending} className="btn btn-sm btn-info text-[11px] uppercase tracking-widest font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                        {isPending ? (
                                            <><span className="loading loading-spinner loading-xs" />Saving...</>
                                        ) : (
                                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                                <polyline points="17 21 17 13 7 13 7 21" />
                                                <polyline points="7 3 7 8 15 8" />
                                            </svg>Save Changes</>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}