import { useState, useEffect } from "react";
import { Palette, Check, X } from "lucide-react";
import { toast } from "sonner";

export type ThemeColors = {
  id: string;
  name: string;
  felt: string;
  feltDeep: string;
  background: string;
  gold: string;
  goldSoft: string;
};

export const PALETTES: ThemeColors[] = [
  {
    id: "classic-gold",
    name: "Clássico Royale",
    felt: "oklch(0.34 0.07 158)",
    feltDeep: "oklch(0.24 0.05 158)",
    background: "oklch(0.16 0.02 265)",
    gold: "oklch(0.79 0.14 85)",
    goldSoft: "oklch(0.88 0.09 88)",
  },
  {
    id: "midnight-blue",
    name: "Noite Azul",
    felt: "oklch(0.25 0.08 260)",
    feltDeep: "oklch(0.15 0.05 260)",
    background: "oklch(0.12 0.03 260)",
    gold: "oklch(0.85 0.12 90)",
    goldSoft: "oklch(0.92 0.08 92)",
  },
  {
    id: "crimson-club",
    name: "Clube Carmesim",
    felt: "oklch(0.30 0.12 25)",
    feltDeep: "oklch(0.20 0.08 25)",
    background: "oklch(0.14 0.03 25)",
    gold: "oklch(0.82 0.15 85)",
    goldSoft: "oklch(0.90 0.10 88)",
  },
  {
    id: "emerald-casino",
    name: "Cassino Esmeralda",
    felt: "oklch(0.35 0.12 160)",
    feltDeep: "oklch(0.25 0.08 160)",
    background: "oklch(0.15 0.03 160)",
    gold: "oklch(0.80 0.15 85)",
    goldSoft: "oklch(0.88 0.10 88)",
  },
  {
    id: "obsidian-onyx",
    name: "Ônix Negro",
    felt: "oklch(0.18 0.01 265)",
    feltDeep: "oklch(0.12 0.01 265)",
    background: "oklch(0.10 0.01 265)",
    gold: "oklch(0.75 0.01 265)",
    goldSoft: "oklch(0.85 0.01 265)",
  },
];

export function ColorPaletteMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState("classic-gold");

  useEffect(() => {
    const saved = localStorage.getItem("canastra-theme");
    if (saved) {
      const palette = PALETTES.find((p) => p.id === saved);
      if (palette) {
        applyPalette(palette, false);
        setCurrentId(saved);
      }
    }
  }, []);

  const applyPalette = (palette: ThemeColors, notify = true) => {
    const root = document.documentElement;
    root.style.setProperty("--felt", palette.felt);
    root.style.setProperty("--felt-deep", palette.feltDeep);
    root.style.setProperty("--background", palette.background);
    root.style.setProperty("--gold", palette.gold);
    root.style.setProperty("--gold-soft", palette.goldSoft);
    
    // Update border and primary to match gold
    root.style.setProperty("--border", `${palette.gold} / 18%`);
    root.style.setProperty("--primary", palette.gold);
    
    localStorage.setItem("canastra-theme", palette.id);
    setCurrentId(palette.id);
    
    if (notify) {
      toast.success(`Tema ${palette.name} aplicado!`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 transition-all hover:scale-110 active:scale-95"
        title="Alterar Cores"
      >
        <Palette className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-[100] w-64 animate-rise rounded-2xl border bg-card p-4 shadow-2xl overflow-hidden">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--gold)]">Paleta de Cores</h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPalette(p)}
                  className={`flex items-center justify-between rounded-xl border p-2 text-left transition-all hover:bg-[var(--gold)]/5 ${
                    currentId === p.id ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 shadow-inner">
                      <div className="h-full w-1/2" style={{ backgroundColor: p.felt }} />
                      <div className="h-full w-1/2" style={{ backgroundColor: p.gold }} />
                    </div>
                    <span className="text-xs font-medium">{p.name}</span>
                  </div>
                  {currentId === p.id && <Check className="h-4 w-4 text-[var(--gold)]" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}