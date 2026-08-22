import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PlayingCard } from "./PlayingCard-CCz83vLf.mjs";
import { C as sortHand, _ as takeDiscardPile, b as isCanastra, c as addToMeld, d as createMeld, f as discardCard, g as scoreOf, l as canAppend, m as endRound, p as drawFromStock, u as canMeld, x as isClean, y as SUIT_SYMBOL } from "./router-AV22IHyj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TableView-Dj0kLqSS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TableView({ state, seat, onState, title, subtitle, actions, locked, waitingLabel = "Vez do adversário…" }) {
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [showLog, setShowLog] = (0, import_react.useState)(false);
	const oppSeat = seat === "player" ? "ai" : "player";
	const me = state.players[seat];
	const opp = state.players[oppSeat];
	const myTurn = !locked && state.turn === seat && state.phase !== "over";
	const hand = sortHand(me.hand);
	const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
	const act = (next, failMsg) => {
		if (next === state) {
			if (failMsg) toast.error(failMsg);
			return;
		}
		setSelected([]);
		onState(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col gap-2 px-2 py-2 sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-base font-semibold sm:text-xl",
						children: title
					}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[11px] text-muted-foreground sm:text-xs",
						children: subtitle
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex shrink-0 gap-1.5 text-xs",
					children: actions
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative flex min-h-0 flex-1 flex-col gap-1 overflow-hidden rounded-2xl border border-[var(--gold)]/25 bg-[radial-gradient(ellipse_at_center,var(--felt),var(--felt-deep))] p-2 shadow-[inset_0_2px_40px_rgba(0,0,0,0.55)] sm:gap-2 sm:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-8 w-8 shrink-0 place-items-center rounded-full border ${state.turn === oppSeat ? "animate-shimmer border-[var(--gold)]" : "border-white/20"}`,
								children: "♣"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: opp.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-white/70",
									children: [opp.hand.length, " cartas na mão"]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex -space-x-5 sm:-space-x-6",
							children: opp.hand.slice(0, 8).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
								faceDown: true,
								small: true
							}, c.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeldRow, {
						title: `Jogos de ${opp.name}`,
						melds: opp.melds
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-0 flex-1 flex-wrap items-center justify-center gap-4 sm:gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: !myTurn || state.phase !== "draw",
								onClick: () => act(drawFromStock(state, seat), "Você já comprou nesta rodada."),
								className: "flex flex-col items-center gap-1 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, { faceDown: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-white/80",
									children: [
										"Monte (",
										state.stock.length,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: !myTurn || state.phase !== "draw" || state.discard.length === 0,
								onClick: () => act(takeDiscardPile(state, seat), "Não é possível pegar o lixo."),
								className: "flex flex-col items-center gap-1 disabled:opacity-50",
								children: [state.discard.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, { card: state.discard[state.discard.length - 1] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[5/7] h-[clamp(64px,11vh,116px)] rounded-[12%] border border-dashed border-white/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-white/80",
									children: [
										"Lixo (",
										state.discard.length,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex -space-x-7",
									children: state.mortos.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, { faceDown: true }, i))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-white/80",
									children: [
										"Mortos (",
										state.mortos.length,
										")"
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeldRow, {
						title: "Seus jogos",
						melds: me.melds,
						onMeldClick: (id) => act(addToMeld(state, seat, id, selected), "Essas cartas não completam esse jogo."),
						highlight: selected.length > 0 && myTurn,
						appendable: (m) => canAppend(m, me.hand, selected)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-[11px] text-white/80",
								children: [
									"Sua mão · ",
									me.hand.length,
									" cartas",
									me.tookMorto && " · morto pego"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[11px] text-white/70",
								children: state.phase === "over" ? "Rodada encerrada" : myTurn ? state.phase === "draw" ? "Sua vez: compre uma carta" : "Baixe jogos e descarte" : waitingLabel
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 flex justify-center -space-x-5 px-1 pt-3 pb-2 sm:-space-x-3 md:-space-x-2",
							children: hand.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
								card: c,
								index: i,
								selected: selected.includes(c.id),
								onClick: () => toggle(c.id)
							}, c.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex shrink-0 flex-wrap items-center justify-between gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground sm:text-sm",
						children: [
							selected.length,
							" selecionada(s) · Pontuação:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[var(--gold)]",
								children: scoreOf(state, seat)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowLog((v) => !v),
								className: "ml-2 underline underline-offset-4 hover:text-foreground",
								children: "Histórico"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 text-xs sm:text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: !myTurn || state.phase !== "play" || !canMeld(me.hand, selected),
								onClick: () => act(createMeld(state, seat, selected), "Sequência inválida — mesmo naipe, mínimo 3 cartas."),
								className: "rounded-full bg-[var(--gold)] px-4 py-1.5 font-semibold text-[var(--primary-foreground)] disabled:opacity-40",
								children: "Baixar jogo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: !myTurn || state.phase !== "play" || selected.length !== 1,
								onClick: () => act(discardCard(state, seat, selected[0])),
								className: "rounded-full border px-4 py-1.5 disabled:opacity-40",
								children: "Descartar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: state.phase === "over",
								onClick: () => act(endRound(state, oppSeat)),
								className: "rounded-full border px-4 py-1.5 text-muted-foreground disabled:opacity-40",
								children: "Desistir"
							})
						]
					}),
					showLog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass animate-rise absolute bottom-full left-0 z-30 mb-2 max-h-[40vh] w-full max-w-md overflow-y-auto rounded-2xl p-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 font-medium",
							children: "Histórico da mesa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1 text-muted-foreground",
							children: state.log.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", l] }, i))
						})]
					})
				]
			})
		]
	});
}
function MeldRow({ title, melds, onMeldClick, highlight, appendable }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] tracking-widest text-white/60 uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1 flex gap-2 overflow-x-auto pb-1",
			children: [melds.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-white/50",
				children: "Nenhum jogo baixado."
			}), melds.map((m) => {
				const ok = highlight && appendable?.(m);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(onMeldClick ? "button" : "div", {
					type: onMeldClick ? "button" : void 0,
					onClick: onMeldClick ? () => onMeldClick(m.id) : void 0,
					className: `shrink-0 rounded-xl border p-1.5 text-left transition-all ${ok ? "border-[var(--gold)] shadow-[0_0_20px_-6px_var(--gold)]" : "border-white/15"} ${isCanastra(m) ? "bg-[var(--gold)]/10" : "bg-black/20"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex -space-x-3",
						children: m.cards.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
							card: c,
							small: true,
							index: i
						}, c.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[10px] text-white/70",
						children: [
							SUIT_SYMBOL[m.suit],
							" ",
							m.cards.length,
							" cartas",
							isCanastra(m) && (isClean(m) ? " · limpa" : " · suja")
						]
					})]
				}, m.id);
			})]
		})]
	});
}
//#endregion
export { TableView as t };
