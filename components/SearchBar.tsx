"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(searchParams.get("search") ?? "");
    const isUserTyping = useRef(false);

    useEffect(() => {
        if (!isUserTyping.current) return;

        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (value.trim()) {
                params.set("search", value.trim());
            } else {
                params.delete("search");
            }

            params.set("page", "1");
            router.push(`${pathname}?${params.toString()}`);
            isUserTyping.current = false;
        }, 400);

        return () => clearTimeout(timeout);
    }, [value]);

    useEffect(() => {
        if (!isUserTyping.current) {
            setValue(searchParams.get("search") ?? "");
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isUserTyping.current = true;
        setValue(e.target.value);
    };

    const handleClear = () => {
        isUserTyping.current = true;
        setValue("");
    };

    return (
        <div className="relative flex items-center">
            {/* Search icon */}
            <svg
                className="absolute left-3 w-3.5 h-3.5 text-white/40 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>

            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Search games..."
                className="
                    w-48 lg:w-64
                    pl-8 pr-7 py-1.5
                    bg-transparent
                    border border-white/30 hover:border-white/50 focus:border-white/70
                    rounded-full
                    text-xs text-white/80 placeholder:text-white/30
                    font-mono tracking-wide
                    outline-none
                    transition-all duration-200
                "
            />

            {/* Clear button */}
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 text-white/30 hover:text-white/70 transition-colors duration-150"
                >
                    <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}