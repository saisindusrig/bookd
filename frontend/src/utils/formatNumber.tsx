export const formatRating = (
  rating: number | null | undefined
): string => {
  if (
    rating === null ||
    rating === undefined ||
    Number.isNaN(Number(rating)) ||
    rating <= 0
  ) {
    return "N/A";
  }

  return Number(rating).toFixed(1);
};

export const formatCount = (
  count: number | null | undefined
): string => {
  if (!count || count < 0) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
};