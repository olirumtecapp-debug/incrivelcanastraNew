import type { Card, Meld, Suit } from "./types";

export const SUITS: Suit[] = ["H", "D", "S", "C"];
export const SUIT_SYMBOL: Record<Suit, string> = { H: "♥", D: "♦", S: "♠", C: "♣" };
export const RANK_LABEL: Record<number, string> = {
  0: "★",
  1: "A",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
};

export const isJoker = (c: Card) => c.rank === 0;
export const isWild = (c: Card) => c.rank === 0 || c.rank === 2;

export function cardLabel(c: Card) {
  return isJoker(c) ? "Coringa" : `${RANK_LABEL[c.rank]}${SUIT_SYMBOL[c.suit as Suit]}`;
}

export function cardValue(c: Card): number {
  if (c.rank === 0) return 20;
  if (c.rank === 2) return 10;
  if (c.rank === 1) return 15;
  if (c.rank >= 8) return 10;
  return 5;
}

export function buildDeck(): Card[] {
  const cards: Card[] = [];
  let n = 0;
  for (let d = 0; d < 2; d++) {
    for (const suit of SUITS) {
      for (let rank = 1; rank <= 13; rank++) {
        cards.push({ id: `c${n++}`, suit, rank });
      }
    }
    cards.push({ id: `c${n++}`, suit: null, rank: 0 });
    cards.push({ id: `c${n++}`, suit: null, rank: 0 });
  }
  return cards;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Um jogo válido é uma sequência do mesmo naipe (mín. 3 cartas),
 * com no máximo um curinga. Ás pode ser baixo (antes do 2) ou alto (depois do K).
 */
export function validateMeld(cards: Card[]): { valid: boolean; suit?: Suit; reason?: string } {
  if (cards.length < 3) return { valid: false, reason: "Mínimo de 3 cartas." };
  const wilds = cards.filter(isWild);
  const naturals = cards.filter((c) => !isWild(c));
  if (wilds.length > 1) return { valid: false, reason: "Apenas um curinga por jogo." };
  if (naturals.length < 2) return { valid: false, reason: "Cartas naturais insuficientes." };

  const suits = new Set(naturals.map((c) => c.suit));
  if (suits.size > 1) return { valid: false, reason: "Todas as cartas devem ser do mesmo naipe." };
  const suit = naturals[0]!.suit as Suit;

  // curinga de 2 precisa ser do mesmo naipe apenas se usado como natural — aqui é sempre curinga
  const size = cards.length;
  for (const aceHigh of [false, true]) {
    const ranks = naturals.map((c) => (aceHigh && c.rank === 1 ? 14 : c.rank));
    if (new Set(ranks).size !== ranks.length) continue;
    const min = Math.min(...ranks);
    const max = Math.max(...ranks);
    if (max - min + 1 > size) continue;
    // janelas possíveis
    for (let start = Math.max(aceHigh ? 2 : 1, max - size + 1); start <= min; start++) {
      const end = start + size - 1;
      if (end > 14) break;
      if (!aceHigh && end > 13) break;
      const holes = size - naturals.length;
      if (ranks.every((r) => r >= start && r <= end) && holes === wilds.length) {
        return { valid: true, suit };
      }
    }
  }
  return { valid: false, reason: "As cartas não formam uma sequência." };
}

export function sortMeld(cards: Card[]): Card[] {
  const naturals = cards.filter((c) => !isWild(c)).sort((a, b) => a.rank - b.rank);
  const wilds = cards.filter(isWild);
  return [...naturals, ...wilds];
}

export function isCanastra(m: Meld) {
  return m.cards.length >= 7;
}
export function isClean(m: Meld) {
  return isCanastra(m) && m.cards.every((c) => !isWild(c));
}

export function meldPoints(m: Meld): number {
  const base = m.cards.reduce((s, c) => s + cardValue(c), 0);
  if (!isCanastra(m)) return base;
  return base + (isClean(m) ? 200 : 100);
}

export function sortHand(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const aw = isWild(a) ? 1 : 0;
    const bw = isWild(b) ? 1 : 0;
    if (aw !== bw) return aw - bw;
    const s = SUITS.indexOf(a.suit as Suit) - SUITS.indexOf(b.suit as Suit);
    if (s !== 0) return s;
    return a.rank - b.rank;
  });
}
