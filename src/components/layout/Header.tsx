import { Link } from "@tanstack/react-router";
import { Crown, Menu, X } from "lucide-react";
import { ColorPaletteMenu } from "../game/ColorPaletteMenu";
import { useState } from "react";

const links = [
  { to: "/", label: "Lobby" },
  { to: "/como-jogar", label: "Como jogar" },
  { to: "/jogar", label: "Mesa" },
  { to: "/online", label: "Online" },


  { to: "/campanha", label: "Campanha" },
  { to: "/perfil", label: "Perfil" },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-30 border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <Crown className="h-5 w-5 shrink-0 sm:h-6 sm:w-6 text-[var(--gold)]" />
          <span className="gold-text font-display hidden truncate text-base sm:inline font-bold tracking-wide sm:text-xl">
            Canastra Royale
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex min-w-0 items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "bg-[var(--gold)]/15 text-[var(--gold)]" }}
              activeOptions={{ exact: l.to === "/" }}
              className="shrink-0 rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 ml-auto">
          <ColorPaletteMenu />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-white/10"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b bg-card/95 backdrop-blur-xl animate-rise">
          <nav className="flex flex-col p-4 gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setIsMenuOpen(false)}
                activeProps={{ className: "bg-[var(--gold)]/15 text-[var(--gold)] border-[var(--gold)]/30" }}
                activeOptions={{ exact: l.to === "/" }}
                className="flex items-center justify-between rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
