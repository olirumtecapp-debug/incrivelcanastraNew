import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Header } from "./Header-6cvH0Y61.mjs";
import { t as Footer } from "./Footer-ure3nlYh.mjs";
import { a as PERSONAS } from "./router-AV22IHyj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/campanha-D211DH7T.js
var import_jsx_runtime = require_jsx_runtime();
var clubes = [
	{
		estado: "Rio Grande do Sul",
		clube: "Clube da Serra",
		cor: "from-emerald-900/50"
	},
	{
		estado: "São Paulo",
		clube: "Salão Paulista",
		cor: "from-amber-900/40"
	},
	{
		estado: "Rio de Janeiro",
		clube: "Varanda Carioca",
		cor: "from-sky-900/40"
	},
	{
		estado: "Minas Gerais",
		clube: "Casarão Mineiro",
		cor: "from-orange-900/40"
	},
	{
		estado: "Bahia",
		clube: "Terraço do Pelô",
		cor: "from-yellow-900/40"
	},
	{
		estado: "Pernambuco",
		clube: "Frevo Royale",
		cor: "from-rose-900/40"
	},
	{
		estado: "Amazonas",
		clube: "Salão do Teatro",
		cor: "from-teal-900/40"
	},
	{
		estado: "Distrito Federal",
		clube: "Clube Central",
		cor: "from-indigo-900/40"
	}
];
function Campanha() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "gold-text mt-10 text-4xl font-bold",
					children: "Campanha"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-muted-foreground",
					children: "Cada estado guarda um clube exclusivo, com cenário, mesa e adversário próprios. Vença a mesa para desbloquear o próximo clube."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: clubes.map((c, i) => {
						const persona = PERSONAS[Math.min(i, PERSONAS.length - 1)];
						const locked = i > 2;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `glass animate-rise relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.cor} to-transparent p-5`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs tracking-[0.25em] text-[var(--gold)] uppercase",
									children: c.estado
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 text-xl font-semibold",
									children: c.clube
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: [
										"Adversário: ",
										persona.name,
										" · ",
										persona.title
									]
								}),
								locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-4 inline-block rounded-full border px-4 py-2 text-sm text-muted-foreground",
									children: "Bloqueado"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/jogar",
									search: { ia: persona.id },
									className: "mt-4 inline-block rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-105",
									children: "Entrar no clube"
								})
							]
						}, c.estado);
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
}
//#endregion
export { Campanha as component };
