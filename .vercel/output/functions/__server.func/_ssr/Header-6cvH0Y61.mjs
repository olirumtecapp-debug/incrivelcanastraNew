import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Palette, f as Check, l as Crown, o as Menu, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Header-6cvH0Y61.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PALETTES = [
	{
		id: "classic-gold",
		name: "Clássico Royale",
		felt: "oklch(0.34 0.07 158)",
		feltDeep: "oklch(0.24 0.05 158)",
		background: "oklch(0.16 0.02 265)",
		gold: "oklch(0.79 0.14 85)",
		goldSoft: "oklch(0.88 0.09 88)"
	},
	{
		id: "midnight-blue",
		name: "Noite Azul",
		felt: "oklch(0.25 0.08 260)",
		feltDeep: "oklch(0.15 0.05 260)",
		background: "oklch(0.12 0.03 260)",
		gold: "oklch(0.85 0.12 90)",
		goldSoft: "oklch(0.92 0.08 92)"
	},
	{
		id: "crimson-club",
		name: "Clube Carmesim",
		felt: "oklch(0.30 0.12 25)",
		feltDeep: "oklch(0.20 0.08 25)",
		background: "oklch(0.14 0.03 25)",
		gold: "oklch(0.82 0.15 85)",
		goldSoft: "oklch(0.90 0.10 88)"
	},
	{
		id: "emerald-casino",
		name: "Cassino Esmeralda",
		felt: "oklch(0.35 0.12 160)",
		feltDeep: "oklch(0.25 0.08 160)",
		background: "oklch(0.15 0.03 160)",
		gold: "oklch(0.80 0.15 85)",
		goldSoft: "oklch(0.88 0.10 88)"
	},
	{
		id: "obsidian-onyx",
		name: "Ônix Negro",
		felt: "oklch(0.18 0.01 265)",
		feltDeep: "oklch(0.12 0.01 265)",
		background: "oklch(0.10 0.01 265)",
		gold: "oklch(0.75 0.01 265)",
		goldSoft: "oklch(0.85 0.01 265)"
	}
];
function ColorPaletteMenu() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [currentId, setCurrentId] = (0, import_react.useState)("classic-gold");
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("canastra-theme");
		if (saved) {
			const palette = PALETTES.find((p) => p.id === saved);
			if (palette) {
				applyPalette(palette, false);
				setCurrentId(saved);
			}
		}
	}, []);
	const applyPalette = (palette, notify = true) => {
		const root = document.documentElement;
		root.style.setProperty("--felt", palette.felt);
		root.style.setProperty("--felt-deep", palette.feltDeep);
		root.style.setProperty("--background", palette.background);
		root.style.setProperty("--gold", palette.gold);
		root.style.setProperty("--gold-soft", palette.goldSoft);
		root.style.setProperty("--border", `${palette.gold} / 18%`);
		root.style.setProperty("--primary", palette.gold);
		localStorage.setItem("canastra-theme", palette.id);
		setCurrentId(palette.id);
		if (notify) toast.success(`Tema ${palette.name} aplicado!`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setIsOpen(!isOpen),
			className: "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 transition-all hover:scale-110 active:scale-95",
			title: "Alterar Cores",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-5 w-5" })
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm",
			onClick: () => setIsOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 top-12 z-[100] w-64 animate-rise rounded-2xl border bg-card p-4 shadow-2xl overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold uppercase tracking-wider text-[var(--gold)]",
					children: "Paleta de Cores"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setIsOpen(false),
					className: "text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: PALETTES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => applyPalette(p),
					className: `flex items-center justify-between rounded-xl border p-2 text-left transition-all hover:bg-[var(--gold)]/5 ${currentId === p.id ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-transparent"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 shadow-inner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full w-1/2",
								style: { backgroundColor: p.felt }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full w-1/2",
								style: { backgroundColor: p.gold }
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium",
							children: p.name
						})]
					}), currentId === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-[var(--gold)]" })]
				}, p.id))
			})]
		})] })]
	});
}
var links = [
	{
		to: "/",
		label: "Lobby"
	},
	{
		to: "/como-jogar",
		label: "Como jogar"
	},
	{
		to: "/jogar",
		label: "Mesa"
	},
	{
		to: "/online",
		label: "Online"
	},
	{
		to: "/campanha",
		label: "Campanha"
	},
	{
		to: "/perfil",
		label: "Perfil"
	}
];
function Header() {
	const [isMenuOpen, setIsMenuOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "glass sticky top-0 z-30 border-b",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-5 w-5 shrink-0 sm:h-6 sm:w-6 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gold-text font-display hidden truncate text-base sm:inline font-bold tracking-wide sm:text-xl",
						children: "Canastra Royale"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden md:flex min-w-0 items-center gap-1 text-sm",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						activeProps: { className: "bg-[var(--gold)]/15 text-[var(--gold)]" },
						activeOptions: { exact: l.to === "/" },
						className: "shrink-0 rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground",
						children: l.label
					}, l.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2 ml-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorPaletteMenu, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsMenuOpen(!isMenuOpen),
						className: "md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-white/10",
						children: isMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					})]
				})
			]
		}), isMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden absolute top-full left-0 right-0 border-b bg-card/95 backdrop-blur-xl animate-rise",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col p-4 gap-2",
				children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					onClick: () => setIsMenuOpen(false),
					activeProps: { className: "bg-[var(--gold)]/15 text-[var(--gold)] border-[var(--gold)]/30" },
					activeOptions: { exact: l.to === "/" },
					className: "flex items-center justify-between rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5",
					children: l.label
				}, l.to))
			})
		})]
	});
}
//#endregion
export { Header as t };
