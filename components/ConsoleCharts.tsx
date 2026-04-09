"use client";

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

// ================================================================
//  TIPOS
// ================================================================

interface ChartData {
    name: string;
    value: number;
}

interface ConsoleChartsProps {
    pieData:  ChartData[]; // { name: consoleName, value: gameCount }
    barData:  ChartData[]; // { name: consoleName, value: gameCount }
}

// ================================================================
//  PALETA DE COLORES
// ================================================================

const PALETTE = [
    "#818cf8", // indigo
    "#34d399", // emerald
    "#60a5fa", // blue
    "#f472b6", // pink
    "#fb923c", // orange
    "#a78bfa", // violet
    "#2dd4bf", // teal
    "#facc15", // yellow
];

// ================================================================
//  TOOLTIP PERSONALIZADO
// ================================================================

function CustomTooltip({ active, payload }: {
    active?: boolean;
    payload?: { name: string; value: number; payload: ChartData }[];
}) {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div className="bg-base-200 border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
            <p className="text-[11px] font-mono text-white/50 uppercase tracking-widest mb-0.5">
                {d.payload.name}
            </p>
            <p className="text-sm font-bold text-white">
                {d.value} {d.value === 1 ? "game" : "games"}
            </p>
        </div>
    );
}

// ================================================================
//  LEGEND PERSONALIZADO (pie)
// ================================================================

function CustomLegend({ payload }: {
    payload?: { value: string; color: string }[];
}) {
    if (!payload?.length) return null;
    return (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
            {payload.map((entry) => (
                <div key={entry.value} className="flex items-center gap-1.5">
                    <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: entry.color }}
                    />
                    <span className="text-[10px] font-mono text-white/50 truncate max-w-[80px]">
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ================================================================
//  COMPONENTE
// ================================================================

export default function ConsoleCharts({ pieData, barData }: ConsoleChartsProps) {
    const hasData = pieData.some((d) => d.value > 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Pie Chart — Consolas ── */}
            <div className="bg-base-100/40 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                            <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Consoles Share</h2>
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">by game count</p>
                    </div>
                </div>

                {!hasData ? (
                    <div className="flex items-center justify-center h-52 text-white/20 text-sm font-mono">
                        No games yet
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {pieData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={PALETTE[i % PALETTE.length]}
                                        stroke="transparent"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* ── Bar Chart — Juegos por consola — ocupa 2/3 ── */}
            <div className="lg:col-span-2 bg-base-100/40 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6"  y1="20" x2="6"  y2="14"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Games per Console</h2>
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">distribution</p>
                    </div>
                </div>

                {barData.length === 0 ? (
                    <div className="flex items-center justify-center h-52 text-white/20 text-sm font-mono">
                        No consoles yet
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={barData}
                            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                            barCategoryGap="30%"
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.04)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace" }}
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                // Acortar nombres largos
                                tickFormatter={(v: string) => v.length > 8 ? v.slice(0, 7) + "…" : v}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "monospace" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {barData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={PALETTE[i % PALETTE.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

        </div>
    );
}
