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
  const { data, error } = await supabase.rpc("create_room", {
    p_host_id: getPlayerId(),
    p_host_name: name,
  });
  if (error) throw new Error(error.message);
  return asRoom(data);
}

export async function joinRoom(code: string, name: string): Promise<Room> {
  const { data, error } = await supabase.rpc("join_room", {
    p_code: code.trim().toUpperCase(),
    p_guest_id: getPlayerId(),
    p_guest_name: name,
  });
  if (error) throw new Error(error.message);
  return asRoom(data);
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
  const { data, error } = await supabase.rpc("update_room_state", {
    p_code: code.trim().toUpperCase(),
    p_player_id: getPlayerId(),
    p_state: state as unknown as never,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return asRoom(data);
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
