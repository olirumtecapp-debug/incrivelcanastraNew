import { cn } from "@/lib/utils";
import { RANK_LABEL, SUIT_SYMBOL, isJoker } from "@/lib/canastra/rules";
import type { Card, Suit } from "@/lib/canastra/types";

interface Props {
  card?: Card;
  faceDown?: boolean;
  selected?: boolean;
  small?: boolean;
  onClick?: () => void;
  className?: string;
  index?: number;
}

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
  const size = small ? "h-16 w-11 text-[11px]" : "h-24 w-16 text-sm sm:h-28 sm:w-19";

  if (faceDown || !card) {
    return (
      <div
        className={cn(
          "rounded-xl border border-[var(--gold)]/30 shadow-lg",
          "bg-[repeating-linear-gradient(45deg,oklch(0.28_0.05_265)_0_6px,oklch(0.22_0.04_265)_6px_12px)]",
          size,
          className,
        )}
        aria-hidden
      />
    );
  }

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{ animationDelay: `${index * 35}ms` }}
      aria-label={isJoker(card) ? "Coringa" : `${RANK_LABEL[card.rank]} de ${card.suit}`}
      className={cn(
        "animate-deal relative flex flex-col justify-between rounded-xl bg-[oklch(0.97_0.01_90)] p-1.5 font-semibold shadow-xl transition-all duration-200",
        "border border-black/10",
        onClick && "hover:-translate-y-3 hover:shadow-[0_18px_30px_-12px_rgba(0,0,0,0.7)] hover:z-10",
        selected && "-translate-y-4 ring-2 ring-[var(--gold)] shadow-[0_0_24px_-4px_var(--gold)]",
        red ? "text-[oklch(0.52_0.2_25)]" : "text-[oklch(0.2_0.02_265)]",
        size,
        className,
      )}
    >
      {isJoker(card) ? (
        <span className="flex h-full items-center justify-center text-2xl text-[oklch(0.6_0.15_300)]">
          ★
        </span>
      ) : (
        <>
          <span className="leading-none">{RANK_LABEL[card.rank]}</span>
          <span className="self-center text-xl leading-none">
            {SUIT_SYMBOL[card.suit as Suit]}
          </span>
          <span className="self-end rotate-180 leading-none">{RANK_LABEL[card.rank]}</span>
        </>
      )}
    </Component>
  );
}
