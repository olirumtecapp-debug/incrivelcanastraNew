import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Header } from "./Header-6cvH0Y61.mjs";
import { t as Footer } from "./Footer-ure3nlYh.mjs";
import { a as joinRoom, i as getPlayerName, s as setPlayerName, t as createRoom } from "./online-B3MFPtif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/online-Bd8k6jOP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Online() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("Jogador");
	const [code, setCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setName(getPlayerName()), []);
	const persist = () => setPlayerName(name || "Jogador");
	const onCreate = async () => {
		setBusy(true);
		try {
			persist();
			const room = await createRoom(name);
			toast.success(`Sala criada: ${room.code}`);
			navigate({
				to: "/sala",
				search: { code: room.code }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Não foi possível criar a sala.");
		} finally {
			setBusy(false);
		}
	};
	const onJoin = async () => {
		if (code.trim().length < 4) {
			toast.error("Digite o código da sala.");
			return;
		}
		setBusy(true);
		try {
			persist();
			const room = await joinRoom(code, name);
			navigate({
				to: "/sala",
				search: { code: room.code }
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "";
			toast.error(msg.includes("full") ? "Essa sala já está cheia." : msg.includes("not found") ? "Código não encontrado." : "Não foi possível entrar na sala.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-3xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-3xl sm:text-4xl",
					children: ["Partida ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gold-text",
						children: "online"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Jogue com um amigo em tempo real: crie uma sala e envie o código de 6 letras."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-8 block text-xs tracking-widest text-muted-foreground uppercase",
					children: "Seu nome"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					maxLength: 24,
					className: "mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:border-[var(--gold)]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Criar sala"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Gera um código exclusivo para convidar alguém."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: busy,
								onClick: () => void onCreate(),
								className: "mt-5 w-full rounded-full bg-[var(--gold)] px-5 py-2.5 font-semibold text-[var(--primary-foreground)] disabled:opacity-50",
								children: "Criar e receber código"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Entrar com código"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: code,
								onChange: (e) => setCode(e.target.value.toUpperCase()),
								placeholder: "ABC123",
								maxLength: 6,
								className: "mt-4 w-full rounded-xl border bg-transparent px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-[var(--gold)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: busy,
								onClick: () => void onJoin(),
								className: "mt-4 w-full rounded-full border px-5 py-2.5 font-semibold transition-colors hover:bg-[var(--gold)]/10 disabled:opacity-50",
								children: "Entrar na sala"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})]
	});
}
//#endregion
export { Online as component };
