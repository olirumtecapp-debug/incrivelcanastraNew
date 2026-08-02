import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PlayingCard } from "@/components/game/PlayingCard";
import type { Card } from "@/lib/canastra/types";

export const Route = createFileRoute("/como-jogar")({
  head: () => ({
    meta: [
      { title: "Como jogar Canastra — regras e mecânica passo a passo" },
      {
        name: "description",
        content:
          "Aprenda a jogar Canastra (Buraco): como montar sequências do mesmo naipe, usar curingas, pegar o lixo, formar canastras limpas e sujas e bater.",
      },
      { property: "og:title", content: "Como jogar Canastra — regras e mecânica" },
      {
        property: "og:description",
        content: "Guia completo de sequências, curingas, morto, canastras e pontuação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComoJogar,
});

const c = (id: string, suit: Card["suit"], rank: number): Card => ({ id, suit, rank });

function Row({ cards }: { cards: Card[] }) {
  return (
    <div className="flex -space-x-3">
      {cards.map((card, i) => (
        <PlayingCard key={card.id} card={card} small index={i} />
      ))}
    </div>
  );
}

function Example({ ok, cards, note }: { ok: boolean; cards: Card[]; note: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
      {ok ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-red-400" />
      )}
      <Row cards={cards} />
      <p className="text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

const steps = [
  {
    t: "1. Compre uma carta",
    d: "No começo do seu turno você precisa comprar: clique no Monte (uma carta) ou no Lixo (leva a pilha inteira de descartes).",
  },
  {
    t: "2. Baixe jogos (opcional)",
    d: "Selecione 3 ou mais cartas da sua mão que formem uma sequência válida e clique em “Baixar jogo”. Elas ficam na mesa, à sua frente.",
  },
  {
    t: "3. Amplie jogos já baixados",
    d: "Selecione cartas na mão e clique em um dos seus jogos na mesa. Se elas encaixarem nas pontas da sequência, entram nele.",
  },
  {
    t: "4. Descarte para encerrar o turno",
    d: "Selecione exatamente 1 carta e clique em “Descartar”. Ela vai para o lixo e a vez passa ao adversário.",
  },
  {
    t: "5. Pegue o morto",
    d: "Quando você fica sem cartas na mão pela primeira vez, recebe um “morto” (um monte extra) e continua jogando.",
  },
  {
    t: "6. Bata",
    d: "Depois de já ter pego o morto, ficar sem cartas na mão encerra a rodada — e você bate.",
  },
];

function ComoJogar() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-20">
        <section className="animate-rise mt-10 rounded-3xl border bg-gradient-to-br from-[var(--felt)]/45 to-transparent p-8">
          <p className="text-xs tracking-[0.35em] text-[var(--gold)] uppercase">Guia rápido</p>
          <h1 className="gold-text mt-3 text-4xl font-bold">Como jogar Canastra</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            O objetivo é simples: transformar as cartas da sua mão em <strong>sequências</strong> na
            mesa, formar <strong>canastras</strong> (jogos de 7 cartas ou mais) e ser o primeiro a
            ficar sem cartas depois de pegar o morto. Quem tiver mais pontos vence.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">O que é uma sequência</h2>
          <p className="mt-2 text-muted-foreground">
            Uma sequência é um conjunto de <strong>3 ou mais cartas do mesmo naipe</strong>, em
            ordem crescente e sem buracos. O Ás pode valer antes do 2 (A-2-3) ou depois do Rei
            (Q-K-A). Aqui nesta mesa não existem trincas (três cartas do mesmo número) — só
            sequências.
          </p>
          <div className="mt-4 grid gap-3">
            <Example
              ok
              cards={[c("e1", "H", 5), c("e2", "H", 6), c("e3", "H", 7)]}
              note="5-6-7 de copas: mesmo naipe, em ordem, sem falhas."
            />
            <Example
              ok
              cards={[c("e4", "S", 11), c("e5", "S", 12), c("e6", "S", 13), c("e7", "S", 1)]}
              note="J-Q-K-A de espadas: o Ás fecha por cima."
            />
            <Example
              ok={false}
              cards={[c("e8", "D", 4), c("e9", "C", 5), c("e10", "D", 6)]}
              note="Naipes misturados — inválido."
            />
            <Example
              ok={false}
              cards={[c("e11", "C", 4), c("e12", "C", 6), c("e13", "C", 8)]}
              note="Tem buracos entre as cartas — inválido."
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Curingas</h2>
          <p className="mt-2 text-muted-foreground">
            O <strong>Coringa (★)</strong> e qualquer <strong>2</strong> são curingas: eles tapam um
            buraco da sequência. Regra da mesa: no máximo <strong>um curinga por jogo</strong>, e o
            jogo precisa de pelo menos 2 cartas naturais.
          </p>
          <div className="mt-4 grid gap-3">
            <Example
              ok
              cards={[c("w1", "D", 8), c("w2", null, 0), c("w3", "D", 10)]}
              note="O coringa faz o papel do 9 de ouros."
            />
            <Example
              ok
              cards={[c("w4", "C", 4), c("w5", "C", 5), c("w6", "H", 2)]}
              note="O 2 entra como curinga fazendo o 6 de paus."
            />
            <Example
              ok={false}
              cards={[c("w7", "S", 9), c("w8", null, 0), c("w9", "H", 2)]}
              note="Dois curingas no mesmo jogo — inválido."
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Um turno, passo a passo</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {steps.map((s) => (
              <li key={s.t} className="glass rounded-2xl p-4">
                <p className="font-semibold text-[var(--gold)]">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Canastras e pontuação</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="glass rounded-2xl p-4">
              <p className="font-semibold">Canastra limpa · +200</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Jogo com 7+ cartas e <strong>nenhum</strong> curinga.
              </p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="font-semibold">Canastra suja · +100</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Jogo com 7+ cartas usando um curinga.
              </p>
            </div>
          </div>
          <div className="glass mt-3 rounded-2xl p-4 text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">Valor das cartas</p>
            <p>
              Coringa 20 · Ás 15 · 2 vale 10 · 8, 9, 10, J, Q, K valem 10 · 3, 4, 5, 6, 7 valem 5.
            </p>
            <p className="mt-2">
              Cartas baixadas na mesa somam; cartas que sobram na sua mão no fim da rodada são
              descontadas.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Dicas para começar</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Guarde os curingas para completar canastras, não para jogos pequenos.</li>
            <li>· Pegar o lixo é forte quando a pilha está grande — você ganha muito material.</li>
            <li>· Evite descartar cartas que encaixam nos jogos já baixados pelo adversário.</li>
            <li>· Prefira canastras limpas: valem o dobro em bônus.</li>
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/jogar"
            search={{ ia: "conservadora" as const }}
            className="gold-ring rounded-full bg-[var(--gold)] px-6 py-3 font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-105"
          >
            Praticar contra a IA mais fácil
          </Link>
          <Link
            to="/"
            className="rounded-full border px-6 py-3 font-medium transition-colors hover:bg-[var(--gold)]/10"
          >
            Voltar ao lobby
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
