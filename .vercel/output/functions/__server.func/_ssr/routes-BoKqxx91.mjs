import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Gamepad2, i as Sparkles, l as Crown, n as Users, r as Trophy, s as Map } from "../_libs/lucide-react.mjs";
import { t as Header } from "./Header-6cvH0Y61.mjs";
import { t as Footer } from "./Footer-ure3nlYh.mjs";
import { a as PERSONAS } from "./router-AV22IHyj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BoKqxx91.js
var import_jsx_runtime = require_jsx_runtime();
var modes = [
	{
		icon: Gamepad2,
		title: "VS IA",
		desc: "Sete adversários com personalidade própria.",
		to: "/jogar"
	},
	{
		icon: Map,
		title: "Campanha",
		desc: "Conquiste um clube em cada estado do Brasil.",
		to: "/campanha"
	},
	{
		icon: Users,
		title: "Casual",
		desc: "Partida rápida, sem pressão e sem ranking.",
		to: "/jogar"
	},
	{
		icon: Sparkles,
		title: "Treino",
		desc: "Aprenda sequências, canastras e o morto.",
		to: "/jogar"
	}
];
function Lobby() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "animate-rise relative mt-10 overflow-hidden rounded-3xl border bg-gradient-to-br from-[var(--felt)]/45 to-transparent p-8 sm:p-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-shimmer pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--gold)]/20 blur-3xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.35em] text-[var(--gold)] uppercase",
							children: "Clube privado"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "gold-text mt-3 max-w-xl text-4xl font-bold sm:text-6xl",
							children: "A mesa de Canastra mais elegante do Brasil"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-lg text-muted-foreground",
							children: "Buraco aberto e fechado, curingas, morto e canastras limpas — com IA de verdade, animações suaves e uma mesa de veludo digna dos clubes clássicos."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/jogar",
									search: { ia: "estrategica" },
									className: "gold-ring rounded-full bg-[var(--gold)] px-6 py-3 font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-105",
									children: "Jogar agora"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/online",
									className: "rounded-full border border-[var(--gold)]/60 px-6 py-3 font-medium transition-colors hover:bg-[var(--gold)]/10",
									children: "Jogar online com código"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/campanha",
									className: "rounded-full border px-6 py-3 font-medium transition-colors hover:bg-[var(--gold)]/10",
									children: "Ver campanha"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold",
						children: "Modos de jogo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: modes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: m.to,
							search: m.to === "/jogar" ? { ia: "estrategica" } : void 0,
							className: "glass group animate-rise rounded-2xl p-5 transition-transform hover:-translate-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, { className: "h-6 w-6 text-[var(--gold)]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 text-lg font-semibold",
									children: m.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: m.desc
								})
							]
						}, m.title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold",
							children: "Escolha seu adversário"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Sete dificuldades, sete personalidades na mesa."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
							children: PERSONAS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/jogar",
								search: { ia: p.id },
								className: "glass flex items-start gap-3 rounded-2xl p-4 transition-colors hover:border-[var(--gold)]/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs tracking-wide text-[var(--gold)] uppercase",
										children: p.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: p.description
									})
								] })]
							}, p.id))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "glass mt-12 flex flex-wrap items-center gap-4 rounded-2xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-6 w-6 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Entretenimento puro: sem apostas com dinheiro real, prêmios financeiros ou qualquer mecanismo de jogo de azar."
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
}
//#endregion
export { Lobby as component };
