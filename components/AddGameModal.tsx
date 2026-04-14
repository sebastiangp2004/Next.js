"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createGame, type ActionState } from "@/app/games/Admin/Actions";
import Portal from "@/components/Portal";

interface Console {
    id: number;
    name: string;
}

interface AddGameModalProps {
    consoles: Console[];
}

const INITIAL_STATE: ActionState = { success: false };

const INPUT_BASE = "w-full px-3.5 py-2 bg-white/[0.04] border rounded text-sm text-white/80 placeholder:text-white/20 outline-none transition-all duration-200 font-mono";
const INPUT_OK   = "border-white/[0.07] focus:border-primary/40";
const INPUT_ERR  = "border-error/50 focus:border-error/70 bg-error/[0.03]";
const LABEL      = "block text-[10px] font-mono font-semibold uppercase tracking-widest text-white/30 mb-1.5";
const ERR_MSG    = "mt-1 text-[10px] font-mono text-error/80";

export default function AddGameModal({ consoles }: AddGameModalProps) {

    const [isOpen, setIsOpen]         = useState(false);
    const [preview, setPreview]       = useState<string | null>(null);
    const [coverName, setCoverName]   = useState("");

    const fileRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction, isPending] = useActionState(createGame, INITIAL_STATE);

    useEffect(() => {
        if (state.success) handleClose();
    }, [state.success]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        setPreview(null);
        setCoverName("");
        formRef.current?.reset();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverName(file.name);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleClearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setCoverName("");
        if (fileRef.current) fileRef.current.value = "";
    };

    const fc = (field: keyof NonNullable<ActionState["errors"]>) =>
        `${INPUT_BASE} ${state.errors?.[field] ? INPUT_ERR : INPUT_OK}`;

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-sm btn-outline btn-success text-[11px] uppercase tracking-widest font-semibold transition-all duration-200 hover:scale-105"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                </svg>
                <span className="hidden sm:inline">Add Game</span> 
            </button>

            {/* Modal via Portal */}
            {isOpen && (
                <Portal>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

                        <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-base-200 border border-white/[0.08] rounded-2xl shadow-2xl">

                            {/* Header sticky */}
                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-base-200 border-b border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success">
                                            <path d="M12 8v8M8 12h8" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white tracking-tight">Add Game</h2>
                                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Fill in the game details</p>
                                    </div>
                                </div>
                                <button type="button" onClick={handleClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Form */}
                            <form ref={formRef} action={formAction} className="px-6 py-5 space-y-5">

                                {!state.success && state.message && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-error/10 border border-error/20 rounded-lg">
                                        <svg className="w-4 h-4 text-error shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                                        </svg>
                                        <p className="text-xs font-mono text-error/80">{state.message}</p>
                                    </div>
                                )}



                                {/* Title */}
                                <div>
                                    <label className={LABEL}>Title <span className="text-error">*</span></label>
                                    <input name="title" type="text"  placeholder="e.g. Black Myth: Wukong" defaultValue={state.oldValues?.title ?? ""} className={fc("title")} />
                                    {state.errors?.title && <p className={ERR_MSG}>⚠ {state.errors.title}</p>}
                                </div>

                                {/* Developer */}
                                <div>
                                    <label className={LABEL}>Developer <span className="text-error">*</span></label>
                                    <input name="developer" type="text"  placeholder="e.g. Game Science" defaultValue={state.oldValues?.developer ?? ""} className={fc("developer")} />
                                    {state.errors?.developer && <p className={ERR_MSG}>⚠ {state.errors.developer}</p>}
                                </div>

                                {/* Genre + Console */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={LABEL}>Genre <span className="text-error">*</span></label>
                                        <input name="genre" type="text"  placeholder="e.g. Action RPG" defaultValue={state.oldValues?.genre ?? ""} className={fc("genre")} />
                                        {state.errors?.genre && <p className={ERR_MSG}>⚠ {state.errors.genre}</p>}
                                    </div>
                                    <div>
                                        <label className={LABEL}>Console <span className="text-error">*</span></label>
                                        <select name="console_id"  defaultValue={state.oldValues?.console_id ?? ""} className={`${fc("console_id")} appearance-none cursor-pointer`}>
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
                                            <input name="price" type="number" step="0.01" min="0"  placeholder="59.99" defaultValue={state.oldValues?.price ?? ""} className={`${fc("price")} pl-8`} />
                                        </div>
                                        {state.errors?.price && <p className={ERR_MSG}>⚠ {state.errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className={LABEL}>Release Date <span className="text-error">*</span></label>
                                        <input name="releasedate" type="date"  defaultValue={state.oldValues?.releasedate ?? ""} className={`${fc("releasedate")} [color-scheme:dark] max-w-[130px] sm:max-w-none`} />
                                        {state.errors?.releasedate && <p className={ERR_MSG}>⚠ {state.errors.releasedate}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={LABEL}>Description</label>
                                    <textarea name="description" rows={3} placeholder="A short description of the game..." defaultValue={state.oldValues?.description ?? ""} className={`${fc("description")} resize-none`} />
                                    {state.errors?.description && <p className={ERR_MSG}>⚠ {state.errors.description}</p>}
                                </div>

                                <div className="border-t border-white/[0.06]" />

                                {/* Botones */}
                                <div className="flex items-center justify-end gap-3 pb-1">
                                    <button type="button" onClick={handleClose} className="btn btn-sm btn-ghost text-[11px] uppercase tracking-widest font-semibold text-white/40 hover:text-white/70">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isPending} className="btn btn-sm btn-success text-[11px] uppercase tracking-widest font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                        {isPending ? (
                                            <><span className="loading loading-spinner loading-xs" />Saving...</>
                                        ) : (
                                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                                <polyline points="17 21 17 13 7 13 7 21" />
                                                <polyline points="7 3 7 8 15 8" />
                                            </svg>Save Game</>
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