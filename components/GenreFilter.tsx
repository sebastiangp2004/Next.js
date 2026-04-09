"use client";

import { usePathname, useRouter } from "next/navigation";

interface GenreFilterProps {
    genres: string[];
    selectedGenre?: string;
    search?: string;
}

function buildQuery(genre?: string, search?: string) {
    const params = new URLSearchParams();
    if (search?.trim()) {
        params.set("search", search.trim());
    }
    if (genre) {
        params.set("genre", genre);
    }
    params.set("page", "1");
    return params.toString();
}

export default function GenreFilter({ genres, selectedGenre, search }: GenreFilterProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (genre?: string) => {
        const query = buildQuery(genre, search);
        router.push(`${pathname}${query ? `?${query}` : ""}`);
    };

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <button
                type="button"
                onClick={() => handleClick(undefined)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 ${
                    !selectedGenre
                        ? "bg-primary text-base-100 border-primary"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                }`}
            >
                Todos
            </button>

            {genres.map((genre) => (
                <button
                    type="button"
                    key={genre}
                    onClick={() => handleClick(genre)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 ${
                        selectedGenre === genre
                            ? "bg-primary text-base-100 border-primary"
                            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    }`}
                >
                    {genre}
                </button>
            ))}
        </div>
    );
}
