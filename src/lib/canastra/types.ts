export type Suit = "H" | "D" | "S" | "C";

export interface Card {
  id: string;
  /** null for joker */
  suit: Suit | null;
  /** 1 = ace, 11 = J, 12 = Q, 13 = K, 0 = joker */
  rank: number;
}

export interface Meld {
  id: string;
  suit: Suit;
  cards: Card[];
}

export type Difficulty =
  | "conservadora"
  | "agressiva"
  | "estrategica"
  | "calculista"
  | "imprevisivel"
  | "especialista"
  | "lenda";

export interface AiPersona {
  id: Difficulty;
  name: string;
  title: string;
  description: string;
  /** 0..1 — quanto mais alto, melhor joga */
  skill: number;
}

export type PlayerId = "player" | "ai";

export interface PlayerState {
  id: PlayerId;
  name: string;
  hand: Card[];
  melds: Meld[];
  tookMorto: boolean;
  score: number;
}

export type Phase = "draw" | "play" | "over";

export interface GameState {
  stock: Card[];
  discard: Card[];
  mortos: Card[][];
  players: Record<PlayerId, PlayerState>;
  turn: PlayerId;
  phase: Phase;
  log: string[];
  winner: PlayerId | null;
  /** true quando o buraco aberto (morto visível) está ativo */
  openMorto: boolean;
}
