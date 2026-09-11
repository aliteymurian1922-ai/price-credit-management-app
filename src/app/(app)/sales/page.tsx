import Link from "next/link";
import { db } from "@/db";
import { sales } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatMoney, formatDateTime, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAYMENT_LABELS: Record<string, { text: string; className: string }> = {
  cash: { text: "نقدی", className: "bg-emerald-50 text-emerald-700" },
  credit: { text: "نسیه", className: "bg-rose-50 text-rose-700" },
  mixed: { text: "ترکیبی", className: "bg-amber-50 text-amber-700" },
};

export default async function SalesPage() {
  const rows = await db.select().from(sales).orderBy(desc(sales.createdAt)).limit(100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-stone-800">فاکتورهای فروش</h1>
          <p className="text-xs text-stone-500">{formatNumber(rows.length)} فاکتور اخیر</p>
        </div>
        <Link
          href="/sales/new"
          className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-bold text-white active:scale-95"
        >
          + فروش جدید
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-stone-400 shadow-sm ring-1 ring-stone-100">
          هنوز فاکتوری ثبت نشده است.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((s) => {
            const badge = PAYMENT_LABELS[s.paymentType] || PAYMENT_LABELS.cash;
            return (
              <li key={s.id}>
                <Link
                  href={`/sales/${s.id}`}
                  className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-stone-100 active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-stone-800">
                      فاکتور #{formatNumber(s.id)} · {s.customerNameSnapshot || "مشتری نقدی"}
                    </p>
                    <p className="text-[11px] text-stone-400">{formatDateTime(s.createdAt)}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="text-sm font-bold text-stone-800">{formatMoney(s.totalAmount)}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.className}`}>
                      {badge.text}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
