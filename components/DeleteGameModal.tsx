"use client";

import { useState, useTransition } from "react";
import { deleteGame } from "@/app/games/Admin/Actions";
import Portal from "@/components/Portal";

// ================================================================
//  TIPOS
// ================================================================

interface DeleteConfirmModalProps {
    gameId: number;
    gameTitle: string;
}

// ================================================================
//  COMPONENTE
// ================================================================

export default function DeleteConfirmModal({ gameId, gameTitle }: DeleteConfirmModalProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError]   = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleOpen  = () => { setError(null); setIsOpen(true); };
    const handleClose = () => { if (!isPending) setIsOpen(false); };

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteGame(gameId);
            if (result.success) {
                setIsOpen(false);
            } else {
                setError(result.message ?? "Something went wrong.");
            }
        });
    };

    return (
        <>
            {/* ── Trigger ── */}
            <button
                onClick={handleOpen}
                className="btn btn-sm btn-outline btn-error text-[11px] uppercase tracking-widest font-semibold transition-all duration-200 hover:scale-105"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
            </button>

            {/* ── Modal via Portal ── */}
            {isOpen && (
                <Portal>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={handleClose}
                        />

                        {/* Panel */}
                        <div className="relative z-10 w-full max-w-md bg-base-200 border border-white/[0.08] rounded-2xl shadow-2xl">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-error/10 border border-error/20 flex items-center justify-center">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-error">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            <path d="M10 11v6M14 11v6" />
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white tracking-tight">Delete Game</h2>
                                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">This action cannot be undone</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isPending}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200 disabled:opacity-30"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-4">
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Are you sure you want to delete{" "}
                                    <span className="text-white font-semibold">"{gameTitle}"</span>?
                                    {" "}This will permanently remove the game from the database.
                                </p>

                                {error && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-error/10 border border-error/20 rounded-lg">
                                        <svg className="w-4 h-4 text-error shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 8v4M12 16h.01" />
                                        </svg>
                                        <p className="text-xs font-mono text-error/80">{error}</p>
                                    </div>
                                )}

                                <div className="border-t border-white/[0.06]" />

                                {/* Botones */}
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={isPending}
                                        className="btn btn-sm btn-ghost text-[11px] uppercase tracking-widest font-semibold text-white/40 hover:text-white/70 disabled:opacity-30"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isPending}
                                        className="btn btn-sm btn-error text-[11px] uppercase tracking-widest font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isPending ? (
                                            <><span className="loading loading-spinner loading-xs" />Deleting...</>
                                        ) : (
                                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                <path d="M10 11v6M14 11v6" />
                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                            </svg>Yes, Delete</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}