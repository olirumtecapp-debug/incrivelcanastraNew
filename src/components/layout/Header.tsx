import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";

const links = [
  { to: "/", label: "Lobby" },
  { to: "/jogar", label: "Mesa" },
  { to: "/campanha", label: "Campanha" },
  { to: "/perfil", label: "Perfil" },
] as const;

export function Header() {
  return (
    <header className="glass sticky top-0 z-30 border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-[var(--gold)]" />
          <span className="gold-text font-display text-xl font-bold tracking-wide">
            Canastra Royale
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "bg-[var(--gold)]/15 text-[var(--gold)]" }}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
