import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as createRootRouteWithContext, b as useRouter, d as HeadContent, g as createFileRoute, h as lazyRouteComponent, m as Outlet, p as createRouter, u as Scripts, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as __exportAll } from "./server-BeNcsVaN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rules-CRGhOowe.js
var SUITS = [
	"H",
	"D",
	"S",
	"C"
];
var SUIT_SYMBOL = {
	H: "♥",
	D: "♦",
	S: "♠",
	C: "♣"
};
var RANK_LABEL = {
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
	13: "K"
};
var isJoker = (c) => c.rank === 0;
var isWild = (c) => c.rank === 0 || c.rank === 2;
function cardLabel(c) {
	return isJoker(c) ? "Coringa" : `${RANK_LABEL[c.rank]}${SUIT_SYMBOL[c.suit]}`;
}
function cardValue(c) {
	if (c.rank === 0) return 20;
	if (c.rank === 2) return 10;
	if (c.rank === 1) return 15;
	if (c.rank >= 8) return 10;
	return 5;
}
function buildDeck() {
	const cards = [];
	let n = 0;
	for (let d = 0; d < 2; d++) {
		for (const suit of SUITS) for (let rank = 1; rank <= 13; rank++) cards.push({
			id: `c${n++}`,
			suit,
			rank
		});
		cards.push({
			id: `c${n++}`,
			suit: null,
			rank: 0
		});
		cards.push({
			id: `c${n++}`,
			suit: null,
			rank: 0
		});
	}
	return cards;
}
function shuffle(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
/**
* Um jogo válido é uma sequência do mesmo naipe (mín. 3 cartas),
* com no máximo um curinga. Ás pode ser baixo (antes do 2) ou alto (depois do K).
*/
function validateMeld(cards) {
	if (cards.length < 3) return {
		valid: false,
		reason: "Mínimo de 3 cartas."
	};
	const wilds = cards.filter(isWild);
	const naturals = cards.filter((c) => !isWild(c));
	if (wilds.length > 1) return {
		valid: false,
		reason: "Apenas um curinga por jogo."
	};
	if (naturals.length < 2) return {
		valid: false,
		reason: "Cartas naturais insuficientes."
	};
	if (new Set(naturals.map((c) => c.suit)).size > 1) return {
		valid: false,
		reason: "Todas as cartas devem ser do mesmo naipe."
	};
	const suit = naturals[0].suit;
	const size = cards.length;
	for (const aceHigh of [false, true]) {
		const ranks = naturals.map((c) => aceHigh && c.rank === 1 ? 14 : c.rank);
		if (new Set(ranks).size !== ranks.length) continue;
		const min = Math.min(...ranks);
		const max = Math.max(...ranks);
		if (max - min + 1 > size) continue;
		for (let start = Math.max(aceHigh ? 2 : 1, max - size + 1); start <= min; start++) {
			const end = start + size - 1;
			if (end > 14) break;
			if (!aceHigh && end > 13) break;
			const holes = size - naturals.length;
			if (ranks.every((r) => r >= start && r <= end) && holes === wilds.length) return {
				valid: true,
				suit
			};
		}
	}
	return {
		valid: false,
		reason: "As cartas não formam uma sequência."
	};
}
function sortMeld(cards) {
	const naturals = cards.filter((c) => !isWild(c)).sort((a, b) => a.rank - b.rank);
	const wilds = cards.filter(isWild);
	return [...naturals, ...wilds];
}
function isCanastra(m) {
	return m.cards.length >= 7;
}
function isClean(m) {
	return isCanastra(m) && m.cards.every((c) => !isWild(c));
}
function meldPoints(m) {
	const base = m.cards.reduce((s, c) => s + cardValue(c), 0);
	if (!isCanastra(m)) return base;
	return base + (isClean(m) ? 200 : 100);
}
function sortHand(cards) {
	return [...cards].sort((a, b) => {
		const aw = isWild(a) ? 1 : 0;
		const bw = isWild(b) ? 1 : 0;
		if (aw !== bw) return aw - bw;
		const s = SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
		if (s !== 0) return s;
		return a.rank - b.rank;
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/engine-CQ6l4Wam.js
var meldSeq = 0;
var newMeldId = () => `m${meldSeq++}`;
function newGame(opts) {
	const deck = shuffle(buildDeck());
	const playerHand = deck.splice(0, 11);
	const aiHand = deck.splice(0, 11);
	const mortos = [deck.splice(0, 11), deck.splice(0, 11)];
	return {
		stock: deck,
		discard: [deck.pop()],
		mortos,
		players: {
			player: {
				id: "player",
				name: opts.playerName,
				hand: playerHand,
				melds: [],
				tookMorto: false,
				score: 0
			},
			ai: {
				id: "ai",
				name: opts.aiName,
				hand: aiHand,
				melds: [],
				tookMorto: false,
				score: 0
			}
		},
		turn: "player",
		phase: "draw",
		log: ["A partida começou. Compre uma carta para iniciar."],
		winner: null,
		openMorto: opts.openMorto
	};
}
var clone = (s) => structuredClone(s);
var push = (s, msg) => {
	s.log = [msg, ...s.log].slice(0, 40);
};
function drawFromStock(state, who) {
	if (state.turn !== who || state.phase !== "draw") return state;
	const s = clone(state);
	if (s.stock.length === 0) return endRound(s, who === "player" ? "ai" : "player");
	const card = s.stock.pop();
	s.players[who].hand.push(card);
	s.phase = "play";
	push(s, `${s.players[who].name} comprou uma carta do monte.`);
	return s;
}
function takeDiscardPile(state, who) {
	if (state.turn !== who || state.phase !== "draw" || state.discard.length === 0) return state;
	const s = clone(state);
	const n = s.discard.length;
	s.players[who].hand.push(...s.discard);
	s.discard = [];
	s.phase = "play";
	push(s, `${s.players[who].name} pegou o lixo (${n} cartas).`);
	return s;
}
function createMeld(state, who, cardIds) {
	if (state.turn !== who || state.phase !== "play") return state;
	const hand = state.players[who].hand;
	const cards = cardIds.map((id) => hand.find((c) => c.id === id)).filter(Boolean);
	const res = validateMeld(cards);
	if (!res.valid) return state;
	const s = clone(state);
	s.players[who].hand = s.players[who].hand.filter((c) => !cardIds.includes(c.id));
	s.players[who].melds.push({
		id: newMeldId(),
		suit: res.suit,
		cards: sortMeld(cards)
	});
	push(s, `${s.players[who].name} baixou um jogo de ${cards.length} cartas.`);
	return checkHandEmpty(s, who);
}
function addToMeld(state, who, meldId, cardIds) {
	if (state.turn !== who || state.phase !== "play") return state;
	const p = state.players[who];
	const meld = p.melds.find((m) => m.id === meldId);
	if (!meld) return state;
	const cards = cardIds.map((id) => p.hand.find((c) => c.id === id)).filter(Boolean);
	const merged = [...meld.cards, ...cards];
	if (!validateMeld(merged).valid) return state;
	const s = clone(state);
	const sp = s.players[who];
	sp.hand = sp.hand.filter((c) => !cardIds.includes(c.id));
	const m = sp.melds.find((x) => x.id === meldId);
	m.cards = sortMeld(merged);
	push(s, `${sp.name} complementou um jogo${isCanastra(m) ? " — canastra!" : "."}`);
	return checkHandEmpty(s, who);
}
function discardCard(state, who, cardId) {
	if (state.turn !== who || state.phase !== "play") return state;
	const s = clone(state);
	const p = s.players[who];
	const idx = p.hand.findIndex((c) => c.id === cardId);
	if (idx < 0) return state;
	const card = p.hand.splice(idx, 1)[0];
	s.discard.push(card);
	push(s, `${p.name} descartou ${cardLabel(card)}.`);
	if (p.hand.length === 0) {
		if (!p.tookMorto && s.mortos.length > 0) {
			p.hand = s.mortos.pop();
			p.tookMorto = true;
			push(s, `${p.name} pegou o morto.`);
		} else if (p.melds.some(isCanastra)) return endRound(s, who);
	}
	s.turn = who === "player" ? "ai" : "player";
	s.phase = "draw";
	return s;
}
function checkHandEmpty(s, who) {
	const p = s.players[who];
	if (p.hand.length === 0) {
		if (!p.tookMorto && s.mortos.length > 0) {
			p.hand = s.mortos.pop();
			p.tookMorto = true;
			push(s, `${p.name} pegou o morto.`);
		} else if (p.melds.some(isCanastra)) return endRound(s, who);
	}
	return s;
}
function scoreOf(state, who) {
	const p = state.players[who];
	const melded = p.melds.reduce((sum, m) => sum + meldPoints(m), 0);
	const penalty = p.hand.reduce((sum, c) => sum + cardValue(c), 0);
	const mortoPenalty = p.tookMorto ? 0 : -100;
	return melded - penalty + mortoPenalty;
}
function endRound(state, winner) {
	const s = clone(state);
	s.phase = "over";
	s.winner = winner;
	s.players.player.score = scoreOf(s, "player") + (winner === "player" ? 100 : 0);
	s.players.ai.score = scoreOf(s, "ai") + (winner === "ai" ? 100 : 0);
	push(s, `Fim da rodada — ${s.players[winner].name} bateu!`);
	return s;
}
function canMeld(hand, ids) {
	return validateMeld(ids.map((id) => hand.find((c) => c.id === id)).filter(Boolean)).valid;
}
function canAppend(meld, hand, ids) {
	const cards = ids.map((id) => hand.find((c) => c.id === id)).filter(Boolean);
	if (cards.length === 0) return false;
	return validateMeld([...meld.cards, ...cards]).valid;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/ai-qbQV993m.js
var PERSONAS = [
	{
		id: "conservadora",
		name: "Dona Zilda",
		title: "Conservadora",
		description: "Guarda cartas, baixa pouco e evita riscos.",
		skill: .15
	},
	{
		id: "agressiva",
		name: "Tião Fogo",
		title: "Agressiva",
		description: "Baixa tudo o que pode e corre para bater.",
		skill: .3
	},
	{
		id: "estrategica",
		name: "Clara Moreira",
		title: "Estratégica",
		description: "Equilibra ataque e defesa com leitura de mesa.",
		skill: .45
	},
	{
		id: "calculista",
		name: "Professor Braga",
		title: "Calculista",
		description: "Conta cartas e calcula probabilidades de descarte.",
		skill: .6
	},
	{
		id: "imprevisivel",
		name: "Curinga",
		title: "Imprevisível",
		description: "Muda de estilo no meio da mão só para te confundir.",
		skill: .55
	},
	{
		id: "especialista",
		name: "Mestre Alencar",
		title: "Especialista",
		description: "Sabe exatamente quando pegar o lixo.",
		skill: .8
	},
	{
		id: "lenda",
		name: "A Lenda do Clube",
		title: "Lenda",
		description: "Nunca perdeu uma mesa. Dizem que nem pisca.",
		skill: .95
	}
];
var personaById = (id) => PERSONAS.find((p) => p.id === id) ?? PERSONAS[2];
function combos(cards, size) {
	const out = [];
	const rec = (start, acc) => {
		if (acc.length === size) {
			out.push([...acc]);
			return;
		}
		for (let i = start; i < cards.length; i++) rec(i + 1, [...acc, cards[i]]);
	};
	rec(0, []);
	return out;
}
/** Executa o turno completo da IA e devolve o novo estado. */
function playAiTurn(state, persona) {
	let s = state;
	if (s.turn !== "ai" || s.phase !== "draw") return s;
	s = s.discard.length > 0 && s.discard.length <= 3 + Math.round(persona.skill * 6) && Math.random() < persona.skill ? takeDiscardPile(s, "ai") : drawFromStock(s, "ai");
	if (s.phase === "over") return s;
	const aggression = persona.skill;
	let guard = 0;
	while (guard++ < 12) {
		const ai = s.players.ai;
		let acted = false;
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
		if (Math.random() < .35 + aggression * .65) {
			const hand = s.players.ai.hand;
			const found = [
				5,
				4,
				3
			].flatMap((n) => hand.length >= n ? combos(hand, n) : []).find((set) => validateMeld(set).valid);
			if (found) {
				const next = createMeld(s, "ai", found.map((c) => c.id));
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
	const hand = s.players.ai.hand;
	if (hand.length === 0) return s;
	const sorted = [...hand].sort((a, b) => cardValue(a) + (isWild(a) ? 100 : 0) - (cardValue(b) + (isWild(b) ? 100 : 0)));
	const noise = Math.random() > persona.skill ? Math.min(2, sorted.length - 1) : 0;
	return discardCard(s, "ai", sorted[noise].id);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-AV22IHyj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-SVU9V2au.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Canastra Royale" },
			{
				name: "description",
				content: "Canastra brasileira em estilo clube privado."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: "dark",
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-BoKqxx91.mjs");
var Route$6 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Canastra Royale — Buraco brasileiro premium" },
		{
			name: "description",
			content: "Jogue Canastra (Buraco) contra IAs com personalidade própria, avance na campanha pelos clubes do Brasil e colecione itens cosméticos."
		},
		{
			property: "og:title",
			content: "Canastra Royale — Buraco brasileiro premium"
		},
		{
			property: "og:description",
			content: "Mesa de Canastra em estilo clube privado: IA avançada, campanha e progressão."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./campanha-D211DH7T.mjs");
var Route$5 = createFileRoute("/campanha")({
	head: () => ({ meta: [
		{ title: "Campanha pelos clubes do Brasil — Canastra Royale" },
		{
			name: "description",
			content: "Percorra clubes exclusivos em cada estado, enfrente adversários lendários e conquiste troféus na campanha de Canastra Royale."
		},
		{
			property: "og:title",
			content: "Campanha pelos clubes do Brasil — Canastra Royale"
		},
		{
			property: "og:description",
			content: "Clubes estaduais, adversários únicos e troféus a cada vitória."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./como-jogar-CtDvrr2-.mjs");
var Route$4 = createFileRoute("/como-jogar")({
	head: () => ({ meta: [
		{ title: "Como jogar Canastra — regras e mecânica passo a passo" },
		{
			name: "description",
			content: "Aprenda a jogar Canastra (Buraco): como montar sequências do mesmo naipe, usar curingas, pegar o lixo, formar canastras limpas e sujas e bater."
		},
		{
			property: "og:title",
			content: "Como jogar Canastra — regras e mecânica"
		},
		{
			property: "og:description",
			content: "Guia completo de sequências, curingas, morto, canastras e pontuação."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./jogar-DWmT2Kzb.mjs");
var DIFFS = PERSONAS.map((p) => p.id);
var Route$3 = createFileRoute("/jogar")({
	validateSearch: (search) => {
		const ia = String(search["ia"] ?? "estrategica");
		return { ia: DIFFS.includes(ia) ? ia : "estrategica" };
	},
	head: () => ({ meta: [
		{ title: "Mesa de jogo — Canastra Royale" },
		{
			name: "description",
			content: "Entre na mesa de veludo e jogue Canastra contra a IA: compre, baixe jogos, forme canastras e bata primeiro."
		},
		{
			property: "og:title",
			content: "Mesa de jogo — Canastra Royale"
		},
		{
			property: "og:description",
			content: "Compre, baixe jogos, forme canastras e bata primeiro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./online-Bd8k6jOP.mjs");
var Route$2 = createFileRoute("/online")({
	head: () => ({ meta: [
		{ title: "Partida online por código — Canastra Royale" },
		{
			name: "description",
			content: "Crie uma sala e compartilhe o código de 6 letras para jogar Canastra online com um amigo em tempo real."
		},
		{
			property: "og:title",
			content: "Partida online por código — Canastra Royale"
		},
		{
			property: "og:description",
			content: "Crie uma sala, compartilhe o código e jogue Canastra em tempo real."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./perfil-D7BC2RRX.mjs");
var Route$1 = createFileRoute("/perfil")({
	head: () => ({ meta: [
		{ title: "Perfil e estatísticas — Canastra Royale" },
		{
			name: "description",
			content: "Acompanhe vitórias, derrotas, taxa de vitória, canastras limpas e sujas no seu perfil de Canastra Royale."
		},
		{
			property: "og:title",
			content: "Perfil e estatísticas — Canastra Royale"
		},
		{
			property: "og:description",
			content: "Suas estatísticas de mesa, progressão e conquistas."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var emptyStats = {
	wins: 0,
	losses: 0,
	bestScore: 0,
	canastrasLimpas: 0,
	canastrasSujas: 0
};
var $$splitComponentImporter = () => import("./sala-CWJA0_f0.mjs");
var Route = createFileRoute("/sala")({
	ssr: false,
	validateSearch: (s) => ({ code: String(s["code"] ?? "").toUpperCase().slice(0, 6) }),
	head: () => ({ meta: [
		{ title: "Sala online — Canastra Royale" },
		{
			name: "description",
			content: "Mesa online de Canastra em tempo real com um amigo através do código da sala."
		},
		{
			property: "og:title",
			content: "Sala online — Canastra Royale"
		},
		{
			property: "og:description",
			content: "Mesa online de Canastra em tempo real."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	CampanhaRoute: Route$5.update({
		id: "/campanha",
		path: "/campanha",
		getParentRoute: () => Route$7
	}),
	ComoJogarRoute: Route$4.update({
		id: "/como-jogar",
		path: "/como-jogar",
		getParentRoute: () => Route$7
	}),
	JogarRoute: Route$3.update({
		id: "/jogar",
		path: "/jogar",
		getParentRoute: () => Route$7
	}),
	OnlineRoute: Route$2.update({
		id: "/online",
		path: "/online",
		getParentRoute: () => Route$7
	}),
	PerfilRoute: Route$1.update({
		id: "/perfil",
		path: "/perfil",
		getParentRoute: () => Route$7
	}),
	SalaRoute: Route.update({
		id: "/sala",
		path: "/sala",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { sortHand as C, isJoker as S, takeDiscardPile as _, PERSONAS as a, isCanastra as b, addToMeld as c, createMeld as d, discardCard as f, scoreOf as g, newGame as h, Route$3 as i, canAppend as l, endRound as m, Route as n, personaById as o, drawFromStock as p, emptyStats as r, playAiTurn as s, router_exports as t, canMeld as u, RANK_LABEL as v, isClean as x, SUIT_SYMBOL as y };
