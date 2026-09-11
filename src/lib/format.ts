const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => faDigits[Number(d)]);
}

export function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? "0"));
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(value: unknown): string {
  const n = toNumber(value);
  const formatted = Math.round(n).toLocaleString("en-US");
  return toFaDigits(formatted);
}

export function formatNumber(value: unknown): string {
  const n = toNumber(value);
  const formatted = n % 1 === 0 ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { maximumFractionDigits: 3 });
  return toFaDigits(formatted);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return formatted;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  return formatted;
}
