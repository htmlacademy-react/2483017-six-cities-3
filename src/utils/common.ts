const REVIEW_DATE_FORMAT = {
  month: 'long',
  year: 'numeric',
} as const;

export function formatReviewDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', REVIEW_DATE_FORMAT);
}

export const capitalizeFirstLetter = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
