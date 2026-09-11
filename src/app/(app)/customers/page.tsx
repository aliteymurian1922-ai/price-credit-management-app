import Link from "next/link";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { asc, desc, ilike, sql } from "drizzle-orm";
import { formatMoney, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const { q, filter } = await searchParams;
  const query = (q || "").trim();
  const debtorsOnly = filter === "debtors";

  const conditions = [];
  if (query) conditions.push(ilike(customers.name, `%${query}%`));
  if (debtorsOnly) conditions.push(sql`${customers.balance} > 0`);

  const whereClause = conditions.length
    ? conditions.reduce((acc, c) => sql`${acc} AND ${c}`)
    : undefined;

  const rows = await db
    .select()
    .from(customers)
    .where(whereClause)
    .orderBy(debtorsOnly ? desc(customers.balance) : asc(customers.name));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-stone-800">مشتریان</h1>
          <p className="text-xs text-stone-500">{formatNumber(rows.length)} مشتری</p>
        </div>
        <Link
          href="/customers/new"
          className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-bold text-white active:scale-95"
        >
          + مشتری جدید
        </Link>
      </div>

      <form action="/customers" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="جستجوی مشتری..."
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
        />
        <button className="rounded-xl bg-stone-800 px-4 text-sm font-medium text-white">جستجو</button>
      </form>

      <div className="flex gap-2 text-xs">
        <Link
          href="/customers"
          className={`rounded-full px-3 py-1.5 font-medium ${
            !debtorsOnly ? "bg-emerald-700 text-white" : "bg-white text-stone-500 ring-1 ring-stone-200"
          }`}
        >
          همه
        </Link>
        <Link
          href="/customers?filter=debtors"
          className={`rounded-full px-3 py-1.5 font-medium ${
            debtorsOnly ? "bg-rose-600 text-white" : "bg-white text-stone-500 ring-1 ring-stone-200"
          }`}
        >
          فقط بدهکاران
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-stone-400 shadow-sm ring-1 ring-stone-100">
          مشتری‌ای یافت نشد.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((c) => {
            const balance = Number(c.balance);
            return (
              <li key={c.id}>
                <Link
                  href={`/customers/${c.id}`}
                  className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-stone-100 active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-stone-800">{c.name}</p>
                    <p className="text-[11px] text-stone-400">{c.phone || "بدون شماره تماس"}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    {balance > 0 ? (
                      <p className="text-sm font-bold text-rose-600">{formatMoney(balance)}</p>
                    ) : balance < 0 ? (
                      <p className="text-sm font-bold text-emerald-700">{formatMoney(Math.abs(balance))} طلبکار</p>
                    ) : (
                      <p className="text-sm font-bold text-stone-400">تسویه</p>
                    )}
                    <p className="text-[10px] text-stone-400">تومان</p>
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
