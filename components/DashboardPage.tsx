import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Image from "next/image";
import ConsoleCharts from "@/components/ConsoleCharts";

const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function getDashboardData() {
    const [consoles, games] = await Promise.all([
        prisma.consoles.findMany({
            include: { games: true },
            orderBy: { releasedate: "asc" },
        }),
        prisma.games.findMany({
            include: { console: true },
            orderBy: { releasedate: "desc" },
        }),
    ]);

    const totalConsoles = consoles.length;
    const totalGames    = games.length;
    const avgPrice      = totalGames > 0
        ? games.reduce((sum, g) => sum + g.price, 0) / totalGames
        : 0;

    const mostExpensive = games.reduce<typeof games[0] | null>(
        (max, g) => (!max || g.price > max.price ? g : max), null
    );

    const richestConsole = [...consoles].sort(
        (a, b) => b.games.length - a.games.length
    )[0] ?? null;

    const recentGames = games.slice(0, 4);

    const chartData = consoles.map((c) => ({ name: c.name, value: c.games.length }));
    const pieData   = chartData.filter((d) => d.value > 0);
    const barData   = chartData;

    return {
        totalConsoles, totalGames, avgPrice,
        mostExpensive, richestConsole, recentGames,
        pieData, barData,
    };
}

function StatCard({
    label, value, sub, accent = "primary",
}: {
    label: string;
    value: string | number;
    sub?: string;
    accent?: "primary" | "success" | "info" | "warning";
}) {
    const colors: Record<string, string> = {
        primary: "border-primary/20 bg-primary/5 text-primary",
        success: "border-success/20 bg-success/5 text-success",
        info:    "border-info/20    bg-info/5    text-info",
        warning: "border-warning/20 bg-warning/5 text-warning",
    };
    return (
        <div className={`rounded-2xl border p-5 ${colors[accent]} backdrop-blur-xl`}>
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1">{label}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {sub && <p className="text-[11px] font-mono opacity-50 mt-1 truncate">{sub}</p>}
        </div>
    );
}

export default async function DashboardPage() {
    const {
        totalConsoles, totalGames, avgPrice,
        mostExpensive, richestConsole, recentGames,
        pieData, barData,
    } = await getDashboardData();

    return (
        <div className="w-full min-h-screen bg-base-300 p-6 lg:p-10 space-y-10">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-xs font-mono text-white/30 uppercase tracking-widest mt-0.5">
                        Overview of your game library
                    </p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent" />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Consoles" value={totalConsoles} sub="platforms registered" accent="primary" />
                <StatCard label="Total Games"    value={totalGames}    sub="across all platforms" accent="success" />
                <StatCard label="Avg. Price"     value={`$${avgPrice.toFixed(2)}`} sub="per game" accent="info" />
                <StatCard
                    label="Most Expensive"
                    value={mostExpensive ? `$${mostExpensive.price.toFixed(2)}` : "—"}
                    sub={mostExpensive?.title ?? "No games yet"}
                    accent="warning"
                />
            </div>

            {/* Gráficas */}
            <ConsoleCharts pieData={pieData} barData={barData} />

            {/* Últimos juegos */}
            <div className="bg-base-100/40 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-info">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Recently Added Games</h2>
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">latest 4 entries</p>
                    </div>
                </div>

                {recentGames.length === 0 ? (
                    <p className="text-white/20 text-sm font-mono text-center py-8">No games yet</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentGames.map((game) => (
                            <div key={game.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-info/30 transition-colors duration-200">
                                <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-white/[0.07]">
                                    <Image src={`/imgs/${game.cover}`} alt={game.title} fill className="object-cover" />
                                </div>
                                <div className="min-w-0 flex flex-col justify-between py-0.5">
                                    <div>
                                        <p className="text-xs font-bold text-white/90 line-clamp-2 leading-snug">{game.title}</p>
                                        <p className="text-[10px] font-mono text-white/30 mt-0.5 truncate">{game.genre}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] font-mono text-primary font-bold">${game.price.toFixed(2)}</span>
                                        <span className="text-[9px] font-mono text-white/20 truncate ml-1">{game.console.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Top Platform */}
            {richestConsole && (
                <div className="bg-base-100/40 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-6">
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">Top Platform</p>
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/[0.07] shrink-0">
                            <Image src={`/imgs/${richestConsole.image}`} alt={richestConsole.name} fill className="object-cover" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{richestConsole.name}</p>
                            <p className="text-[11px] font-mono text-white/30">
                                {richestConsole.games.length} {richestConsole.games.length === 1 ? "game" : "games"} · {richestConsole.manufacturer}
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}