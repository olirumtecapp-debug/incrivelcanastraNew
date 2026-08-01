import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Gamepad2, Map, Sparkles, Trophy, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PERSONAS } from "@/lib/canastra/ai";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Canastra Royale — Buraco brasileiro premium" },
      {
        name: "description",
        content:
          "Jogue Canastra (Buraco) contra IAs com personalidade própria, avance na campanha pelos clubes do Brasil e colecione itens cosméticos.",
      },
      { property: "og:title", content: "Canastra Royale — Buraco brasileiro premium" },
      {
        property: "og:description",
        content: "Mesa de Canastra em estilo clube privado: IA avançada, campanha e progressão.",
      },
    ],
  }),
  component: Lobby,
});

const modes = [
  {
    icon: Gamepad2,
    title: "VS IA",
    desc: "Sete adversários com personalidade própria.",
    to: "/jogar" as const,
  },
  {
    icon: Map,
    title: "Campanha",
    desc: "Conquiste um clube em cada estado do Brasil.",
    to: "/campanha" as const,
  },
  {
    icon: Users,
    title: "Casual",
    desc: "Partida rápida, sem pressão e sem ranking.",
    to: "/jogar" as const,
  },
  {
    icon: Sparkles,
    title: "Treino",
    desc: "Aprenda sequências, canastras e o morto.",
    to: "/jogar" as const,
  },
];

function Lobby() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <section className="animate-rise relative mt-10 overflow-hidden rounded-3xl border bg-gradient-to-br from-[var(--felt)]/45 to-transparent p-8 sm:p-12">
          <div className="animate-shimmer pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--gold)]/20 blur-3xl" />
          <p className="text-xs tracking-[0.35em] text-[var(--gold)] uppercase">Clube privado</p>
          <h1 className="gold-text mt-3 max-w-xl text-4xl font-bold sm:text-6xl">
            A mesa de Canastra mais elegante do Brasil
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Buraco aberto e fechado, curingas, morto e canastras limpas — com IA de verdade,
            animações suaves e uma mesa de veludo digna dos clubes clássicos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/jogar"
              search={{ ia: "estrategica" }}
              className="gold-ring rounded-full bg-[var(--gold)] px-6 py-3 font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-105"
            >
              Jogar agora
            </Link>
            <Link
              to="/online"
              className="rounded-full border border-[var(--gold)]/60 px-6 py-3 font-medium transition-colors hover:bg-[var(--gold)]/10"
            >
              Jogar online com código
            </Link>
            <Link
              to="/campanha"
              className="rounded-full border px-6 py-3 font-medium transition-colors hover:bg-[var(--gold)]/10"
            >
              Ver campanha
            </Link>

          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Modos de jogo</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((m) => (
              <Link
                key={m.title}
                to={m.to}
                search={m.to === "/jogar" ? { ia: "estrategica" } : undefined}
                className="glass group animate-rise rounded-2xl p-5 transition-transform hover:-translate-y-1"
              >
                <m.icon className="h-6 w-6 text-[var(--gold)]" />
                <h3 className="mt-3 text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Escolha seu adversário</h2>
          <p className="text-sm text-muted-foreground">
            Sete dificuldades, sete personalidades na mesa.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PERSONAS.map((p) => (
              <Link
                key={p.id}
                to="/jogar"
                search={{ ia: p.id }}
                className="glass flex items-start gap-3 rounded-2xl p-4 transition-colors hover:border-[var(--gold)]/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs tracking-wide text-[var(--gold)] uppercase">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass mt-12 flex flex-wrap items-center gap-4 rounded-2xl p-6">
          <Trophy className="h-6 w-6 text-[var(--gold)]" />
          <p className="text-sm text-muted-foreground">
            Entretenimento puro: sem apostas com dinheiro real, prêmios financeiros ou qualquer
            mecanismo de jogo de azar.
          </p>
        </section>
      </main>
    </>
  );
}
