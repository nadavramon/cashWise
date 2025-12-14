// src/utils/currency.ts

export const getCurrencySymbol = (currency?: string): string => {
  const c = (currency || "").toUpperCase();

  switch (c) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "ILS":
      return "₪";
    default:
      return c || "₪";
  }
};
