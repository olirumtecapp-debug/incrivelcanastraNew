export interface Stats {
  wins: number;
  losses: number;
  bestScore: number;
  canastrasLimpas: number;
  canastrasSujas: number;
}

export const emptyStats: Stats = {
  wins: 0,
  losses: 0,
  bestScore: 0,
  canastrasLimpas: 0,
  canastrasSujas: 0,
};

const KEY = "cr:stats";

export function loadStats(): Stats {
  if (typeof window === "undefined") return emptyStats;
  try {
    return { ...emptyStats, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return emptyStats;
  }
}

export function saveStats(s: Stats) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
}

export function recordResult(patch: Partial<Stats>) {
  const cur = loadStats();
  saveStats({
    wins: cur.wins + (patch.wins ?? 0),
    losses: cur.losses + (patch.losses ?? 0),
    bestScore: Math.max(cur.bestScore, patch.bestScore ?? 0),
    canastrasLimpas: cur.canastrasLimpas + (patch.canastrasLimpas ?? 0),
    canastrasSujas: cur.canastrasSujas + (patch.canastrasSujas ?? 0),
  });
}
