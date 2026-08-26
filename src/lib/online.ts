import { supabase } from "@/integrations/supabase/client";
import type { GameState } from "@/lib/canastra/types";

const ID_KEY = "canastra:player-id";
const NAME_KEY = "canastra:player-name";

let activeBroadcastChannel: BroadcastChannel | null = null;
let activeSupabaseChannel: ReturnType<typeof supabase.channel> | null = null;

export function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = "usr_" + Math.random().toString(36).substring(2, 9);
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

function emitLocal(code: string, event: string, room: Room) {
  try {
    if (activeBroadcastChannel) {
      activeBroadcastChannel.postMessage({ event, room });
    }
  } catch {}
  try {
    if (activeSupabaseChannel) {
      activeSupabaseChannel.send({
        type: "broadcast",
        event,
        payload: { room },
      });
    }
  } catch {}
}

export async function createRoom(name: string): Promise<Room> {
  const hostId = getPlayerId();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

  const { data: created, error: insertError } = await supabase
    .from("rooms")
    .insert({
      code,
      host_id: hostId,
      host_name: name || "Anfitrião",
      status: "waiting",
      state: null,
    })
    .select()
    .single();

  if (insertError || !created) throw new Error(insertError?.message || "Falha ao criar sala.");
  const room = asRoom(created);
  emitLocal(code, "ROOM_UPDATE", room);
  return room;
}

export async function joinRoom(code: string, name: string): Promise<Room> {
  const guestId = getPlayerId();
  const cleanCode = code.trim().toUpperCase();

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
      guest_name: name || "Convidado",
      status: "ready",
      updated_at: new Date().toISOString(),
    })
    .eq("code", cleanCode)
    .select()
    .single();

  if (updateError || !updated) throw new Error(updateError?.message || "Falha ao entrar na sala.");
  const updatedRoom = asRoom(updated);
  emitLocal(cleanCode, "PLAYER_JOIN", updatedRoom);
  return updatedRoom;
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
  const room = asRoom(updated || { code: cleanCode, state, status, updated_at: new Date().toISOString() });
  emitLocal(cleanCode, "ROOM_UPDATE", room);
  return room;
}

export function subscribeRoom(code: string, onChange: (room: Room) => void) {
  const cleanCode = code.trim().toUpperCase();

  // 1. BroadcastChannel local
  try {
    if (typeof BroadcastChannel !== "undefined") {
      if (activeBroadcastChannel) activeBroadcastChannel.close();
      activeBroadcastChannel = new BroadcastChannel(`canastra_bc_${cleanCode}`);
      activeBroadcastChannel.onmessage = (e) => {
        if (e.data && e.data.room) onChange(asRoom(e.data.room));
      };
    }
  } catch {}

  // 2. Supabase Realtime Channel
  if (activeSupabaseChannel) {
    try { void supabase.removeChannel(activeSupabaseChannel); } catch {}
  }

  const channel = supabase.channel(`canastra_room_${cleanCode}`, {
    config: { broadcast: { self: false } },
  });
  activeSupabaseChannel = channel;

  channel
    .on("broadcast", { event: "ROOM_UPDATE" }, ({ payload }) => {
      if (payload?.room) onChange(asRoom(payload.room));
    })
    .on("broadcast", { event: "PLAYER_JOIN" }, ({ payload }) => {
      if (payload?.room) onChange(asRoom(payload.room));
    })
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "rooms", filter: `code=eq.${cleanCode}` },
      (payload) => {
        if (payload.new) onChange(asRoom(payload.new));
      },
    )
    .subscribe();

  // 3. Fallback Polling a cada 1s
  const pollTimer = setInterval(async () => {
    try {
      const room = await fetchRoom(cleanCode);
      if (room) onChange(room);
    } catch {}
  }, 1000);

  return () => {
    clearInterval(pollTimer);
    try {
      if (activeBroadcastChannel) {
        activeBroadcastChannel.close();
        activeBroadcastChannel = null;
      }
    } catch {}
    try {
      void supabase.removeChannel(channel);
      if (activeSupabaseChannel === channel) activeSupabaseChannel = null;
    } catch {}
  };
}
