import { Link } from "@tanstack/react-router";
import { Heart, Smartphone, Monitor, Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function Footer() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pixCode = "00020101021126580014br.gov.bcb.pix0136ccc2fd5a-cc51-4626-ac9b-8010315042f55204000053039865802BR5924MURILO FERREIRA DA SILVA6009SAO PAULO622905251KYF6GJBG4K0TVYH7QKHP9TSD63042519";

  useEffect(() => {
    const handler = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        toast.error("Não foi possível ativar tela cheia.");
      });
    } else {
      document.exitFullscreen();
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código PIX copiado! Banco C6 · Murilo Ferreira da Silva");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <footer className="glass mt-20 border-t py-12 pb-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Dispositivos e Instalação */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--gold)]">
              <Smartphone className="h-5 w-5" /> Jogue em Qualquer Lugar
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Canastra Royale é 100% responsivo. Jogue no seu <strong>Smartphone, Tablet, PC ou Notebook</strong> com a mesma experiência premium.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleFullScreen}
                className="flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-4 py-2 text-xs font-medium transition-colors hover:bg-[var(--gold)]/15"
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                {isFullScreen ? "Sair da Tela Cheia" : "Tela Cheia"}
              </button>
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium transition-colors hover:bg-white/10">
                  <Monitor className="h-4 w-4" /> Instalar App
                </button>
                <div className="invisible absolute bottom-full left-0 mb-2 w-48 rounded-xl bg-card p-3 text-[10px] shadow-xl group-hover:visible border z-50">
                  Para instalar, clique no ícone de <strong>compartilhar</strong> (iOS) ou nos <strong>três pontos</strong> (Android/Chrome) e selecione <strong>"Adicionar à tela de início"</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Como Jogar no PC */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--gold)]">Como Jogar no PC</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Acesse pelo endereço: <br />
              <code className="mt-1 block rounded bg-black/30 p-2 text-[11px] text-[var(--gold)]">
                {typeof window !== 'undefined' ? window.location.origin : 'incrivelcanastra.lovable.app'}
              </code>
            </p>
            <p className="text-xs text-muted-foreground">
              Dica: Use as setas do teclado para navegar e a barra de espaço para confirmar ações rápidas.
            </p>
          </div>

          {/* Apoio / PIX */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--gold)]">
              <Heart className="h-5 w-5 fill-[var(--gold)]" /> Apoie o Projeto
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gostou do jogo? Seu apoio ajuda a manter os servidores online e trazer novos modos de jogo.
            </p>
            <div className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold)]/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--gold)]">Murilo Ferreira da Silva</p>
                  <p className="truncate text-xs text-muted-foreground">Banco C6 · PIX Copia e Cola</p>
                </div>
                <button
                  onClick={copyPix}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--primary-foreground)] transition-transform hover:scale-110 active:scale-95 shadow-lg"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          © 2026 Canastra Royale · Desenvolvido para amantes do Buraco
        </div>
      </div>
    </footer>
  );
}
