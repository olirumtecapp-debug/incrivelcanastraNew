import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { TableView } from "@/components/game/TableView";
import { PERSONAS, personaById, playAiTurn } from "@/lib/canastra/ai";
import { newGame } from "@/lib/canastra/engine";
import { isCanastra, isClean } from "@/lib/canastra/rules";
import type { Difficulty, GameState } from "@/lib/canastra/types";
import { recordResult } from "@/lib/stats";

const DIFFS = PERSONAS.map((p) => p.id);

export const Route = createFileRoute("/jogar")({
  validateSearch: (search: Record<string, unknown>): { ia: Difficulty } => {
    const ia = String(search['ia'] ?? "estrategica") as Difficulty;
    return { ia: DIFFS.includes(ia) ? ia : "estrategica" };
  },
  head: () => ({
    meta: [
      { title: "Mesa de jogo — Canastra Royale" },
      {
        name: "description",
        content:
          "Entre na mesa de veludo e jogue Canastra contra a IA: compre, baixe jogos, forme canastras e bata primeiro.",
      },
      { property: "og:title", content: "Mesa de jogo — Canastra Royale" },
      {
        property: "og:description",
        content: "Compre, baixe jogos, forme canastras e bata primeiro.",
      },
    ],
  }),
  component: Mesa,
});

function Mesa() {
  const { ia } = Route.useSearch();
  const persona = useMemo(() => personaById(ia), [ia]);
  const [state, setState] = useState<GameState | null>(null);

  const start = useCallback(() => {
    setState(newGame({ playerName: "Você", aiName: persona.name, openMorto: true }));
  }, [persona]);

  useEffect(() => {
    start();
  }, [start]);

  // Turno da IA
  useEffect(() => {
    if (!state || state.turn !== "ai" || state.phase === "over") return;
    const t = setTimeout(() => setState((s) => (s ? playAiTurn(s, persona) : s)), 900);
    return () => clearTimeout(t);
  }, [state, persona]);

  // Registro de estatísticas
  useEffect(() => {
    if (!state || state.phase !== "over" || !state.winner) return;
    const melds = state.players.player.melds;
    recordResult({
      wins: state.winner === "player" ? 1 : 0,
      losses: state.winner === "ai" ? 1 : 0,
      bestScore: state.players.player.score,
      canastrasLimpas: melds.filter(isClean).length,
      canastrasSujas: melds.filter((m) => isCanastra(m) && !isClean(m)).length,
    });
  }, [state?.phase, state?.winner]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!state) return null;

  const me = state.players.player;
  const bot = state.players.ai;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <div className="shrink-0">
        <Header />
      </div>

      <TableView
        state={state}
        seat="player"
        onState={setState}
        onPlayAgain={start}
        title={
          <>
            Mesa contra <span className="gold-text">{persona.name}</span>
          </>
        }
        subtitle={`${persona.title} · ${persona.description}`}
        actions={
          <>
            <Link
              to="/como-jogar"
              className="rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10"
            >
              Como jogar
            </Link>
            <button
              onClick={start}
              className="rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10"
            >
              Nova
            </button>
            <Link
              to="/"
              className="rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10"
            >
              Sair
            </Link>
          </>
        }
      />
    </div>
  );
}
