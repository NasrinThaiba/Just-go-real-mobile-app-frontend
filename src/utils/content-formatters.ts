export function formatViews(
  views?: number,
): string {
  const safeViews =
    typeof views === 'number' &&
    Number.isFinite(views) &&
    views > 0
      ? views
      : 0;

  if (safeViews >= 1_000_000) {
    return `${Number(
      (
        safeViews /
        1_000_000
      ).toFixed(1),
    )}M`;
  }

  if (safeViews >= 1_000) {
    return `${Number(
      (
        safeViews /
        1_000
      ).toFixed(1),
    )}K`;
  }

  return String(
    Math.floor(safeViews),
  );
}

export function formatPublishedTime(
  dateValue?: string | Date,
): string {
  if (!dateValue) {
    return '';
  }

  const date =
    dateValue instanceof Date
      ? dateValue
      : new Date(dateValue);

  const publishedTime =
    date.getTime();

  if (
    Number.isNaN(
      publishedTime,
    )
  ) {
    return '';
  }

  const difference =
    Math.max(
      Date.now() -
        publishedTime,
      0,
    );

  const minutes =
    Math.floor(
      difference /
        (1000 * 60),
    );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  if (days < 30) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
}