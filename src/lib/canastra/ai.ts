import type { AiPersona, Card, Difficulty, GameState } from "./types";
import { cardValue, isWild, validateMeld } from "./rules";
import { addToMeld, createMeld, discardCard, drawFromStock, takeDiscardPile } from "./engine";

export const PERSONAS: AiPersona[] = [
  {
    id: "conservadora",
    name: "Dona Zilda",
    title: "Conservadora",
    description: "Guarda cartas, baixa pouco e evita riscos.",
    skill: 0.15,
  },
  {
    id: "agressiva",
    name: "Tião Fogo",
    title: "Agressiva",
    description: "Baixa tudo o que pode e corre para bater.",
    skill: 0.3,
  },
  {
    id: "estrategica",
    name: "Clara Moreira",
    title: "Estratégica",
    description: "Equilibra ataque e defesa com leitura de mesa.",
    skill: 0.45,
  },
  {
    id: "calculista",
    name: "Professor Braga",
    title: "Calculista",
    description: "Conta cartas e calcula probabilidades de descarte.",
    skill: 0.6,
  },
  {
    id: "imprevisivel",
    name: "Curinga",
    title: "Imprevisível",
    description: "Muda de estilo no meio da mão só para te confundir.",
    skill: 0.55,
  },
  {
    id: "especialista",
    name: "Mestre Alencar",
    title: "Especialista",
    description: "Sabe exatamente quando pegar o lixo.",
    skill: 0.8,
  },
  {
    id: "lenda",
    name: "A Lenda do Clube",
    title: "Lenda",
    description: "Nunca perdeu uma mesa. Dizem que nem pisca.",
    skill: 0.95,
  },
];

export const personaById = (id: Difficulty): AiPersona =>
  PERSONAS.find((p) => p.id === id) ?? PERSONAS[2]!;

function combos(cards: Card[], size: number): Card[][] {
  const out: Card[][] = [];
  const rec = (start: number, acc: Card[]) => {
    if (acc.length === size) {
      out.push([...acc]);
      return;
    }
    for (let i = start; i < cards.length; i++) rec(i + 1, [...acc, cards[i]!]);
  };
  rec(0, []);
  return out;
}

/** Executa o turno completo da IA e devolve o novo estado. */
export function playAiTurn(state: GameState, persona: AiPersona): GameState {
  let s = state;
  if (s.turn !== "ai" || s.phase !== "draw") return s;

  const wantsPile =
    s.discard.length > 0 &&
    s.discard.length <= 3 + Math.round(persona.skill * 6) &&
    Math.random() < persona.skill;
  s = wantsPile ? takeDiscardPile(s, "ai") : drawFromStock(s, "ai");
  if (s.phase === "over") return s;

  const aggression = persona.skill;
  let guard = 0;
  while (guard++ < 12) {
    const ai = s.players.ai;
    let acted = false;

    // complementar jogos existentes
    for (const meld of ai.melds) {
      const candidate = ai.hand.find((c) => validateMeld([...meld.cards, c]).valid);
      if (candidate) {
        const next = addToMeld(s, "ai", meld.id, [candidate.id]);
        if (next !== s) {
          s = next;
          acted = true;
          break;
        }
      }
    }
    if (acted) continue;
    if (s.phase === "over") return s;

    // baixar jogos novos
    if (Math.random() < 0.35 + aggression * 0.65) {
      const hand = s.players.ai.hand;
      const found = [5, 4, 3]
        .flatMap((n) => (hand.length >= n ? combos(hand, n) : []))
        .find((set) => validateMeld(set).valid);
      if (found) {
        const next = createMeld(
          s,
          "ai",
          found.map((c) => c.id),
        );
        if (next !== s) {
          s = next;
          acted = true;
        }
      }
    }
    if (!acted) break;
    if (s.phase === "over") return s;
  }

  if (s.phase === "over") return s;

  // descarte: menor valor, evitando curingas
  const hand = s.players.ai.hand;
  if (hand.length === 0) return s;
  const sorted = [...hand].sort(
    (a, b) => cardValue(a) + (isWild(a) ? 100 : 0) - (cardValue(b) + (isWild(b) ? 100 : 0)),
  );
  const noise = Math.random() > persona.skill ? Math.min(2, sorted.length - 1) : 0;
  return discardCard(s, "ai", sorted[noise]!.id);
}
