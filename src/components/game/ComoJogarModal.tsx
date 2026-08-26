import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HelpCircle, Sparkles, CheckCircle2, Trophy, Layers, Flame } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComoJogarModal({ open, onOpenChange }: Props) {
  const [tab, setTab] = useState<"passos" | "regras" | "pontuacao">("passos");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[95vw] max-w-2xl overflow-y-auto rounded-3xl border border-[var(--gold)]/30 bg-[#0f1d18] p-5 text-foreground shadow-2xl backdrop-blur-xl sm:p-6">
        <DialogHeader className="border-b border-white/10 pb-3 text-left">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <HelpCircle className="h-6 w-6 text-[var(--gold)]" />
            <span className="gold-text">Como Jogar Canastra (Buraco)</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Guia rápido, dicas de jogadas e pontuação da mesa.
          </p>
        </DialogHeader>

        {/* Abas */}
        <div className="flex gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setTab("passos")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              tab === "passos"
                ? "bg-[var(--gold)] text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            📋 O Seu Turno
          </button>
          <button
            onClick={() => setTab("regras")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              tab === "regras"
                ? "bg-[var(--gold)] text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            🃏 Canastras & Curingas
          </button>
          <button
            onClick={() => setTab("pontuacao")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              tab === "pontuacao"
                ? "bg-[var(--gold)] text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            🏆 Pontuação
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {tab === "passos" && (
          <div className="space-y-3 pt-1 text-xs sm:text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="font-bold text-[var(--gold)] flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--gold)] text-[10px] text-black font-extrabold">1</span>
                Comprar Carta (Obrigatório)
              </p>
              <p className="mt-1 text-white/80">
                No início do seu turno, clique no <b>Monte</b> (compra 1 carta fechada) ou no <b>Lixo</b> (pega todas as cartas descartadas).
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="font-bold text-[var(--gold)] flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--gold)] text-[10px] text-black font-extrabold">2</span>
                Baixar ou Encaixar Jogos (Opcional)
              </p>
              <p className="mt-1 text-white/80">
                Selecione 3 ou mais cartas consecutivas do <b>mesmo naipe</b> e clique em <b>"Baixar jogo"</b>. Para aumentar um jogo já baixado, selecione a carta na mão e clique no jogo na mesa.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="font-bold text-[var(--gold)] flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--gold)] text-[10px] text-black font-extrabold">3</span>
                Descartar (Obrigatório para passar a vez)
              </p>
              <p className="mt-1 text-white/80">
                Selecione <b>exatamente 1 carta</b> da sua mão e clique em <b>"Descartar"</b>. A carta vai para o lixo e a vez passa ao adversário.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-emerald-300">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Dica Rápida:
              </p>
              <p className="mt-1 text-xs text-emerald-200/90">
                Se você tentar fazer uma ação fora de hora ou inválida, o jogo avisa com uma notificação na tela explicando o motivo!
              </p>
            </div>
          </div>
        )}

        {tab === "regras" && (
          <div className="space-y-3 pt-1 text-xs sm:text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[var(--gold)]" />
                Sequências Válidas
              </p>
              <p className="mt-1 text-white/80">
                Devem ter no mínimo 3 cartas do <b>mesmo naipe</b> em ordem (ex: 4♠, 5♠, 6♠). O Ás pode ser usado antes do 2 ou depois do Rei (K).
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-400" />
                Curingas
              </p>
              <p className="mt-1 text-white/80">
                O <b>Coringa (★)</b> e a carta <b>2</b> funcionam como curingas. Cada jogo na mesa pode conter no máximo <b>1 curinga</b>.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-yellow-400" />
                Canastras (7 cartas ou mais)
              </p>
              <ul className="mt-1.5 space-y-1 text-white/80">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <b>Canastra Limpa:</b> 7+ cartas sem nenhum curinga (vale +200 pontos).
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <b>Canastra Suja:</b> 7+ cartas contendo 1 curinga (vale +100 pontos).
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="font-bold text-white">📦 O Morto e Batida</p>
              <p className="mt-1 text-white/80">
                Ao descartar todas as cartas da mão pela 1ª vez, você pega o <b>Morto</b> (11 cartas novas). Ao zerar a mão após ter pego o morto, você <b>Bate</b> e encerra a partida!
              </p>
            </div>
          </div>
        )}

        {tab === "pontuacao" && (
          <div className="space-y-3 pt-1 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="font-bold text-[var(--gold)]">Canastra Limpa</p>
                <p className="text-sm font-black text-emerald-400">+200 pts</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="font-bold text-[var(--gold)]">Canastra Suja</p>
                <p className="text-sm font-black text-amber-400">+100 pts</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="font-bold text-[var(--gold)]">Batida Final</p>
                <p className="text-sm font-black text-yellow-300">+100 pts</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="font-bold text-red-400">Não Pegar o Morto</p>
                <p className="text-sm font-black text-red-400">-100 pts</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="font-bold text-white mb-2">Valores das Cartas:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-white/60">Cartas 3 ao 7</p>
                  <p className="font-bold text-white">5 pts cada</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-white/60">Cartas 8 ao K e 2</p>
                  <p className="font-bold text-white">10 pts cada</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-white/60">Ás (A)</p>
                  <p className="font-bold text-white">15 pts cada</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-white/60">Coringa (★)</p>
                  <p className="font-bold text-white">20 pts cada</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
