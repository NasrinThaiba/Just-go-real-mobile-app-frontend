export function formatViews(
  views?: number,
): string {
  const safeViews =
    typeof views === 'number' &&
    Number.isFinite(views) &&
    views > 0
      ? Math.floor(views)
      : 0;

  if (safeViews >= 1_000_000) {
    return `${Number(
      (
        safeViews / 1_000_000
      ).toFixed(1),
    )}M`;
  }

  if (safeViews >= 1_000) {
    return `${Number(
      (
        safeViews / 1_000
      ).toFixed(1),
    )}K`;
  }

  return String(safeViews);
}