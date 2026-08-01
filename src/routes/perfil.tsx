import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil e estatísticas — Canastra Royale" },
      {
        name: "description",
        content:
          "Acompanhe vitórias, derrotas, taxa de vitória, canastras limpas e sujas no seu perfil de Canastra Royale.",
      },
      { property: "og:title", content: "Perfil e estatísticas — Canastra Royale" },
      {
        property: "og:description",
        content: "Suas estatísticas de mesa, progressão e conquistas.",
      },
    ],
  }),
  component: Perfil,
});

export interface Stats {
  wins: number;
  losses: number;
  bestScore: number;
  canastrasLimpas: number;
  canastrasSujas: number;
}

export const emptyStats: Stats = {
  wins: 0,
  losses: 0,
  bestScore: 0,
  canastrasLimpas: 0,
  canastrasSujas: 0,
};

export function loadStats(): Stats {
  if (typeof window === "undefined") return emptyStats;
  try {
    return { ...emptyStats, ...JSON.parse(localStorage.getItem("cr:stats") ?? "{}") };
  } catch {
    return emptyStats;
  }
}

export function saveStats(s: Stats) {
  if (typeof window !== "undefined") localStorage.setItem("cr:stats", JSON.stringify(s));
}

function Perfil() {
  const [stats, setStats] = useState<Stats>(emptyStats);
  useEffect(() => setStats(loadStats()), []);

  const total = stats.wins + stats.losses;
  const rate = total ? Math.round((stats.wins / total) * 100) : 0;
  const level = Math.floor(stats.wins / 3) + 1;
  const xp = ((stats.wins % 3) / 3) * 100;

  const cards = [
    { label: "Vitórias", value: stats.wins },
    { label: "Derrotas", value: stats.losses },
    { label: "Taxa de vitória", value: `${rate}%` },
    { label: "Maior pontuação", value: stats.bestScore },
    { label: "Canastras limpas", value: stats.canastrasLimpas },
    { label: "Canastras sujas", value: stats.canastrasSujas },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <div className="glass animate-rise mt-10 flex flex-wrap items-center gap-5 rounded-3xl p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--gold)]/50 bg-[var(--gold)]/10 text-3xl">
            ♠
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Convidado do Clube</h1>
            <p className="text-sm text-muted-foreground">Nível {level}</p>
            <div className="mt-3 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[var(--gold)] transition-all"
                style={{ width: `${xp}%` }}
              />
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-semibold">Estatísticas</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="glass rounded-2xl p-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="gold-text mt-1 text-3xl font-bold">{c.value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            saveStats(emptyStats);
            setStats(emptyStats);
          }}
          className="mt-8 rounded-full border px-5 py-2 text-sm transition-colors hover:bg-[var(--gold)]/10"
        >
          Zerar estatísticas
        </button>
      </main>
    </>
  );
}
