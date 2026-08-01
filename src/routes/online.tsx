import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { createRoom, getPlayerName, joinRoom, setPlayerName } from "@/lib/online";

export const Route = createFileRoute("/online")({
  head: () => ({
    meta: [
      { title: "Partida online por código — Canastra Royale" },
      {
        name: "description",
        content:
          "Crie uma sala e compartilhe o código de 6 letras para jogar Canastra online com um amigo em tempo real.",
      },
      { property: "og:title", content: "Partida online por código — Canastra Royale" },
      {
        property: "og:description",
        content: "Crie uma sala, compartilhe o código e jogue Canastra em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Online,
});

function Online() {
  const navigate = useNavigate();
  const [name, setName] = useState("Jogador");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => setName(getPlayerName()), []);

  const persist = () => setPlayerName(name || "Jogador");

  const onCreate = async () => {
    setBusy(true);
    try {
      persist();
      const room = await createRoom(name);
      toast.success(`Sala criada: ${room.code}`);
      void navigate({ to: "/sala", search: { code: room.code } });
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
      void navigate({ to: "/sala", search: { code: room.code } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      toast.error(
        msg.includes("full")
          ? "Essa sala já está cheia."
          : msg.includes("not found")
            ? "Código não encontrado."
            : "Não foi possível entrar na sala.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[100dvh]">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl sm:text-4xl">
          Partida <span className="gold-text">online</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Jogue com um amigo em tempo real: crie uma sala e envie o código de 6 letras.
        </p>

        <label className="mt-8 block text-xs tracking-widest text-muted-foreground uppercase">
          Seu nome
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:border-[var(--gold)]"
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl">Criar sala</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gera um código exclusivo para convidar alguém.
            </p>
            <button
              disabled={busy}
              onClick={() => void onCreate()}
              className="mt-5 w-full rounded-full bg-[var(--gold)] px-5 py-2.5 font-semibold text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Criar e receber código
            </button>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl">Entrar com código</h2>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="mt-4 w-full rounded-xl border bg-transparent px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-[var(--gold)]"
            />
            <button
              disabled={busy}
              onClick={() => void onJoin()}
              className="mt-4 w-full rounded-full border px-5 py-2.5 font-semibold transition-colors hover:bg-[var(--gold)]/10 disabled:opacity-50"
            >
              Entrar na sala
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
