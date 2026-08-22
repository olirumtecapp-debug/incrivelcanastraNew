import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as Header } from "./Header-6cvH0Y61.mjs";
import { t as Footer } from "./Footer-ure3nlYh.mjs";
import { r as emptyStats } from "./router-AV22IHyj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-D7BC2RRX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function loadStats() {
	if (typeof window === "undefined") return emptyStats;
	try {
		return {
			...emptyStats,
			...JSON.parse(localStorage.getItem("cr:stats") ?? "{}")
		};
	} catch {
		return emptyStats;
	}
}
function saveStats(s) {
	if (typeof window !== "undefined") localStorage.setItem("cr:stats", JSON.stringify(s));
}
function Perfil() {
	const [stats, setStats] = (0, import_react.useState)(emptyStats);
	(0, import_react.useEffect)(() => setStats(loadStats()), []);
	const total = stats.wins + stats.losses;
	const rate = total ? Math.round(stats.wins / total * 100) : 0;
	const level = Math.floor(stats.wins / 3) + 1;
	const xp = stats.wins % 3 / 3 * 100;
	const cards = [
		{
			label: "Vitórias",
			value: stats.wins
		},
		{
			label: "Derrotas",
			value: stats.losses
		},
		{
			label: "Taxa de vitória",
			value: `${rate}%`
		},
		{
			label: "Maior pontuação",
			value: stats.bestScore
		},
		{
			label: "Canastras limpas",
			value: stats.canastrasLimpas
		},
		{
			label: "Canastras sujas",
			value: stats.canastrasSujas
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass animate-rise mt-10 flex flex-wrap items-center gap-5 rounded-3xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--gold)]/50 bg-[var(--gold)]/10 text-3xl",
						children: "♠"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-bold",
								children: "Convidado do Clube"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Nível ", level]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-[var(--gold)] transition-all",
									style: { width: `${xp}%` }
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-10 text-2xl font-semibold",
					children: "Estatísticas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "gold-text mt-1 text-3xl font-bold",
							children: c.value
						})]
					}, c.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						saveStats(emptyStats);
						setStats(emptyStats);
					},
					className: "mt-8 rounded-full border px-5 py-2 text-sm transition-colors hover:bg-[var(--gold)]/10",
					children: "Zerar estatísticas"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
}
//#endregion
export { Perfil as component, loadStats, saveStats };
