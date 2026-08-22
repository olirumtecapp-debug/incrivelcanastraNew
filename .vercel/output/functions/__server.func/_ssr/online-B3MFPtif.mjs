import { t as supabase } from "./client-CF6dXj6_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/online-B3MFPtif.js
var ID_KEY = "canastra:player-id";
var NAME_KEY = "canastra:player-name";
function getPlayerId() {
	if (typeof window === "undefined") return "";
	let id = localStorage.getItem(ID_KEY);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(ID_KEY, id);
	}
	return id;
}
function getPlayerName() {
	if (typeof window === "undefined") return "Jogador";
	return localStorage.getItem(NAME_KEY) ?? "Jogador";
}
function setPlayerName(name) {
	localStorage.setItem(NAME_KEY, name.slice(0, 24));
}
var asRoom = (data) => data;
async function createRoom(name) {
	const { data, error } = await supabase.rpc("create_room", {
		p_host_id: getPlayerId(),
		p_host_name: name
	});
	if (error) throw new Error(error.message);
	return asRoom(data);
}
async function joinRoom(code, name) {
	const { data, error } = await supabase.rpc("join_room", {
		p_code: code.trim().toUpperCase(),
		p_guest_id: getPlayerId(),
		p_guest_name: name
	});
	if (error) throw new Error(error.message);
	return asRoom(data);
}
async function fetchRoom(code) {
	const { data, error } = await supabase.from("rooms").select("*").eq("code", code.trim().toUpperCase()).maybeSingle();
	if (error) throw new Error(error.message);
	return data ? asRoom(data) : null;
}
async function pushRoomState(code, state, status = "playing") {
	const { data, error } = await supabase.rpc("update_room_state", {
		p_code: code.trim().toUpperCase(),
		p_player_id: getPlayerId(),
		p_state: state,
		p_status: status
	});
	if (error) throw new Error(error.message);
	return asRoom(data);
}
function subscribeRoom(code, onChange) {
	const channel = supabase.channel(`room:${code}`).on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "rooms",
		filter: `code=eq.${code}`
	}, (payload) => {
		if (payload.new) onChange(asRoom(payload.new));
	}).subscribe();
	return () => {
		supabase.removeChannel(channel);
	};
}
//#endregion
export { joinRoom as a, subscribeRoom as c, getPlayerName as i, fetchRoom as n, pushRoomState as o, getPlayerId as r, setPlayerName as s, createRoom as t };
