import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { PERSONAS } from "@/lib/canastra/ai";

export const Route = createFileRoute("/campanha")({
  head: () => ({
    meta: [
      { title: "Campanha pelos clubes do Brasil — Canastra Royale" },
      {
        name: "description",
        content:
          "Percorra clubes exclusivos em cada estado, enfrente adversários lendários e conquiste troféus na campanha de Canastra Royale.",
      },
      { property: "og:title", content: "Campanha pelos clubes do Brasil — Canastra Royale" },
      {
        property: "og:description",
        content: "Clubes estaduais, adversários únicos e troféus a cada vitória.",
      },
    ],
  }),
  component: Campanha,
});

const clubes = [
  { estado: "Rio Grande do Sul", clube: "Clube da Serra", cor: "from-emerald-900/50" },
  { estado: "São Paulo", clube: "Salão Paulista", cor: "from-amber-900/40" },
  { estado: "Rio de Janeiro", clube: "Varanda Carioca", cor: "from-sky-900/40" },
  { estado: "Minas Gerais", clube: "Casarão Mineiro", cor: "from-orange-900/40" },
  { estado: "Bahia", clube: "Terraço do Pelô", cor: "from-yellow-900/40" },
  { estado: "Pernambuco", clube: "Frevo Royale", cor: "from-rose-900/40" },
  { estado: "Amazonas", clube: "Salão do Teatro", cor: "from-teal-900/40" },
  { estado: "Distrito Federal", clube: "Clube Central", cor: "from-indigo-900/40" },
];

function Campanha() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <h1 className="gold-text mt-10 text-4xl font-bold">Campanha</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Cada estado guarda um clube exclusivo, com cenário, mesa e adversário próprios. Vença a
          mesa para desbloquear o próximo clube.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clubes.map((c, i) => {
            const persona = PERSONAS[Math.min(i, PERSONAS.length - 1)]!;
            const locked = i > 2;
            return (
              <div
                key={c.estado}
                className={`glass animate-rise relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.cor} to-transparent p-5`}
              >
                <p className="text-xs tracking-[0.25em] text-[var(--gold)] uppercase">{c.estado}</p>
                <h2 className="mt-1 text-xl font-semibold">{c.clube}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Adversário: {persona.name} · {persona.title}
                </p>
                {locked ? (
                  <span className="mt-4 inline-block rounded-full border px-4 py-2 text-sm text-muted-foreground">
                    Bloqueado
                  </span>
                ) : (
                  <Link
                    to="/jogar"
                    search={{ ia: persona.id }}
                    className="mt-4 inline-block rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-105"
                  >
                    Entrar no clube
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
