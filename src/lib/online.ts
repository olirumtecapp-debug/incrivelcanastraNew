import { supabase } from "@/integrations/supabase/client";
import type { GameState } from "@/lib/canastra/types";

const ID_KEY = "canastra:player-id";
const NAME_KEY = "canastra:player-name";

export function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ID_KEY, id);
  }
  return id;
}

export function getPlayerName(): string {
  if (typeof window === "undefined") return "Jogador";
  return localStorage.getItem(NAME_KEY) ?? "Jogador";
}

export function setPlayerName(name: string) {
  localStorage.setItem(NAME_KEY, name.slice(0, 24));
}

export interface Room {
  id: string;
  code: string;
  host_id: string;
  host_name: string;
  guest_id: string | null;
  guest_name: string | null;
  status: string;
  state: GameState | null;
  updated_at: string;
}

const asRoom = (data: unknown): Room => data as Room;

export async function createRoom(name: string): Promise<Room> {
  const hostId = getPlayerId();
  try {
    const { data, error } = await supabase.rpc("create_room", {
      p_host_id: hostId,
      p_host_name: name,
    });
    if (!error && data) return asRoom(data);
  } catch {}

  // Direct table insert fallback
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

  const { data: created, error: insertError } = await supabase
    .from("rooms")
    .insert({
      code,
      host_id: hostId,
      host_name: name,
      status: "waiting",
    })
    .select()
    .single();

  if (insertError || !created) throw new Error(insertError?.message || "Falha ao criar sala.");
  return asRoom(created);
}

export async function joinRoom(code: string, name: string): Promise<Room> {
  const guestId = getPlayerId();
  const cleanCode = code.trim().toUpperCase();
  try {
    const { data, error } = await supabase.rpc("join_room", {
      p_code: cleanCode,
      p_guest_id: guestId,
      p_guest_name: name,
    });
    if (!error && data) return asRoom(data);
  } catch {}

  // Direct table join fallback
  const { data: room, error: findError } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", cleanCode)
    .maybeSingle();

  if (findError || !room) throw new Error("Sala não encontrada.");
  if (room.status !== "waiting" && room.host_id !== guestId) throw new Error("Sala já iniciada.");

  if (room.host_id === guestId) return asRoom(room);

  const { data: updated, error: updateError } = await supabase
    .from("rooms")
    .update({
      guest_id: guestId,
      guest_name: name,
      status: "playing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id)
    .select()
    .single();

  if (updateError || !updated) throw new Error(updateError?.message || "Falha ao entrar na sala.");
  return asRoom(updated);
}

export async function fetchRoom(code: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? asRoom(data) : null;
}

export async function pushRoomState(
  code: string,
  state: GameState,
  status = "playing",
): Promise<Room> {
  const cleanCode = code.trim().toUpperCase();
  const playerId = getPlayerId();
  try {
    const { data, error } = await supabase.rpc("update_room_state", {
      p_code: cleanCode,
      p_player_id: playerId,
      p_state: state as unknown as never,
      p_status: status,
    });
    if (!error && data) return asRoom(data);
  } catch {}

  // Direct table update fallback
  const { data: updated, error } = await supabase
    .from("rooms")
    .update({
      state: state as unknown as never,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("code", cleanCode)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return asRoom(updated || { code: cleanCode, state, status });
}

export function subscribeRoom(code: string, onChange: (room: Room) => void) {
  const channel = supabase
    .channel(`room:${code}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "rooms", filter: `code=eq.${code}` },
      (payload) => {
        if (payload.new) onChange(asRoom(payload.new));
      },
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
