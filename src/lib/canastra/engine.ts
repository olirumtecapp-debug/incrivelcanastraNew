import type { Card, GameState, Meld, PlayerId } from "./types";
import {
  buildDeck,
  isCanastra,
  meldPoints,
  cardValue,
  shuffle,
  sortMeld,
  validateMeld,
  cardLabel,
} from "./rules";

let meldSeq = 0;
const newMeldId = () => `m${meldSeq++}`;

export interface NewGameOptions {
  playerName: string;
  aiName: string;
  openMorto: boolean;
}

export function newGame(opts: NewGameOptions): GameState {
  const deck = shuffle(buildDeck());
  const playerHand = deck.splice(0, 11);
  const aiHand = deck.splice(0, 11);
  const mortos = [deck.splice(0, 11), deck.splice(0, 11)];
  const discard = [deck.pop() as Card];
  return {
    stock: deck,
    discard,
    mortos,
    players: {
      player: {
        id: "player",
        name: opts.playerName,
        hand: playerHand,
        melds: [],
        tookMorto: false,
        score: 0,
      },
      ai: { id: "ai", name: opts.aiName, hand: aiHand, melds: [], tookMorto: false, score: 0 },
    },
    turn: "player",
    phase: "draw",
    log: ["A partida começou. Compre uma carta para iniciar."],
    winner: null,
    openMorto: opts.openMorto,
  };
}

const clone = (s: GameState): GameState => structuredClone(s);
const push = (s: GameState, msg: string) => {
  s.log = [msg, ...s.log].slice(0, 40);
};

export function drawFromStock(state: GameState, who: PlayerId): GameState {
  if (state.turn !== who || state.phase !== "draw") return state;
  const s = clone(state);
  if (s.stock.length === 0) return endRound(s, who === "player" ? "ai" : "player");
  const card = s.stock.pop() as Card;
  s.players[who].hand.push(card);
  s.phase = "play";
  push(s, `${s.players[who].name} comprou uma carta do monte.`);
  return s;
}

export function takeDiscardPile(state: GameState, who: PlayerId): GameState {
  if (state.turn !== who || state.phase !== "draw" || state.discard.length === 0) return state;
  const s = clone(state);
  const n = s.discard.length;
  s.players[who].hand.push(...s.discard);
  s.discard = [];
  s.phase = "play";
  push(s, `${s.players[who].name} pegou o lixo (${n} cartas).`);
  return s;
}

export function createMeld(state: GameState, who: PlayerId, cardIds: string[]): GameState {
  if (state.turn !== who || state.phase !== "play") return state;
  const hand = state.players[who].hand;
  const cards = cardIds.map((id) => hand.find((c) => c.id === id)).filter(Boolean) as Card[];
  const res = validateMeld(cards);
  if (!res.valid) return state;
  const s = clone(state);
  s.players[who].hand = s.players[who].hand.filter((c) => !cardIds.includes(c.id));
  s.players[who].melds.push({ id: newMeldId(), suit: res.suit!, cards: sortMeld(cards) });
  push(s, `${s.players[who].name} baixou um jogo de ${cards.length} cartas.`);
  return checkHandEmpty(s, who);
}

export function addToMeld(
  state: GameState,
  who: PlayerId,
  meldId: string,
  cardIds: string[],
): GameState {
  if (state.turn !== who || state.phase !== "play") return state;
  const p = state.players[who];
  const meld = p.melds.find((m) => m.id === meldId);
  if (!meld) return state;
  const cards = cardIds.map((id) => p.hand.find((c) => c.id === id)).filter(Boolean) as Card[];
  const merged = [...meld.cards, ...cards];
  if (!validateMeld(merged).valid) return state;
  const s = clone(state);
  const sp = s.players[who];
  sp.hand = sp.hand.filter((c) => !cardIds.includes(c.id));
  const m = sp.melds.find((x) => x.id === meldId)!;
  m.cards = sortMeld(merged);
  push(s, `${sp.name} complementou um jogo${isCanastra(m) ? " — canastra!" : "."}`);
  return checkHandEmpty(s, who);
}

export function discardCard(state: GameState, who: PlayerId, cardId: string): GameState {
  if (state.turn !== who || state.phase !== "play") return state;
  const s = clone(state);
  const p = s.players[who];
  const idx = p.hand.findIndex((c) => c.id === cardId);
  if (idx < 0) return state;
  const card = p.hand.splice(idx, 1)[0]!;
  s.discard.push(card);
  push(s, `${p.name} descartou ${cardLabel(card)}.`);

  if (p.hand.length === 0) {
    if (!p.tookMorto && s.mortos.length > 0) {
      p.hand = s.mortos.pop() as Card[];
      p.tookMorto = true;
      push(s, `${p.name} pegou o morto.`);
    } else if (p.melds.some(isCanastra)) {
      return endRound(s, who);
    }
  }
  s.turn = who === "player" ? "ai" : "player";
  s.phase = "draw";
  return s;
}

function checkHandEmpty(s: GameState, who: PlayerId): GameState {
  const p = s.players[who];
  if (p.hand.length === 0) {
    if (!p.tookMorto && s.mortos.length > 0) {
      p.hand = s.mortos.pop() as Card[];
      p.tookMorto = true;
      push(s, `${p.name} pegou o morto.`);
    } else if (p.melds.some(isCanastra)) {
      return endRound(s, who);
    }
  }
  return s;
}

export function scoreOf(state: GameState, who: PlayerId): number {
  const p = state.players[who];
  const melded = p.melds.reduce((sum, m) => sum + meldPoints(m), 0);
  const penalty = p.hand.reduce((sum, c) => sum + cardValue(c), 0);
  const mortoPenalty = p.tookMorto ? 0 : -100;
  return melded - penalty + mortoPenalty;
}

export function endRound(state: GameState, winner: PlayerId): GameState {
  const s = clone(state);
  s.phase = "over";
  s.winner = winner;
  s.players.player.score = scoreOf(s, "player") + (winner === "player" ? 100 : 0);
  s.players.ai.score = scoreOf(s, "ai") + (winner === "ai" ? 100 : 0);
  push(s, `Fim da rodada — ${s.players[winner].name} bateu!`);
  return s;
}

export function canMeld(hand: Card[], ids: string[]): boolean {
  const cards = ids.map((id) => hand.find((c) => c.id === id)).filter(Boolean) as Card[];
  return validateMeld(cards).valid;
}

export function canAppend(meld: Meld, hand: Card[], ids: string[]): boolean {
  const cards = ids.map((id) => hand.find((c) => c.id === id)).filter(Boolean) as Card[];
  if (cards.length === 0) return false;
  return validateMeld([...meld.cards, ...cards]).valid;
}
