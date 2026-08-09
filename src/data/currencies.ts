export interface Currency {
  code: string;
  symbol: string;
  label: string;
  /** How many units of this currency one RWF is worth. */
  perRWF: number;
  decimals: number;
}

/** RWF is the base pricing currency for every SAFIA commission. */
export const CURRENCIES: Currency[] = [
  { code: "RWF", symbol: "RWF", label: "Rwandan Franc", perRWF: 1, decimals: 0 },
  { code: "USD", symbol: "$", label: "US Dollar", perRWF: 0.00072, decimals: 2 },
  { code: "EUR", symbol: "€", label: "Euro", perRWF: 0.00066, decimals: 2 },
  { code: "GBP", symbol: "£", label: "British Pound", perRWF: 0.00056, decimals: 2 },
  { code: "AED", symbol: "AED", label: "UAE Dirham", perRWF: 0.00264, decimals: 2 },
  { code: "KES", symbol: "KSh", label: "Kenyan Shilling", perRWF: 0.093, decimals: 0 },
  { code: "UGX", symbol: "USh", label: "Ugandan Shilling", perRWF: 2.63, decimals: 0 },
  { code: "TZS", symbol: "TSh", label: "Tanzanian Shilling", perRWF: 1.87, decimals: 0 },
  { code: "ZAR", symbol: "R", label: "South African Rand", perRWF: 0.0131, decimals: 2 },
  { code: "NGN", symbol: "₦", label: "Nigerian Naira", perRWF: 1.09, decimals: 0 },
  { code: "GHS", symbol: "GH₵", label: "Ghanaian Cedi", perRWF: 0.0088, decimals: 2 },
  { code: "EGP", symbol: "E£", label: "Egyptian Pound", perRWF: 0.035, decimals: 2 },
  { code: "MAD", symbol: "MAD", label: "Moroccan Dirham", perRWF: 0.0071, decimals: 2 },
  { code: "XOF", symbol: "CFA", label: "West African CFA", perRWF: 0.43, decimals: 0 },
];

export function currencyByCode(code: string) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]!;
}

export function convertFromRWF(amountRWF: number, currency: Currency) {
  return amountRWF * currency.perRWF;
}

export function formatMoney(amountRWF: number, currency: Currency) {
  const value = convertFromRWF(amountRWF, currency);
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });
  return currency.code === "RWF" ? `RWF ${formatted}` : `${currency.symbol} ${formatted}`;
}
