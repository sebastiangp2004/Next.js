"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createConsole, type ActionState } from "@/app/consoles/Admin/Actions";
import Portal from "@/components/Portal";

const INITIAL_STATE: ActionState = { success: false };

const INPUT_BASE = "w-full px-3.5 py-2 bg-white/[0.04] border rounded text-sm text-white/80 placeholder:text-white/20 outline-none transition-all duration-200 font-mono";
const INPUT_OK   = "border-white/[0.07] focus:border-primary/40";
const INPUT_ERR  = "border-error/50 focus:border-error/70 bg-error/[0.03]";
const LABEL      = "block text-[10px] font-mono font-semibold uppercase tracking-widest text-white/30 mb-1.5";
const ERR_MSG    = "mt-1 text-[10px] font-mono text-error/80";

export default function AddConsoleModal() {

    const [isOpen, setIsOpen]       = useState(false);
    const [preview, setPreview]     = useState<string | null>(null);
    const [imageName, setImageName] = useState("");

    const fileRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction, isPending] = useActionState(createConsole, INITIAL_STATE);

    // useCallback para que handleClose sea estable y pueda entrar en deps del useEffect
    const handleClose = useCallback(() => {
        setIsOpen(false);
        setPreview(null);
        setImageName("");
        formRef.current?.reset();
    }, []);

    // Depender del objeto `state` entero: useActionState siempre devuelve
    // una nueva referencia al completar la acción, así el efecto se dispara
    // incluso si success ya era true en una ejecución anterior.
    useEffect(() => {
        if (state.success) handleClose();
    }, [state, handleClose]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageName(file.name);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleClearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setImageName("");
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
                <span className="hidden sm:inline">Add Console</span>
            </button>

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
                                        <h2 className="text-base font-bold text-white tracking-tight">Add Console</h2>
                                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Fill in the console details</p>
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

                                {/* Image */}
                                <div>
                                    <label className={LABEL}>Console Image <span className="text-error">*</span></label>
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className={`relative w-full h-40 rounded-lg border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-200
                                            ${preview ? "border-primary/30"
                                                : state.errors?.image ? "border-error/40 bg-error/[0.03] hover:border-error/60"
                                                : "border-white/[0.08] bg-white/[0.02] hover:border-primary/30 hover:bg-white/[0.04]"
                                            }`}
                                    >
                                        {preview ? (
                                            <>
                                                <Image src={preview} alt="Console preview" fill className="object-contain bg-base-300" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-base-300/80 via-transparent to-transparent" />
                                                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                                                    <span className="text-[10px] font-mono text-white/70 truncate pr-2">{imageName}</span>
                                                    <button type="button" onClick={handleClearImage} className="shrink-0 w-5 h-5 rounded bg-error/20 border border-error/30 flex items-center justify-center text-error hover:bg-error/30 transition-colors">
                                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 6 6 18M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${state.errors?.image ? "bg-error/10 border-error/20" : "bg-white/[0.04] border-white/[0.07]"}`}>
                                                    <svg className={`w-4 h-4 ${state.errors?.image ? "text-error/50" : "text-white/20"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                                    </svg>
                                                </div>
                                                <p className={`text-[11px] font-mono uppercase tracking-widest ${state.errors?.image ? "text-error/50" : "text-white/20"}`}>Click to upload image</p>
                                                <p className="text-[10px] font-mono text-white/10">JPG, PNG, WEBP · Max 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    {state.errors?.image && <p className={ERR_MSG}>⚠ {state.errors.image}</p>}
                                    <input ref={fileRef} name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                                </div>

                                {/* Name */}
                                <div>
                                    <label className={LABEL}>Name <span className="text-error">*</span></label>
                                    <input name="name" type="text" required placeholder="e.g. PlayStation 5" defaultValue={state.oldValues?.name ?? ""} className={fc("name")} />
                                    {state.errors?.name && <p className={ERR_MSG}>⚠ {state.errors.name}</p>}
                                </div>

                                {/* Manufacturer + Release Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={LABEL}>Manufacturer <span className="text-error">*</span></label>
                                        <input name="manufacturer" type="text" required placeholder="e.g. Sony" defaultValue={state.oldValues?.manufacturer ?? ""} className={fc("manufacturer")} />
                                        {state.errors?.manufacturer && <p className={ERR_MSG}>⚠ {state.errors.manufacturer}</p>}
                                    </div>
                                    <div>
                                        <label className={LABEL}>Release Date <span className="text-error">*</span></label>
                                        <input name="releasedate" type="date" required defaultValue={state.oldValues?.releasedate ?? ""} className={`${fc("releasedate")} [color-scheme:dark] max-w-[130px] sm:max-w-none`} />
                                        {state.errors?.releasedate && <p className={ERR_MSG}>⚠ {state.errors.releasedate}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={LABEL}>Description</label>
                                    <textarea name="description" rows={4} placeholder="A short description of the console..." defaultValue={state.oldValues?.description ?? ""} className={`${fc("description")} resize-none`} />
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
                                            </svg>Save Console</>
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