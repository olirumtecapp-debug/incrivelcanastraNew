import { cn } from "@/lib/utils";
import { RANK_LABEL, SUIT_SYMBOL, isJoker } from "@/lib/canastra/rules";
import type { Card, Suit } from "@/lib/canastra/types";

interface Props {
  card?: Card | undefined;
  faceDown?: boolean | undefined;
  selected?: boolean | undefined;
  small?: boolean | undefined;
  onClick?: (() => void) | undefined;
  className?: string | undefined;
  index?: number | undefined;
}

/** Alturas fluidas: a mesa nunca precisa de rolagem. */
const SIZE = {
  md: "h-[clamp(60px,11vh,116px)] aspect-[5/7] text-[clamp(9px,1.5vh,15px)]",
  sm: "h-[clamp(38px,6.4vh,68px)] aspect-[5/7] text-[clamp(7px,1vh,11px)]",
};

export function PlayingCard({
  card,
  faceDown,
  selected,
  small,
  onClick,
  className,
  index = 0,
}: Props) {
  const red = card && (card.suit === "H" || card.suit === "D");
  const size = small ? SIZE.sm : SIZE.md;

  if (faceDown || !card) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[12%] border border-[var(--gold)]/35",
          "bg-[linear-gradient(150deg,oklch(0.3_0.06_265),oklch(0.19_0.04_265))]",
          "shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9),inset_0_0_0_2px_oklch(0.79_0.14_85/0.18)]",
          size,
          className,
        )}
        aria-hidden
      >
        <div className="absolute inset-[8%] rounded-[10%] border border-[var(--gold)]/25 bg-[repeating-linear-gradient(45deg,transparent_0_4px,oklch(0.79_0.14_85/0.14)_4px_5px)]" />
        <span className="absolute inset-0 grid place-items-center text-[1.4em] text-[var(--gold)]/60">
          ♛
        </span>
      </div>
    );
  }

  const Component = onClick ? "button" : "div";
  const label = RANK_LABEL[card.rank];
  const symbol = card.suit ? SUIT_SYMBOL[card.suit as Suit] : "★";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{ animationDelay: `${index * 30}ms` }}
      aria-label={isJoker(card) ? "Coringa" : `${label} de ${card.suit}`}
      className={cn(
        "animate-deal group relative overflow-hidden rounded-[12%] font-semibold transition-all duration-200",
        "bg-[linear-gradient(160deg,oklch(0.99_0.005_90),oklch(0.93_0.012_90))]",
        "shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]",
        onClick && "hover:z-20 hover:-translate-y-[14%] hover:scale-[1.06] hover:shadow-2xl",
        selected &&
          "z-20 -translate-y-[18%] shadow-[0_0_26px_-4px_var(--gold)] ring-2 ring-[var(--gold)]",
        red ? "text-[oklch(0.52_0.2_25)]" : "text-[oklch(0.2_0.02_265)]",
        size,
        className,
      )}
    >
      {/* brilho superior */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),transparent)]" />

      {isJoker(card) ? (
        <span className="absolute inset-0 grid place-items-center">
          <span className="bg-[linear-gradient(120deg,oklch(0.7_0.18_300),oklch(0.75_0.16_85))] bg-clip-text text-[2.1em] text-transparent">
            ★
          </span>
        </span>
      ) : (
        <>
          {/* marca d'água central */}
          <span
            className={cn(
              "pointer-events-none absolute inset-0 grid place-items-center text-[2.6em] opacity-[0.13]",
            )}
          >
            {symbol}
          </span>
          <span className="absolute top-[6%] left-[8%] flex flex-col items-center leading-[0.95]">
            <span className="text-[1.15em] font-bold tracking-tighter">{label}</span>
            <span className="text-[0.95em]">{symbol}</span>
          </span>
          <span className="absolute right-[8%] bottom-[6%] flex rotate-180 flex-col items-center leading-[0.95]">
            <span className="text-[1.15em] font-bold tracking-tighter">{label}</span>
            <span className="text-[0.95em]">{symbol}</span>
          </span>
        </>
      )}
    </Component>
  );
}
