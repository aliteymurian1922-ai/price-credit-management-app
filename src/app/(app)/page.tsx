import Link from "next/link";
import { db } from "@/db";
import { customers, products, sales } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import { formatMoney, formatDateTime, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getSummary() {
  const [productStats] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(products)
    .where(sql`${products.isActive} = true`);

  const [debtStats] = await db
    .select({
      totalDebt: sql<number>`coalesce(sum(case when ${customers.balance} > 0 then ${customers.balance} else 0 end), 0)`.mapWith(
        Number
      ),
      debtorCount: sql<number>`count(*) filter (where ${customers.balance} > 0)`.mapWith(Number),
      customerCount: sql<number>`count(*)`.mapWith(Number),
    })
    .from(customers);

  const [todayStats] = await db
    .select({
      total: sql<number>`coalesce(sum(${sales.totalAmount}), 0)`.mapWith(Number),
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(sales)
    .where(sql`${sales.createdAt} >= date_trunc('day', now())`);

  const recentSales = await db
    .select()
    .from(sales)
    .orderBy(desc(sales.createdAt))
    .limit(5);

  const topDebtors = await db
    .select()
    .from(customers)
    .where(sql`${customers.balance} > 0`)
    .orderBy(sql`${customers.balance} desc`)
    .limit(5);

  return { productStats, debtStats, todayStats, recentSales, topDebtors };
}

export default async function DashboardPage() {
  const { productStats, debtStats, todayStats, recentSales, topDebtors } = await getSummary();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-lg font-bold text-stone-800">داشبورد</h1>
        <p className="text-xs text-stone-500">خلاصه وضعیت فروشگاه</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
          <p className="text-xs text-stone-500">فروش امروز</p>
          <p className="mt-1 text-lg font-extrabold text-emerald-700">
            {formatMoney(todayStats?.total ?? 0)}
          </p>
          <p className="text-[11px] text-stone-400">{toFaDigits(todayStats?.count ?? 0)} فاکتور</p>
        </div>
        <Link
          href="/customers?filter=debtors"
          className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 active:scale-[0.98]"
        >
          <p className="text-xs text-stone-500">مجموع بدهی مشتریان</p>
          <p className="mt-1 text-lg font-extrabold text-rose-600">
            {formatMoney(debtStats?.totalDebt ?? 0)}
          </p>
          <p className="text-[11px] text-stone-400">
            {toFaDigits(debtStats?.debtorCount ?? 0)} مشتری بدهکار
          </p>
        </Link>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
          <p className="text-xs text-stone-500">تعداد کالاها</p>
          <p className="mt-1 text-lg font-extrabold text-stone-800">
            {toFaDigits(productStats?.count ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
          <p className="text-xs text-stone-500">تعداد مشتریان</p>
          <p className="mt-1 text-lg font-extrabold text-stone-800">
            {toFaDigits(debtStats?.customerCount ?? 0)}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/sales/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white active:scale-[0.98]"
        >
          ➕ ثبت فروش جدید
        </Link>
        <Link
          href="/products/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-stone-800 py-3 text-sm font-bold text-white active:scale-[0.98]"
        >
          🏷️ افزودن کالا
        </Link>
      </section>

      {topDebtors.length > 0 ? (
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-800">بیشترین بدهکاران</h2>
            <Link href="/customers?filter=debtors" className="text-xs text-emerald-700">
              مشاهده همه
            </Link>
          </div>
          <ul className="divide-y divide-stone-100">
            {topDebtors.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/customers/${c.id}`}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="font-medium text-stone-700">{c.name}</span>
                  <span className="font-bold text-rose-600">{formatMoney(c.balance)} تومان</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-800">آخرین فروش‌ها</h2>
          <Link href="/sales" className="text-xs text-emerald-700">
            مشاهده همه
          </Link>
        </div>
        {recentSales.length === 0 ? (
          <p className="py-4 text-center text-sm text-stone-400">هنوز فروشی ثبت نشده است</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {recentSales.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/sales/${s.id}`}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span>
                    <span className="block font-medium text-stone-700">
                      {s.customerNameSnapshot || "مشتری نقدی"}
                    </span>
                    <span className="block text-[11px] text-stone-400">
                      {formatDateTime(s.createdAt)}
                    </span>
                  </span>
                  <span className="font-bold text-stone-800">{formatMoney(s.totalAmount)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
