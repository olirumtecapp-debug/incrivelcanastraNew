import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { ColorPaletteMenu } from "../game/ColorPaletteMenu";

const links = [
  { to: "/", label: "Lobby" },
  { to: "/como-jogar", label: "Como jogar" },
  { to: "/jogar", label: "Mesa" },
  { to: "/online", label: "Online" },


  { to: "/campanha", label: "Campanha" },
  { to: "/perfil", label: "Perfil" },
] as const;

export function Header() {
  return (
    <header className="glass sticky top-0 z-30 border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <Crown className="h-5 w-5 shrink-0 sm:h-6 sm:w-6 text-[var(--gold)]" />
          <span className="gold-text font-display hidden truncate text-base sm:inline font-bold tracking-wide sm:text-xl">
            Canastra Royale
          </span>
        </Link>
        <nav className="flex min-w-0 items-center gap-0.5 overflow-x-auto text-xs sm:gap-1 sm:text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "bg-[var(--gold)]/15 text-[var(--gold)]" }}
              activeOptions={{ exact: l.to === "/" }}
              className="shrink-0 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
