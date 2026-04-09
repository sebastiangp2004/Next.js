import { PrismaClient } from "@/src/generated/prisma/client"; 
import { PrismaNeon } from "@prisma/adapter-neon";
import Image from "next/image";
import AddConsoleModal    from "@/components/AddConsoleModal";
import EditConsoleModal   from "@/components/EditConsoleModal";
import DeleteConsoleModal from "@/components/DeleteConsoleModal";

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
    }),
});

export default async function ConsolesInfo() {
    const consoles = await prisma.consoles.findMany({
        include: { games: true },
    });

    return (
        <div className="w-full min-h-screen bg-base-300 p-6 lg:p-10">

            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <h1 className="text-3xl font-bold text-white tracking-tight whitespace-nowrap">
                    Consoles
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary/60 uppercase tracking-widest whitespace-nowrap">
                        {consoles.length} Consoles
                    </span>

                    <AddConsoleModal />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {consoles.map((consoleItem) => (
                    <div
                        key={consoleItem.id}
                        className="group card bg-base-100/40 backdrop-blur-xl border border-white/[0.07] hover:border-primary/40 shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <figure className="relative h-44 overflow-hidden">
                            <Image
                                src={`/imgs/${consoleItem.image}`}
                                alt={consoleItem.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-base-300/90 via-transparent to-transparent" />
                        </figure>

                        <div className="card-body p-4 gap-0">
                            <h2 className="card-title text-base text-white font-bold leading-snug line-clamp-2 mb-3">
                                {consoleItem.name}
                            </h2>

                            <div className="space-y-1.5 mb-3">
                                <div className="flex items-center gap-12 text-xs">
                                    <span className="text-white/30 uppercase tracking-widest font-semibold text-[10px] w-14 shrink-0">Manufacturer</span>
                                    <span className="text-white/70 truncate">{consoleItem.manufacturer}</span>
                                </div>
                                <div className="flex items-center gap-12 text-xs">
                                    <span className="text-white/30 uppercase tracking-widest font-semibold text-[10px] w-14 shrink-0">Release</span>
                                    <span className="text-white/70">{new Date(consoleItem.releasedate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-12 text-xs">
                                    <span className="text-white/30 uppercase tracking-widest font-semibold text-[10px] w-14 shrink-0">Games</span>
                                    <span className="text-white/70">{consoleItem.games.length}</span>
                                </div>
                            </div>

                            <div className="divider my-0 before:bg-white/5 after:bg-white/5" />

                            <p className="text-white/30 text-[11px] leading-relaxed line-clamp-2 my-2">
                                {consoleItem.description}
                            </p>

                            <div className="card-actions items-center justify-between mt-1">
                                <span className="text-primary font-mono font-bold text-lg tracking-tight">
                                    &nbsp;
                                </span>
                                <div className="flex items-center gap-2">
                                    <EditConsoleModal console={consoleItem} />
                                    <DeleteConsoleModal
                                        consoleId={consoleItem.id}
                                        consoleName={consoleItem.name}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}