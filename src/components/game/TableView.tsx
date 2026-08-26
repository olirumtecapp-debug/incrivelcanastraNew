import { useState, useEffect, type ReactNode } from "react";
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
import { isCanastra, isClean, sortHand, SUIT_SYMBOL, validateMeld } from "@/lib/canastra/rules";
import type { Card, GameState, Meld, PlayerId } from "@/lib/canastra/types";

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
  onPlayAgain?: () => void;
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
  onPlayAgain,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [hideRoundOverModal, setHideRoundOverModal] = useState(false);

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

  const triggerInstantWin = (winner: PlayerId = seat) => {
    if (state.phase === "over") return;
    const s: GameState = JSON.parse(JSON.stringify(state));
    const winningPlayer = s.players[winner];
    if (winningPlayer.melds.length === 0) {
      winningPlayer.melds.push({
        id: "cheat_canastra_limpa",
        suit: "H",
        cards: [
          { id: "c_cheat_1", suit: "H", rank: 3 },
          { id: "c_cheat_2", suit: "H", rank: 4 },
          { id: "c_cheat_3", suit: "H", rank: 5 },
          { id: "c_cheat_4", suit: "H", rank: 6 },
          { id: "c_cheat_5", suit: "H", rank: 7 },
          { id: "c_cheat_6", suit: "H", rank: 8 },
          { id: "c_cheat_7", suit: "H", rank: 9 },
        ],
      });
    }
    winningPlayer.hand = [];
    winningPlayer.tookMorto = true;
    const finalState = endRound(s, winner);
    act(finalState);
    toast.success(`🏆 Trapaça: Vitória imediata de ${winningPlayer.name}!`);
  };

  useEffect(() => {
    const handleInstantWinEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ winner?: PlayerId }>;
      const targetWinner: PlayerId = customEvent.detail?.winner || seat;
      triggerInstantWin(targetWinner);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Atalho: Alt + W (Vencer partida imediatamente)
      if (e.altKey && (e.key === "W" || e.key === "w")) {
        e.preventDefault();
        triggerInstantWin(seat);
      }
    };

    window.addEventListener("ADMIN_INSTANT_WIN", handleInstantWinEvent);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("ADMIN_INSTANT_WIN", handleInstantWinEvent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state, seat]);

  const handleDrawFromStock = () => {
    if (state.phase === "over") {
      toast.info("A rodada foi encerrada.");
      return;
    }
    if (!myTurn) {
      toast.warning("Aguarde a vez do adversário.");
      return;
    }
    if (state.phase !== "draw") {
      toast.info("Você já comprou nesta rodada! Baixe jogos ou selecione 1 carta para descartar.");
      return;
    }
    act(drawFromStock(state, seat));
  };

  const handleTakeDiscard = () => {
    if (state.phase === "over") {
      toast.info("A rodada foi encerrada.");
      return;
    }
    if (state.discard.length === 0) {
      toast.info("O Lixo está vazio. Compre uma carta do Monte!");
      return;
    }
    if (!myTurn) {
      toast.warning("Aguarde a vez do adversário.");
      return;
    }
    if (state.phase !== "draw") {
      toast.info("Você já comprou nesta rodada! Baixe jogos ou selecione 1 carta para descartar.");
      return;
    }
    act(takeDiscardPile(state, seat));
  };

  const handleCreateMeld = () => {
    if (state.phase === "over") {
      toast.info("A rodada foi encerrada.");
      return;
    }
    if (!myTurn) {
      toast.warning("Aguarde a sua vez para jogar.");
      return;
    }
    if (state.phase === "draw") {
      toast.warning("Compre uma carta do Monte ou Lixo antes de baixar jogos.");
      return;
    }
    if (selected.length === 0) {
      toast.info("Selecione cartas da sua mão para formar uma sequência de mesmo naipe.");
      return;
    }
    if (selected.length < 3) {
      toast.warning(
        `Você selecionou apenas ${selected.length} carta(s). Para baixar um jogo, selecione no mínimo 3 cartas do mesmo naipe em sequência.`,
      );
      return;
    }
    const cards = selected.map((id) => me.hand.find((c) => c.id === id)).filter(Boolean) as Card[];
    const res = validateMeld(cards);
    if (!res.valid) {
      toast.error(
        res.reason ||
          "Sequência inválida! As cartas precisam ser do mesmo naipe e em ordem consecutiva (ex: 4, 5, 6 ou com curinga 2/★).",
      );
      return;
    }
    act(createMeld(state, seat, selected));
  };

  const handleDiscard = () => {
    if (state.phase === "over") {
      toast.info("A rodada foi encerrada.");
      return;
    }
    if (!myTurn) {
      toast.warning("Aguarde a sua vez para descartar.");
      return;
    }
    if (state.phase === "draw") {
      toast.warning("Compre uma carta do Monte ou Lixo antes de descartar.");
      return;
    }
    if (selected.length === 0) {
      toast.warning("Selecione 1 carta da sua mão para descartar e passar a vez.");
      return;
    }
    if (selected.length > 1) {
      toast.warning(
        `Você selecionou ${selected.length} cartas. Para descartar, selecione apenas 1 carta da sua mão.`,
      );
      return;
    }
    act(discardCard(state, seat, selected[0]!));
  };

  const handleMeldClick = (id: string) => {
    if (state.phase === "over") return;
    if (!myTurn) {
      toast.warning("Aguarde a sua vez para jogar cartas.");
      return;
    }
    if (state.phase === "draw") {
      toast.warning("Compre uma carta do Monte ou Lixo antes de encaixar cartas na mesa.");
      return;
    }
    if (selected.length === 0) {
      toast.info("Selecione primeiro uma carta da sua mão para encaixar nesta sequência.");
      return;
    }
    const targetMeld = me.melds.find((m) => m.id === id);
    if (targetMeld && !canAppend(targetMeld, me.hand, selected)) {
      toast.error(
        "Essas cartas não encaixam neste jogo. Elas precisam continuar a sequência do mesmo naipe.",
      );
      return;
    }
    act(addToMeld(state, seat, id, selected), "Essas cartas não completam esse jogo.");
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
        <div className="flex shrink-0 items-center gap-1.5 text-xs">{actions}</div>
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
            onClick={handleDrawFromStock}
            className={`flex flex-col items-center gap-1 transition-opacity ${
              myTurn && state.phase === "draw"
                ? "cursor-pointer hover:scale-105"
                : "opacity-60 cursor-pointer"
            }`}
          >
            <PlayingCard faceDown />
            <span className="text-[11px] text-white/80">Monte ({state.stock.length})</span>
          </button>

          <button
            onClick={handleTakeDiscard}
            className={`flex flex-col items-center gap-1 transition-opacity ${
              myTurn && state.phase === "draw" && state.discard.length > 0
                ? "cursor-pointer hover:scale-105"
                : "opacity-60 cursor-pointer"
            }`}
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
          onMeldClick={handleMeldClick}
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
            onClick={handleCreateMeld}
            className={`rounded-full px-4 py-1.5 font-semibold transition-all cursor-pointer ${
              myTurn && state.phase === "play" && selected.length >= 3
                ? "bg-[var(--gold)] text-[var(--primary-foreground)] shadow-[0_0_15px_-3px_var(--gold)] scale-105"
                : "bg-[var(--gold)]/70 text-[var(--primary-foreground)] opacity-60"
            }`}
          >
            Baixar jogo
          </button>
          <button
            onClick={handleDiscard}
            className={`rounded-full border px-4 py-1.5 font-medium transition-all cursor-pointer ${
              myTurn && state.phase === "play" && selected.length === 1
                ? "border-[var(--gold)] bg-[var(--gold)]/20 text-white shadow-[0_0_12px_-3px_var(--gold)] scale-105"
                : "border-white/20 opacity-60"
            }`}
          >
            Descartar
          </button>
          <button
            disabled={state.phase === "over"}
            onClick={() => act(endRound(state, oppSeat))}
            className="rounded-full border px-4 py-1.5 text-muted-foreground disabled:opacity-40 cursor-pointer"
          >
            Desistir
          </button>
          <button
            disabled={state.phase === "over"}
            onClick={() => triggerInstantWin(seat)}
            title="Clique para bater a partida e testar a tela de vitória imediatamente"
            className="rounded-full border border-amber-500/50 bg-amber-500/15 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            ⚡ Ganhar (Teste)
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

        {state.phase === "over" && hideRoundOverModal && (
          <button
            onClick={() => setHideRoundOverModal(false)}
            className="absolute bottom-full right-4 z-30 mb-3 rounded-full bg-[var(--gold)] px-4 py-1.5 text-xs font-bold text-[var(--primary-foreground)] shadow-lg cursor-pointer"
          >
            🏆 Ver Placar da Partida
          </button>
        )}

        {state.phase === "over" && !hideRoundOverModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass animate-rise w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center border border-[var(--gold)]/40 shadow-2xl">
              {(() => {
                const p1 = state.players.player;
                const p2 = state.players.ai;
                const isTie = p1.score === p2.score;
                const winnerId = state.winner ?? (p1.score >= p2.score ? "player" : "ai");
                const winnerObj = state.players[winnerId];
                const didIWin = !isTie && winnerId === seat;

                const getStats = (p: typeof me) => ({
                  cleanCanastras: p.melds.filter(isClean).length,
                  dirtyCanastras: p.melds.filter((m) => isCanastra(m) && !isClean(m)).length,
                  cardsInHand: p.hand.length,
                  tookMorto: p.tookMorto,
                  didBatida: state.winner === p.id,
                });

                const meStats = getStats(me);
                const oppStats = getStats(opp);

                return (
                  <>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/20 text-3xl">
                      {isTie ? "🤝" : didIWin ? "🏆" : "🃏"}
                    </div>

                    <h2 className="gold-text text-2xl sm:text-3xl font-bold font-display">
                      {isTie
                        ? "Empate na Pontuação!"
                        : didIWin
                          ? `Parabéns, ${me.name}! Você Venceu!`
                          : `Vitória de ${winnerObj.name}!`}
                    </h2>

                    <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
                      No Buraco/Canastra, a vitória fica com quem somar mais pontos totais:
                      canastras limpas (+200), canastras sujas (+100), cartas baixadas, desconto das cartas na mão e bônus de batida (+100).
                    </p>

                    {/* Placar Comparativo */}
                    <div className="mt-6 grid grid-cols-2 gap-3 text-left">
                      {/* Cartão Meu */}
                      <div
                        className={`rounded-2xl border p-4 transition-all ${
                          (didIWin || (isTie && seat === "player"))
                            ? "border-[var(--gold)] bg-[var(--gold)]/10 shadow-[0_0_15px_-4px_var(--gold)]"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm truncate">{me.name}</p>
                          {(didIWin || isTie) && <span className="text-xs">🏆</span>}
                        </div>
                        <p className="gold-text mt-1 text-2xl sm:text-3xl font-bold font-display">
                          {me.score} <span className="text-xs font-sans text-muted-foreground font-normal">pts</span>
                        </p>
                        <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                          <p>· Canastras limpas: <span className="text-white font-medium">{meStats.cleanCanastras} (+{meStats.cleanCanastras * 200})</span></p>
                          <p>· Canastras sujas: <span className="text-white font-medium">{meStats.dirtyCanastras} (+{meStats.dirtyCanastras * 100})</span></p>
                          <p>· Cartas na mão: <span className="text-white font-medium">{meStats.cardsInHand}</span></p>
                          <p>· Pegou morto: <span className="text-white font-medium">{meStats.tookMorto ? "Sim" : "Não (-100)"}</span></p>
                          {meStats.didBatida && <p className="text-[var(--gold)] font-medium">· Bateu a partida (+100)</p>}
                        </div>
                      </div>

                      {/* Cartão Adversário */}
                      <div
                        className={`rounded-2xl border p-4 transition-all ${
                          (!didIWin && !isTie)
                            ? "border-[var(--gold)] bg-[var(--gold)]/10 shadow-[0_0_15px_-4px_var(--gold)]"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm truncate">{opp.name}</p>
                          {!didIWin && !isTie && <span className="text-xs">🏆</span>}
                        </div>
                        <p className="gold-text mt-1 text-2xl sm:text-3xl font-bold font-display">
                          {opp.score} <span className="text-xs font-sans text-muted-foreground font-normal">pts</span>
                        </p>
                        <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                          <p>· Canastras limpas: <span className="text-white font-medium">{oppStats.cleanCanastras} (+{oppStats.cleanCanastras * 200})</span></p>
                          <p>· Canastras sujas: <span className="text-white font-medium">{oppStats.dirtyCanastras} (+{oppStats.dirtyCanastras * 100})</span></p>
                          <p>· Cartas na mão: <span className="text-white font-medium">{oppStats.cardsInHand}</span></p>
                          <p>· Pegou morto: <span className="text-white font-medium">{oppStats.tookMorto ? "Sim" : "Não (-100)"}</span></p>
                          {oppStats.didBatida && <p className="text-[var(--gold)] font-medium">· Bateu a partida (+100)</p>}
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      {onPlayAgain && (
                        <button
                          onClick={() => {
                            setHideRoundOverModal(false);
                            onPlayAgain();
                          }}
                          className="rounded-full bg-[var(--gold)] px-6 py-2.5 text-xs sm:text-sm font-bold text-[var(--primary-foreground)] shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                          Jogar Novamente
                        </button>
                      )}
                      <button
                        onClick={() => setHideRoundOverModal(true)}
                        className="rounded-full border border-white/20 px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Examinar Mesa
                      </button>
                      <a
                        href="/"
                        className="rounded-full border border-white/20 px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
                      >
                        Sair para o Início
                      </a>
                    </div>
                  </>
                );
              })()}
            </div>
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
