import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { PlayingCard } from "@/components/game/PlayingCard";
import {
  addToMeld,
  canAppend,
  canMeld,
  createMeld,
  discardCard,
  drawFromStock,
  endRound,
  scoreOf,
  takeDiscardPile,
} from "@/lib/canastra/engine";
import { isCanastra, isClean, sortHand, SUIT_SYMBOL } from "@/lib/canastra/rules";
import type { GameState, Meld, PlayerId } from "@/lib/canastra/types";

interface Props {
  state: GameState;
  /** assento controlado por este cliente */
  seat: PlayerId;
  onState: (next: GameState) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** desabilita interação (ex.: aguardando adversário online) */
  locked?: boolean;
  waitingLabel?: string;
}

export function TableView({
  state,
  seat,
  onState,
  title,
  subtitle,
  actions,
  locked,
  waitingLabel = "Vez do adversário…",
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);

  const oppSeat: PlayerId = seat === "player" ? "ai" : "player";
  const me = state.players[seat];
  const opp = state.players[oppSeat];
  const myTurn = !locked && state.turn === seat && state.phase !== "over";
  const hand = sortHand(me.hand);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const act = (next: GameState, failMsg?: string) => {
    if (next === state) {
      if (failMsg) toast.error(failMsg);
      return;
    }
    setSelected([]);
    onState(next);
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col gap-2 px-2 py-2 sm:px-4">
      <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold sm:text-xl">{title}</h1>
          {subtitle && (
            <p className="truncate text-[11px] text-muted-foreground sm:text-xs">{subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1.5 text-xs">{actions}</div>
      </div>

      <section className="relative flex min-h-0 flex-1 flex-col gap-1 overflow-hidden rounded-2xl border border-[var(--gold)]/25 bg-[radial-gradient(ellipse_at_center,var(--felt),var(--felt-deep))] p-2 shadow-[inset_0_2px_40px_rgba(0,0,0,0.55)] sm:gap-2 sm:p-4">
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${state.turn === oppSeat ? "animate-shimmer border-[var(--gold)]" : "border-white/20"}`}
            >
              ♣
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{opp.name}</p>
              <p className="text-[11px] text-white/70">{opp.hand.length} cartas na mão</p>
            </div>
          </div>
          <div className="flex -space-x-5 sm:-space-x-6">
            {opp.hand.slice(0, 8).map((c) => (
              <PlayingCard key={c.id} faceDown small />
            ))}
          </div>
        </div>

        <MeldRow title={`Jogos de ${opp.name}`} melds={opp.melds} />

        <div className="flex min-h-0 flex-1 flex-wrap items-center justify-center gap-4 sm:gap-8">
          <button
            disabled={!myTurn || state.phase !== "draw"}
            onClick={() => act(drawFromStock(state, seat), "Você já comprou nesta rodada.")}
            className="flex flex-col items-center gap-1 disabled:opacity-50"
          >
            <PlayingCard faceDown />
            <span className="text-[11px] text-white/80">Monte ({state.stock.length})</span>
          </button>

          <button
            disabled={!myTurn || state.phase !== "draw" || state.discard.length === 0}
            onClick={() => act(takeDiscardPile(state, seat), "Não é possível pegar o lixo.")}
            className="flex flex-col items-center gap-1 disabled:opacity-50"
          >
            {state.discard.length ? (
              <PlayingCard card={state.discard[state.discard.length - 1]} />
            ) : (
              <div className="aspect-[5/7] h-[clamp(64px,11vh,116px)] rounded-[12%] border border-dashed border-white/30" />
            )}
            <span className="text-[11px] text-white/80">Lixo ({state.discard.length})</span>
          </button>

          <div className="flex flex-col items-center gap-1">
            <div className="flex -space-x-7">
              {state.mortos.map((_, i) => (
                <PlayingCard key={i} faceDown />
              ))}
            </div>
            <span className="text-[11px] text-white/80">Mortos ({state.mortos.length})</span>
          </div>
        </div>

        <MeldRow
          title="Seus jogos"
          melds={me.melds}
          onMeldClick={(id) =>
            act(addToMeld(state, seat, id, selected), "Essas cartas não completam esse jogo.")
          }
          highlight={selected.length > 0 && myTurn}
          appendable={(m) => canAppend(m, me.hand, selected)}
        />

        <div className="shrink-0">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] text-white/80">
              Sua mão · {me.hand.length} cartas
              {me.tookMorto && " · morto pego"}
            </p>
            <p className="truncate text-[11px] text-white/70">
              {state.phase === "over"
                ? "Rodada encerrada"
                : myTurn
                  ? state.phase === "draw"
                    ? "Sua vez: compre uma carta"
                    : "Baixe jogos e descarte"
                  : waitingLabel}
            </p>
          </div>
          <div className="mt-1 flex justify-center -space-x-5 px-1 pt-3 pb-2 sm:-space-x-3 md:-space-x-2">
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

      <div className="relative flex shrink-0 flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground sm:text-sm">
          {selected.length} selecionada(s) · Pontuação:{" "}
          <span className="text-[var(--gold)]">{scoreOf(state, seat)}</span>
          <button
            onClick={() => setShowLog((v) => !v)}
            className="ml-2 underline underline-offset-4 hover:text-foreground"
          >
            Histórico
          </button>
        </p>
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <button
            disabled={!myTurn || state.phase !== "play" || !canMeld(me.hand, selected)}
            onClick={() =>
              act(createMeld(state, seat, selected), "Sequência inválida — mesmo naipe, mínimo 3 cartas.")
            }
            className="rounded-full bg-[var(--gold)] px-4 py-1.5 font-semibold text-[var(--primary-foreground)] disabled:opacity-40"
          >
            Baixar jogo
          </button>
          <button
            disabled={!myTurn || state.phase !== "play" || selected.length !== 1}
            onClick={() => act(discardCard(state, seat, selected[0]!))}
            className="rounded-full border px-4 py-1.5 disabled:opacity-40"
          >
            Descartar
          </button>
          <button
            disabled={state.phase === "over"}
            onClick={() => act(endRound(state, oppSeat))}
            className="rounded-full border px-4 py-1.5 text-muted-foreground disabled:opacity-40"
          >
            Desistir
          </button>
        </div>

        {showLog && (
          <div className="glass animate-rise absolute bottom-full left-0 z-30 mb-2 max-h-[40vh] w-full max-w-md overflow-y-auto rounded-2xl p-4 text-sm">
            <p className="mb-2 font-medium">Histórico da mesa</p>
            <ul className="space-y-1 text-muted-foreground">
              {state.log.map((l, i) => (
                <li key={i}>· {l}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
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
  melds: Meld[];
  onMeldClick?: (id: string) => void;
  highlight?: boolean;
  appendable?: (m: Meld) => boolean;
}) {
  return (
    <div className="shrink-0">
      <p className="text-[10px] tracking-widest text-white/60 uppercase">{title}</p>
      <div className="mt-1 flex gap-2 overflow-x-auto pb-1">
        {melds.length === 0 && <p className="text-xs text-white/50">Nenhum jogo baixado.</p>}
        {melds.map((m) => {
          const ok = highlight && appendable?.(m);
          const Comp = onMeldClick ? "button" : "div";
          return (
            <Comp
              key={m.id}
              type={onMeldClick ? "button" : undefined}
              onClick={onMeldClick ? () => onMeldClick(m.id) : undefined}
              className={`shrink-0 rounded-xl border p-1.5 text-left transition-all ${
                ok ? "border-[var(--gold)] shadow-[0_0_20px_-6px_var(--gold)]" : "border-white/15"
              } ${isCanastra(m) ? "bg-[var(--gold)]/10" : "bg-black/20"}`}
            >
              <div className="flex -space-x-3">
                {m.cards.map((c, i) => (
                  <PlayingCard key={c.id} card={c} small index={i} />
                ))}
              </div>
              <p className="mt-1 text-[10px] text-white/70">
                {SUIT_SYMBOL[m.suit]} {m.cards.length} cartas
                {isCanastra(m) && (isClean(m) ? " · limpa" : " · suja")}
              </p>
            </Comp>
          );
        })}
      </div>
    </div>
  );
}
