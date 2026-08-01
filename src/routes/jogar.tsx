import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { PlayingCard } from "@/components/game/PlayingCard";
import { PERSONAS, personaById, playAiTurn } from "@/lib/canastra/ai";
import {
  addToMeld,
  canAppend,
  canMeld,
  createMeld,
  discardCard,
  drawFromStock,
  endRound,
  newGame,
  scoreOf,
  takeDiscardPile,
} from "@/lib/canastra/engine";
import { isCanastra, isClean, sortHand, SUIT_SYMBOL } from "@/lib/canastra/rules";
import type { Difficulty, GameState } from "@/lib/canastra/types";
import { recordResult } from "@/lib/stats";

const DIFFS = PERSONAS.map((p) => p.id);

export const Route = createFileRoute("/jogar")({
  validateSearch: (search: Record<string, unknown>): { ia: Difficulty } => {
    const ia = String(search.ia ?? "estrategica") as Difficulty;
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
  const [selected, setSelected] = useState<string[]>([]);

  const start = useCallback(() => {
    setSelected([]);
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
  const myTurn = state.turn === "player" && state.phase !== "over";
  const hand = sortHand(me.hand);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const act = (next: GameState, failMsg?: string) => {
    if (next === state) {
      if (failMsg) toast.error(failMsg);
      return;
    }
    setState(next);
    setSelected([]);
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-3 pb-28 sm:px-4">
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">
              Mesa contra <span className="gold-text">{persona.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {persona.title} · {persona.description}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={start}
              className="rounded-full border px-4 py-2 text-sm transition-colors hover:bg-[var(--gold)]/10"
            >
              Nova partida
            </button>
            <Link
              to="/"
              className="rounded-full border px-4 py-2 text-sm transition-colors hover:bg-[var(--gold)]/10"
            >
              Sair
            </Link>
          </div>
        </div>

        {/* Mesa */}
        <section className="mt-5 rounded-3xl border border-[var(--gold)]/25 bg-[radial-gradient(ellipse_at_center,var(--felt),var(--felt-deep))] p-4 shadow-[inset_0_2px_40px_rgba(0,0,0,0.55)] sm:p-6">
          {/* Adversário */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border ${state.turn === "ai" ? "border-[var(--gold)] animate-shimmer" : "border-white/20"}`}
              >
                ♣
              </div>
              <div>
                <p className="font-semibold">{bot.name}</p>
                <p className="text-xs text-white/70">{bot.hand.length} cartas na mão</p>
              </div>
            </div>
            <div className="flex -space-x-6">
              {bot.hand.slice(0, 8).map((c) => (
                <PlayingCard key={c.id} faceDown small />
              ))}
            </div>
          </div>

          <MeldRow title="Jogos do adversário" melds={bot.melds} />

          {/* Centro */}
          <div className="my-6 flex flex-wrap items-center justify-center gap-6">
            <button
              disabled={!myTurn || state.phase !== "draw"}
              onClick={() => act(drawFromStock(state, "player"), "Você já comprou nesta rodada.")}
              className="flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <PlayingCard faceDown />
              <span className="text-xs text-white/80">Monte ({state.stock.length})</span>
            </button>

            <button
              disabled={!myTurn || state.phase !== "draw" || state.discard.length === 0}
              onClick={() => act(takeDiscardPile(state, "player"), "Não é possível pegar o lixo.")}
              className="flex flex-col items-center gap-2 disabled:opacity-50"
            >
              {state.discard.length ? (
                <PlayingCard card={state.discard[state.discard.length - 1]} />
              ) : (
                <div className="h-24 w-16 rounded-xl border border-dashed border-white/30 sm:h-28 sm:w-19" />
              )}
              <span className="text-xs text-white/80">Lixo ({state.discard.length})</span>
            </button>

            <div className="flex flex-col items-center gap-2">
              <div className="flex -space-x-8">
                {state.mortos.map((_, i) => (
                  <PlayingCard key={i} faceDown />
                ))}
              </div>
              <span className="text-xs text-white/80">Mortos ({state.mortos.length})</span>
            </div>
          </div>

          <MeldRow
            title="Seus jogos"
            melds={me.melds}
            onMeldClick={(id) =>
              act(
                addToMeld(state, "player", id, selected),
                "Essas cartas não completam esse jogo.",
              )
            }
            highlight={selected.length > 0 && myTurn}
            appendable={(m) => canAppend(m, me.hand, selected)}
          />

          {/* Mão */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/80">
                Sua mão · {me.hand.length} cartas
                {me.tookMorto && " · morto pego"}
              </p>
              <p className="text-xs text-white/70">
                {state.phase === "over"
                  ? "Rodada encerrada"
                  : myTurn
                    ? state.phase === "draw"
                      ? "Sua vez: compre uma carta"
                      : "Baixe jogos e descarte"
                    : "Vez do adversário…"}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:-space-x-2 sm:gap-0">
              {hand.map((c, i) => (
                <PlayingCard
                  key={c.id}
                  card={c}
                  index={i}
                  selected={selected.includes(c.id)}
                  onClick={() => toggle(c.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Ações */}
        <div className="glass fixed inset-x-0 bottom-0 z-20 border-t px-4 py-3">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {selected.length} selecionada(s) · Sua pontuação estimada:{" "}
              <span className="text-[var(--gold)]">{scoreOf(state, "player")}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                disabled={!myTurn || state.phase !== "play" || !canMeld(me.hand, selected)}
                onClick={() =>
                  act(
                    createMeld(state, "player", selected),
                    "Sequência inválida — mesmo naipe, mínimo 3 cartas.",
                  )
                }
                className="rounded-full bg-[var(--gold)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-40"
              >
                Baixar jogo
              </button>
              <button
                disabled={!myTurn || state.phase !== "play" || selected.length !== 1}
                onClick={() => act(discardCard(state, "player", selected[0]!))}
                className="rounded-full border px-5 py-2 text-sm disabled:opacity-40"
              >
                Descartar
              </button>
              <button
                disabled={state.phase === "over"}
                onClick={() => act(endRound(state, "ai"))}
                className="rounded-full border px-5 py-2 text-sm text-muted-foreground disabled:opacity-40"
              >
                Desistir
              </button>
            </div>
          </div>
        </div>

        {state.phase === "over" && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
            <div className="glass animate-rise w-full max-w-md rounded-3xl p-8 text-center">
              <h2 className="gold-text text-3xl font-bold">
                {state.winner === "player" ? "Você bateu!" : `${bot.name} bateu`}
              </h2>
              <div className="mt-5 space-y-2 text-sm">
                <p>
                  Você: <span className="text-[var(--gold)]">{me.score}</span> pontos
                </p>
                <p>
                  {bot.name}: <span className="text-[var(--gold)]">{bot.score}</span> pontos
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={start}
                  className="rounded-full bg-[var(--gold)] px-5 py-2 font-semibold text-[var(--primary-foreground)]"
                >
                  Jogar de novo
                </button>
                <Link to="/perfil" className="rounded-full border px-5 py-2">
                  Estatísticas
                </Link>
              </div>
            </div>
          </div>
        )}

        <details className="glass mt-6 rounded-2xl p-4 text-sm">
          <summary className="cursor-pointer font-medium">Histórico da mesa</summary>
          <ul className="mt-3 space-y-1 text-muted-foreground">
            {state.log.map((l, i) => (
              <li key={i}>· {l}</li>
            ))}
          </ul>
        </details>
      </main>
    </>
  );
}

function MeldRow({
  title,
  melds,
  onMeldClick,
  highlight,
  appendable,
}: {
  title: string;
  melds: GameState["players"]["ai"]["melds"];
  onMeldClick?: (id: string) => void;
  highlight?: boolean;
  appendable?: (m: GameState["players"]["ai"]["melds"][number]) => boolean;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs tracking-widest text-white/60 uppercase">{title}</p>
      <div className="mt-2 flex flex-wrap gap-3">
        {melds.length === 0 && <p className="text-sm text-white/50">Nenhum jogo baixado.</p>}
        {melds.map((m) => {
          const ok = highlight && appendable?.(m);
          const Comp = onMeldClick ? "button" : "div";
          return (
            <Comp
              key={m.id}
              type={onMeldClick ? "button" : undefined}
              onClick={onMeldClick ? () => onMeldClick(m.id) : undefined}
              className={`rounded-xl border p-2 text-left transition-all ${
                ok ? "border-[var(--gold)] shadow-[0_0_20px_-6px_var(--gold)]" : "border-white/15"
              } ${isCanastra(m) ? "bg-[var(--gold)]/10" : "bg-black/20"}`}
            >
              <div className="flex -space-x-4">
                {m.cards.map((c, i) => (
                  <PlayingCard key={c.id} card={c} small index={i} />
                ))}
              </div>
              <p className="mt-1 text-[11px] text-white/70">
                {SUIT_SYMBOL[m.suit]} {m.cards.length} cartas
                {isCanastra(m) && (isClean(m) ? " · canastra limpa" : " · canastra suja")}
              </p>
            </Comp>
          );
        })}
      </div>
    </div>
  );
}
