import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as CircleCheck, u as CircleX } from "../_libs/lucide-react.mjs";
import { t as Header } from "./Header-6cvH0Y61.mjs";
import { t as Footer } from "./Footer-ure3nlYh.mjs";
import { t as PlayingCard } from "./PlayingCard-CCz83vLf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/como-jogar-CtDvrr2-.js
var import_jsx_runtime = require_jsx_runtime();
var c = (id, suit, rank) => ({
	id,
	suit,
	rank
});
function Row({ cards }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex -space-x-3",
		children: cards.map((card, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
			card,
			small: true,
			index: i
		}, card.id))
	});
}
function Example({ ok, cards, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3",
		children: [
			ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 shrink-0 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5 shrink-0 text-red-400" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, { cards }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: note
			})
		]
	});
}
var steps = [
	{
		t: "1. Compre uma carta",
		d: "No começo do seu turno você precisa comprar: clique no Monte (uma carta) ou no Lixo (leva a pilha inteira de descartes)."
	},
	{
		t: "2. Baixe jogos (opcional)",
		d: "Selecione 3 ou mais cartas da sua mão que formem uma sequência válida e clique em “Baixar jogo”. Elas ficam na mesa, à sua frente."
	},
	{
		t: "3. Amplie jogos já baixados",
		d: "Selecione cartas na mão e clique em um dos seus jogos na mesa. Se elas encaixarem nas pontas da sequência, entram nele."
	},
	{
		t: "4. Descarte para encerrar o turno",
		d: "Selecione exatamente 1 carta e clique em “Descartar”. Ela vai para o lixo e a vez passa ao adversário."
	},
	{
		t: "5. Pegue o morto",
		d: "Quando você fica sem cartas na mão pela primeira vez, recebe um “morto” (um monte extra) e continua jogando."
	},
	{
		t: "6. Bata",
		d: "Depois de já ter pego o morto, ficar sem cartas na mão encerra a rodada — e você bate."
	}
];
function ComoJogar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-4 pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "animate-rise mt-10 rounded-3xl border bg-gradient-to-br from-[var(--felt)]/45 to-transparent p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.35em] text-[var(--gold)] uppercase",
							children: "Guia rápido"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "gold-text mt-3 text-4xl font-bold",
							children: "Como jogar Canastra"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 max-w-2xl text-muted-foreground",
							children: [
								"O objetivo é simples: transformar as cartas da sua mão em ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "sequências" }),
								" na mesa, formar ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "canastras" }),
								" (jogos de 7 cartas ou mais) e ser o primeiro a ficar sem cartas depois de pegar o morto. Quem tiver mais pontos vence."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold",
							children: "O que é uma sequência"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-muted-foreground",
							children: [
								"Uma sequência é um conjunto de ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "3 ou mais cartas do mesmo naipe" }),
								", em ordem crescente e sem buracos. O Ás pode valer antes do 2 (A-2-3) ou depois do Rei (Q-K-A). Aqui nesta mesa não existem trincas (três cartas do mesmo número) — só sequências."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Example, {
									ok: true,
									cards: [
										c("e1", "H", 5),
										c("e2", "H", 6),
										c("e3", "H", 7)
									],
									note: "5-6-7 de copas: mesmo naipe, em ordem, sem falhas."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Example, {
									ok: true,
									cards: [
										c("e4", "S", 11),
										c("e5", "S", 12),
										c("e6", "S", 13),
										c("e7", "S", 1)
									],
									note: "J-Q-K-A de espadas: o Ás fecha por cima."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Example, {
									ok: false,
									cards: [
										c("e8", "D", 4),
										c("e9", "C", 5),
										c("e10", "D", 6)
									],
									note: "Naipes misturados — inválido."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Example, {
									ok: false,
									cards: [
										c("e11", "C", 4),
										c("e12", "C", 6),
										c("e13", "C", 8)
									],
									note: "Tem buracos entre as cartas — inválido."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold",
							children: "Curingas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-muted-foreground",
							children: [
								"O ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Coringa (★)" }),
								" e qualquer ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "2" }),
								" são curingas: eles tapam um buraco da sequência. Regra da mesa: no máximo ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "um curinga por jogo" }),
								", e o jogo precisa de pelo menos 2 cartas naturais."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Example, {
									ok: true,
									cards: [
										c("w1", "D", 8),
										c("w2", null, 0),
										c("w3", "D", 10)
									],
									note: "O coringa faz o papel do 9 de ouros."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Example, {
									ok: true,
									cards: [
										c("w4", "C", 4),
										c("w5", "C", 5),
										c("w6", "H", 2)
									],
									note: "O 2 entra como curinga fazendo o 6 de paus."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Example, {
									ok: false,
									cards: [
										c("w7", "S", 9),
										c("w8", null, 0),
										c("w9", "H", 2)
									],
									note: "Dois curingas no mesmo jogo — inválido."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold",
						children: "Um turno, passo a passo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "glass rounded-2xl p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-[var(--gold)]",
								children: s.t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: s.d
							})]
						}, s.t))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold",
							children: "Canastras e pontuação"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-2xl p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: "Canastra limpa · +200"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										"Jogo com 7+ cartas e ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "nenhum" }),
										" curinga."
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-2xl p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: "Canastra suja · +100"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Jogo com 7+ cartas usando um curinga."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass mt-3 rounded-2xl p-4 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-semibold text-foreground",
									children: "Valor das cartas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Coringa 20 · Ás 15 · 2 vale 10 · 8, 9, 10, J, Q, K valem 10 · 3, 4, 5, 6, 7 valem 5." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: "Cartas baixadas na mesa somam; cartas que sobram na sua mão no fim da rodada são descontadas."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold",
						children: "Dicas para começar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "· Guarde os curingas para completar canastras, não para jogos pequenos." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "· Pegar o lixo é forte quando a pilha está grande — você ganha muito material." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "· Evite descartar cartas que encaixam nos jogos já baixados pelo adversário." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "· Prefira canastras limpas: valem o dobro em bônus." })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/jogar",
						search: { ia: "conservadora" },
						className: "gold-ring rounded-full bg-[var(--gold)] px-6 py-3 font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-105",
						children: "Praticar contra a IA mais fácil"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "rounded-full border px-6 py-3 font-medium transition-colors hover:bg-[var(--gold)]/10",
						children: "Voltar ao lobby"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
}
//#endregion
export { ComoJogar as component };
