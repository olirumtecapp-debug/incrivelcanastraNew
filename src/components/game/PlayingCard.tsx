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
  md: "h-[clamp(64px,11vh,116px)] aspect-[5/7] text-[clamp(11px,1.6vh,16px)]",
  sm: "h-[clamp(40px,6.4vh,68px)] aspect-[5/7] text-[clamp(8px,1.1vh,12px)]",
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
        "bg-[linear-gradient(160deg,oklch(1_0_0),oklch(0.96_0.008_90))]",
        "shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.9)]",
        onClick && "hover:z-20 hover:-translate-y-[14%] hover:scale-[1.06] hover:shadow-2xl",
        selected &&
          "z-20 -translate-y-[18%] shadow-[0_0_26px_-4px_var(--gold)] ring-2 ring-[var(--gold)]",
        red ? "text-[oklch(0.46_0.23_27)]" : "text-[oklch(0.14_0.01_265)]",
        size,
        className,
      )}
    >
      {/* brilho superior */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),transparent)]" />

      {isJoker(card) ? (
        <span className="absolute inset-0 grid place-items-center">
          <span className="bg-[linear-gradient(120deg,oklch(0.55_0.24_300),oklch(0.6_0.19_60))] bg-clip-text text-[2.3em] font-black text-transparent">
            ★
          </span>
        </span>
      ) : (
        <>
          {/* marca d'água central */}
          <span
            className={cn(
              "pointer-events-none absolute inset-0 grid place-items-center text-[2.7em] opacity-[0.22]",
            )}
          >
            {symbol}
          </span>
          <span className="absolute top-[4%] left-[7%] flex flex-col items-center leading-[0.9]">
            <span className="text-[1.5em] font-black tracking-[-0.04em]">{label}</span>
            <span className="text-[1.15em] leading-none">{symbol}</span>
          </span>
          <span className="absolute right-[7%] bottom-[4%] flex rotate-180 flex-col items-center leading-[0.9]">
            <span className="text-[1.5em] font-black tracking-[-0.04em]">{label}</span>
            <span className="text-[1.15em] leading-none">{symbol}</span>
          </span>
        </>
      )}
    </Component>
  );
}

