import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { S as isJoker, v as RANK_LABEL, y as SUIT_SYMBOL } from "./router-AV22IHyj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PlayingCard-CCz83vLf.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Alturas fluidas: a mesa nunca precisa de rolagem. */
var SIZE = {
	md: "h-[clamp(60px,10.5vh,110px)] aspect-[5/7] text-[clamp(10px,1.5vh,15px)]",
	sm: "h-[clamp(36px,6vh,64px)] aspect-[5/7] text-[clamp(8px,1vh,11px)]"
};
function PlayingCard({ card, faceDown, selected, small, onClick, className, index = 0 }) {
	const red = card && (card.suit === "H" || card.suit === "D");
	const size = small ? SIZE.sm : SIZE.md;
	if (faceDown || !card) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-[12%] border border-[var(--gold)]/35", "bg-[linear-gradient(150deg,oklch(0.3_0.06_265),oklch(0.19_0.04_265))]", "shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9),inset_0_0_0_2px_oklch(0.79_0.14_85/0.18)]", size, className),
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[8%] rounded-[10%] border border-[var(--gold)]/25 bg-[repeating-linear-gradient(45deg,transparent_0_4px,oklch(0.79_0.14_85/0.14)_4px_5px)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute inset-0 grid place-items-center text-[1.4em] text-[var(--gold)]/60",
			children: "♛"
		})]
	});
	const Component = onClick ? "button" : "div";
	const label = RANK_LABEL[card.rank];
	const symbol = card.suit ? SUIT_SYMBOL[card.suit] : "★";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Component, {
		type: onClick ? "button" : void 0,
		onClick,
		style: { animationDelay: `${index * 30}ms` },
		"aria-label": isJoker(card) ? "Coringa" : `${label} de ${card.suit}`,
		className: cn("animate-deal group relative overflow-hidden rounded-[12%] font-semibold transition-all duration-200", "bg-[linear-gradient(160deg,oklch(1_0_0),oklch(0.96_0.008_90))]", "shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.9)]", onClick && "hover:z-20 hover:-translate-y-[14%] hover:scale-[1.06] hover:shadow-2xl", selected && "z-20 -translate-y-[18%] shadow-[0_0_26px_-4px_var(--gold)] ring-2 ring-[var(--gold)]", red ? "text-[oklch(0.46_0.23_27)]" : "text-[oklch(0.14_0.01_265)]", size, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),transparent)]" }), isJoker(card) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bg-[linear-gradient(120deg,oklch(0.55_0.24_300),oklch(0.6_0.19_60))] bg-clip-text text-[2.3em] font-black text-transparent",
				children: "★"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("pointer-events-none absolute inset-0 grid place-items-center text-[2.7em] opacity-[0.22]"),
				children: symbol
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute top-[4%] left-[7%] flex flex-col items-center leading-[0.9]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[1.5em] font-black tracking-[-0.04em]",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[1.15em] leading-none",
					children: symbol
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute right-[7%] bottom-[4%] flex rotate-180 flex-col items-center leading-[0.9]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[1.5em] font-black tracking-[-0.04em]",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[1.15em] leading-none",
					children: symbol
				})]
			})
		] })]
	});
}
//#endregion
export { PlayingCard as t };
