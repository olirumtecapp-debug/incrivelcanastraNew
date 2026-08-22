import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Header } from "./Header-6cvH0Y61.mjs";
import { h as newGame, n as Route } from "./router-AV22IHyj.mjs";
import { t as TableView } from "./TableView-Dj0kLqSS.mjs";
import { c as subscribeRoom, n as fetchRoom, o as pushRoomState, r as getPlayerId } from "./online-B3MFPtif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sala-CWJA0_f0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Sala() {
	const { code } = Route.useSearch();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const playerId = typeof window !== "undefined" ? getPlayerId() : "";
	(0, import_react.useEffect)(() => {
		let alive = true;
		fetchRoom(code).then((r) => {
			if (alive) setRoom(r);
		}).catch(() => toast.error("Não foi possível carregar a sala.")).finally(() => alive && setLoading(false));
		const unsub = subscribeRoom(code, (r) => setRoom(r));
		return () => {
			alive = false;
			unsub();
		};
	}, [code]);
	const isHost = !!room && room.host_id === playerId;
	const isGuest = !!room && room.guest_id === playerId;
	const seat = isHost ? "player" : "ai";
	const deal = (0, import_react.useCallback)(async () => {
		if (!room?.guest_id) return;
		const state = newGame({
			playerName: room.host_name,
			aiName: room.guest_name ?? "Convidado",
			openMorto: true
		});
		try {
			await pushRoomState(room.code, state);
		} catch {
			toast.error("Não foi possível iniciar a partida.");
		}
	}, [room]);
	const onState = (0, import_react.useCallback)((next) => {
		setRoom((r) => r ? {
			...r,
			state: next
		} : r);
		if (!room) return;
		pushRoomState(room.code, next, next.phase === "over" ? "finished" : "playing").catch(() => toast.error("Falha ao sincronizar a jogada."));
	}, [room]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: "Carregando sala…" });
	if (!room) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		"Sala ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: code }),
		" não encontrada.",
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/online",
			className: "underline underline-offset-4",
			children: "Voltar"
		})
	] });
	if (!isHost && !isGuest) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		"Você não faz parte desta sala.",
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/online",
			className: "underline underline-offset-4",
			children: "Entrar com código"
		})
	] });
	if (!room.state) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-muted-foreground uppercase",
				children: "Código da sala"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "gold-text font-display text-5xl tracking-[0.3em]",
				children: room.code
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					navigator.clipboard?.writeText(room.code);
					toast.success("Código copiado!");
				},
				className: "mt-3 rounded-full border px-4 py-1.5 text-xs",
				children: "Copiar código"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: room.guest_id ? `${room.guest_name} entrou na sala.` : "Aguardando o segundo jogador entrar…"
			}),
			isHost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				disabled: !room.guest_id,
				onClick: () => void deal(),
				className: "mt-5 rounded-full bg-[var(--gold)] px-6 py-2.5 font-semibold text-[var(--primary-foreground)] disabled:opacity-40",
				children: "Distribuir cartas"
			}),
			!isHost && room.guest_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm",
				children: "Aguardando o anfitrião distribuir as cartas…"
			})
		]
	}) });
	const oppName = isHost ? room.guest_name ?? "Convidado" : room.host_name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[100dvh] flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableView, {
			state: room.state,
			seat,
			onState,
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Sala ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gold-text",
					children: room.code
				}),
				" · contra ",
				oppName
			] }),
			subtitle: "Partida online em tempo real",
			waitingLabel: `Vez de ${oppName}…`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/como-jogar",
					className: "rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10",
					children: "Como jogar"
				}),
				isHost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => void deal(),
					className: "rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10",
					children: "Nova"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10",
					children: "Sair"
				})
			] })
		})]
	});
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto grid w-full max-w-3xl place-items-center px-4 py-20 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass w-full rounded-3xl p-10",
				children
			})
		})]
	});
}
//#endregion
export { Sala as component };
