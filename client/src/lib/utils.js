import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getCurrencySymbol = (currency) => {
  switch (currency?.toLowerCase()) {
    case "usd":
      return "$";
    case "eur":
      return "€";
    case "try":
      return "₺";
    case "gbp":
      return "£";
    default:
      return "$";
  }
};
