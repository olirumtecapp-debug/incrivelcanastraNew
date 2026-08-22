import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Header } from "./Header-6cvH0Y61.mjs";
import { b as isCanastra, h as newGame, i as Route$3, o as personaById, s as playAiTurn, x as isClean } from "./router-AV22IHyj.mjs";
import { t as TableView } from "./TableView-Dj0kLqSS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jogar-DWmT2Kzb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyStats = {
	wins: 0,
	losses: 0,
	bestScore: 0,
	canastrasLimpas: 0,
	canastrasSujas: 0
};
var KEY = "cr:stats";
function loadStats() {
	if (typeof window === "undefined") return emptyStats;
	try {
		return {
			...emptyStats,
			...JSON.parse(localStorage.getItem(KEY) ?? "{}")
		};
	} catch {
		return emptyStats;
	}
}
function saveStats(s) {
	if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
}
function recordResult(patch) {
	const cur = loadStats();
	saveStats({
		wins: cur.wins + (patch.wins ?? 0),
		losses: cur.losses + (patch.losses ?? 0),
		bestScore: Math.max(cur.bestScore, patch.bestScore ?? 0),
		canastrasLimpas: cur.canastrasLimpas + (patch.canastrasLimpas ?? 0),
		canastrasSujas: cur.canastrasSujas + (patch.canastrasSujas ?? 0)
	});
}
function Mesa() {
	const { ia } = Route$3.useSearch();
	const persona = (0, import_react.useMemo)(() => personaById(ia), [ia]);
	const [state, setState] = (0, import_react.useState)(null);
	const start = (0, import_react.useCallback)(() => {
		setState(newGame({
			playerName: "Você",
			aiName: persona.name,
			openMorto: true
		}));
	}, [persona]);
	(0, import_react.useEffect)(() => {
		start();
	}, [start]);
	(0, import_react.useEffect)(() => {
		if (!state || state.turn !== "ai" || state.phase === "over") return;
		const t = setTimeout(() => setState((s) => s ? playAiTurn(s, persona) : s), 900);
		return () => clearTimeout(t);
	}, [state, persona]);
	(0, import_react.useEffect)(() => {
		if (!state || state.phase !== "over" || !state.winner) return;
		const melds = state.players.player.melds;
		recordResult({
			wins: state.winner === "player" ? 1 : 0,
			losses: state.winner === "ai" ? 1 : 0,
			bestScore: state.players.player.score,
			canastrasLimpas: melds.filter(isClean).length,
			canastrasSujas: melds.filter((m) => isCanastra(m) && !isClean(m)).length
		});
	}, [state?.phase, state?.winner]);
	if (!state) return null;
	const me = state.players.player;
	const bot = state.players.ai;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[100dvh] flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableView, {
				state,
				seat: "player",
				onState: setState,
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Mesa contra ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gold-text",
					children: persona.name
				})] }),
				subtitle: `${persona.title} · ${persona.description}`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/como-jogar",
						className: "rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10",
						children: "Como jogar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: start,
						className: "rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10",
						children: "Nova"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10",
						children: "Sair"
					})
				] })
			}),
			state.phase === "over" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass animate-rise w-full max-w-md rounded-3xl p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "gold-text text-3xl font-bold",
							children: state.winner === "player" ? "Você bateu!" : `${bot.name} bateu`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Você: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[var(--gold)]",
									children: me.score
								}),
								" pontos"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								bot.name,
								": ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[var(--gold)]",
									children: bot.score
								}),
								" pontos"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: start,
								className: "rounded-full bg-[var(--gold)] px-5 py-2 font-semibold text-[var(--primary-foreground)]",
								children: "Jogar de novo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/perfil",
								className: "rounded-full border px-5 py-2",
								children: "Estatísticas"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Mesa as component };
