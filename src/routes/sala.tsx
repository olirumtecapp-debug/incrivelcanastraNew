import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { TableView } from "@/components/game/TableView";
import { newGame } from "@/lib/canastra/engine";
import type { GameState, PlayerId } from "@/lib/canastra/types";
import {
  fetchRoom,
  getPlayerId,
  pushRoomState,
  subscribeRoom,
  type Room,
} from "@/lib/online";

export const Route = createFileRoute("/sala")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { code: string } => ({
    code: String(s['code'] ?? "").toUpperCase().slice(0, 6),
  }),
  head: () => ({
    meta: [
      { title: "Sala online — Canastra Royale" },
      {
        name: "description",
        content: "Mesa online de Canastra em tempo real com um amigo através do código da sala.",
      },
      { property: "og:title", content: "Sala online — Canastra Royale" },
      { property: "og:description", content: "Mesa online de Canastra em tempo real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sala,
});

function Sala() {
  const { code } = Route.useSearch();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const playerId = typeof window !== "undefined" ? getPlayerId() : "";

  useEffect(() => {
    let alive = true;
    void fetchRoom(code)
      .then((r) => {
        if (alive) setRoom(r);
      })
      .catch(() => toast.error("Não foi possível carregar a sala."))
      .finally(() => alive && setLoading(false));
    const unsub = subscribeRoom(code, (r) => setRoom(r));
    return () => {
      alive = false;
      unsub();
    };
  }, [code]);

  const isHost = !!room && room.host_id === playerId;
  const isGuest = !!room && room.guest_id === playerId;
  const seat: PlayerId = isHost ? "player" : "ai";

  const deal = useCallback(async () => {
    if (!room?.guest_id) return;
    const state = newGame({
      playerName: room.host_name,
      aiName: room.guest_name ?? "Convidado",
      openMorto: true,
    });
    try {
      await pushRoomState(room.code, state);
    } catch {
      toast.error("Não foi possível iniciar a partida.");
    }
  }, [room]);

  const onState = useCallback(
    (next: GameState) => {
      setRoom((r) => (r ? { ...r, state: next } : r));
      if (!room) return;
      void pushRoomState(room.code, next, next.phase === "over" ? "finished" : "playing").catch(
        () => toast.error("Falha ao sincronizar a jogada."),
      );
    },
    [room],
  );

  if (loading) {
    return <Shell>Carregando sala…</Shell>;
  }

  if (!room) {
    return (
      <Shell>
        Sala <b>{code}</b> não encontrada.{" "}
        <Link to="/online" className="underline underline-offset-4">
          Voltar
        </Link>
      </Shell>
    );
  }

  if (!isHost && !isGuest) {
    return (
      <Shell>
        Você não faz parte desta sala.{" "}
        <Link to="/online" className="underline underline-offset-4">
          Entrar com código
        </Link>
      </Shell>
    );
  }

  if (!room.state) {
    return (
      <Shell>
        <div className="text-center">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">Código da sala</p>
          <p className="gold-text font-display text-5xl tracking-[0.3em]">{room.code}</p>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(room.code);
              toast.success("Código copiado!");
            }}
            className="mt-3 rounded-full border px-4 py-1.5 text-xs"
          >
            Copiar código
          </button>
          <p className="mt-6 text-sm text-muted-foreground">
            {room.guest_id
              ? `${room.guest_name} entrou na sala.`
              : "Aguardando o segundo jogador entrar…"}
          </p>
          {isHost && (
            <button
              disabled={!room.guest_id}
              onClick={() => void deal()}
              className="mt-5 rounded-full bg-[var(--gold)] px-6 py-2.5 font-semibold text-[var(--primary-foreground)] disabled:opacity-40"
            >
              Distribuir cartas
            </button>
          )}
          {!isHost && room.guest_id && (
            <p className="mt-5 text-sm">Aguardando o anfitrião distribuir as cartas…</p>
          )}
        </div>
      </Shell>
    );
  }

  const oppName = isHost ? (room.guest_name ?? "Convidado") : room.host_name;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <div className="shrink-0">
        <Header />
      </div>
      <TableView
        state={room.state}
        seat={seat}
        onState={onState}
        title={
          <>
            Sala <span className="gold-text">{room.code}</span> · contra {oppName}
          </>
        }
        subtitle="Partida online em tempo real"
        waitingLabel={`Vez de ${oppName}…`}
        actions={
          <>
            <Link
              to="/como-jogar"
              className="rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10"
            >
              Como jogar
            </Link>
            {isHost && (
              <button
                onClick={() => void deal()}
                className="rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10"
              >
                Nova
              </button>
            )}
            <Link
              to="/"
              className="rounded-full border px-3 py-1.5 transition-colors hover:bg-[var(--gold)]/10"
            >
              Sair
            </Link>
          </>
        }
      />
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh]">
      <Header />
      <main className="mx-auto grid w-full max-w-3xl place-items-center px-4 py-20 text-center">
        <div className="glass w-full rounded-3xl p-10">{children}</div>
      </main>
    </div>
  );
}
