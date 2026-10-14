import Link from "next/link";
import { db } from "@/db";
import { customers, products, sales } from "@/db/schema";
import { sql, desc, eq } from "drizzle-orm";
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

  // Rule-based v0: a customer is inactive only when their last recorded sale
  // was more than 30 days ago. New customers without sales are not classified.
  const inactiveCustomers = await db
    .select({
      id: customers.id,
      name: customers.name,
      lastPurchaseAt: sql<Date>`max(${sales.createdAt})`,
    })
    .from(customers)
    .innerJoin(sales, eq(sales.customerId, customers.id))
    .groupBy(customers.id, customers.name)
    .having(sql`max(${sales.createdAt}) < now() - interval '30 days'`)
    .orderBy(sql`max(${sales.createdAt}) asc`)
    .limit(5);

  return { productStats, debtStats, todayStats, recentSales, topDebtors, inactiveCustomers };
}

export default async function DashboardPage() {
  const { productStats, debtStats, todayStats, recentSales, topDebtors, inactiveCustomers } = await getSummary();
  const debtFollowUps = topDebtors.slice(0, 2);
  const debtCustomerIds = new Set(debtFollowUps.map((customer) => customer.id));
  const returnFollowUps = inactiveCustomers
    .filter((customer) => !debtCustomerIds.has(customer.id))
    .slice(0, 1);
  const actionCount = debtFollowUps.length + returnFollowUps.length;

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

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <div className="mb-3">
          <h2 className="text-sm font-bold text-stone-800">اقدام‌های پیشنهادی نبض</h2>
          <p className="mt-1 text-xs text-stone-500">
            {toFaDigits(actionCount)} پیشنهاد بر اساس داده‌های واقعی ثبت‌شده، بدون پیش‌بینی ساختگی
          </p>
        </div>

        {actionCount === 0 ? (
          <p className="rounded-xl bg-stone-50 px-3 py-4 text-xs text-stone-500">
            هنوز داده کافی برای پیشنهاد اقدام وجود ندارد. با ثبت مشتری و فروش شروع کنید.
          </p>
        ) : (
          <div className="space-y-2">
            {debtFollowUps.map((customer) => (
              <Link
                key={`debt-${customer.id}`}
                href={`/customers/${customer.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-stone-800">پیگیری دریافت از {customer.name}</p>
                  <p className="mt-1 text-xs text-rose-700">
                    مانده بدهی ثبت‌شده: {formatMoney(customer.balance)} تومان
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-emerald-700">مشاهده حساب ←</span>
              </Link>
            ))}
            {returnFollowUps.map((customer) => (
              <Link
                key={`return-${customer.id}`}
                href={`/customers/${customer.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-stone-800">پیگیری خرید مجدد از {customer.name}</p>
                  <p className="mt-1 text-xs text-amber-800">
                    آخرین خرید ثبت‌شده: {formatDateTime(customer.lastPurchaseAt)}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-emerald-700">مشاهده مشتری ←</span>
              </Link>
            ))}
          </div>
        )}
        <p className="mt-3 text-[11px] leading-5 text-stone-400">
          بدهی‌ها صرفاً مانده حساب هستند؛ چون تاریخ سررسید ثبت نمی‌شود، نبض آن‌ها را معوق اعلام نمی‌کند.
          معیار مشتری غیرفعال: بیش از ۳۰ روز از آخرین فروش ثبت‌شده.
        </p>
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
