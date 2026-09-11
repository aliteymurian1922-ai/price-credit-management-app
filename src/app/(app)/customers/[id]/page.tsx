import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { customers, customerLedger } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatMoney, formatDateTime } from "@/lib/format";
import { addLedgerEntryAction, deleteCustomerAction } from "../actions";
import LedgerForm from "./LedgerForm";
import DeleteButton from "../../DeleteButton";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isInteger(customerId)) notFound();

  const [customer] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
  if (!customer) notFound();

  const ledger = await db
    .select()
    .from(customerLedger)
    .where(eq(customerLedger.customerId, customerId))
    .orderBy(desc(customerLedger.createdAt))
    .limit(50);

  const balance = Number(customer.balance);
  const boundLedgerAction = addLedgerEntryAction.bind(null, customerId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href="/customers"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm ring-1 ring-stone-100"
        >
          →
        </Link>
        <h1 className="truncate text-lg font-bold text-stone-800">{customer.name}</h1>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">مانده حساب</p>
            {balance > 0 ? (
              <p className="text-2xl font-extrabold text-rose-600">{formatMoney(balance)}</p>
            ) : balance < 0 ? (
              <p className="text-2xl font-extrabold text-emerald-700">{formatMoney(Math.abs(balance))}</p>
            ) : (
              <p className="text-2xl font-extrabold text-stone-400">۰</p>
            )}
            <p className="text-[11px] text-stone-400">
              {balance > 0 ? "بدهکار به فروشگاه" : balance < 0 ? "طلبکار از فروشگاه" : "تسویه شده"}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Link
              href={`/customers/${customer.id}/edit`}
              className="rounded-lg bg-stone-100 px-3 py-1.5 text-center text-xs font-medium text-stone-700 active:scale-95"
            >
              ویرایش اطلاعات
            </Link>
            <DeleteButton
              action={deleteCustomerAction.bind(null, customer.id)}
              confirmText={`آیا از حذف «${customer.name}» و کل تاریخچه حساب او مطمئن هستید؟`}
            />
          </div>
        </div>
        {(customer.phone || customer.address) && (
          <div className="mt-3 border-t border-stone-100 pt-3 text-xs text-stone-500">
            {customer.phone ? <p>📞 {customer.phone}</p> : null}
            {customer.address ? <p className="mt-1">📍 {customer.address}</p> : null}
          </div>
        )}
      </div>

      <Link
        href={`/sales/new?customerId=${customer.id}`}
        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white active:scale-[0.98]"
      >
        ➕ ثبت فروش برای این مشتری
      </Link>

      <LedgerForm action={boundLedgerAction} />

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <h2 className="mb-2 text-sm font-bold text-stone-800">تاریخچه حساب</h2>
        {ledger.length === 0 ? (
          <p className="py-4 text-center text-sm text-stone-400">تراکنشی ثبت نشده است</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {ledger.map((entry) => {
              const amount = Number(entry.amount);
              return (
                <li key={entry.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-700">
                        {entry.type === "sale"
                          ? "فروش نسیه"
                          : entry.type === "payment"
                          ? "دریافت وجه"
                          : "اصلاح حساب"}
                        {entry.description ? ` · ${entry.description}` : ""}
                      </p>
                      <p className="text-[11px] text-stone-400">{formatDateTime(entry.createdAt)}</p>
                    </div>
                    <p
                      className={`shrink-0 text-sm font-bold ${
                        amount > 0 ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {amount > 0 ? "+" : "-"}
                      {formatMoney(Math.abs(amount))}
                    </p>
                  </div>
                  {entry.saleId ? (
                    <Link
                      href={`/sales/${entry.saleId}`}
                      className="mt-0.5 inline-block text-[11px] text-emerald-700 underline"
                    >
                      مشاهده فاکتور
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
