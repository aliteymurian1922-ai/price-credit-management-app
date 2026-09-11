import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { sales, saleItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatMoney, formatDateTime, formatNumber } from "@/lib/format";
import PrintButton from "./PrintButton";
import DeleteSaleButton from "./DeleteSaleButton";

export const dynamic = "force-dynamic";

const PAYMENT_LABELS: Record<string, string> = {
  cash: "نقدی",
  credit: "نسیه",
  mixed: "ترکیبی (بخشی نقد، بخشی نسیه)",
};

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const saleId = Number(id);
  if (!Number.isInteger(saleId)) notFound();

  const [sale] = await db.select().from(sales).where(eq(sales.id, saleId)).limit(1);
  if (!sale) notFound();

  const items = await db.select().from(saleItems).where(eq(saleItems.saleId, saleId));
  const remaining = Number(sale.totalAmount) - Number(sale.paidAmount);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <Link
            href="/sales"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm ring-1 ring-stone-100"
          >
            →
          </Link>
          <h1 className="text-lg font-bold text-stone-800">فاکتور #{formatNumber(sale.id)}</h1>
        </div>
        <div className="flex gap-1.5">
          <PrintButton />
          <DeleteSaleButton saleId={sale.id} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <div className="mb-3 text-center">
          <p className="text-lg font-extrabold text-emerald-800">🌿 فروشگاه میرملک</p>
          <p className="text-[11px] text-stone-400">فاکتور فروش مواد غذایی ارگانیک</p>
        </div>
        <div className="grid grid-cols-2 gap-2 border-y border-dashed border-stone-200 py-2 text-xs text-stone-500">
          <p>شماره فاکتور: {formatNumber(sale.id)}</p>
          <p className="text-left">{formatDateTime(sale.createdAt)}</p>
          <p>مشتری: {sale.customerNameSnapshot || "نقدی"}</p>
          <p className="text-left">صادر کننده: {sale.createdByName || "-"}</p>
        </div>

        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-right text-[11px] text-stone-400">
              <th className="pb-2 font-medium">کالا</th>
              <th className="pb-2 font-medium">تعداد</th>
              <th className="pb-2 font-medium">قیمت واحد</th>
              <th className="pb-2 text-left font-medium">جمع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 font-medium text-stone-700">{item.productName}</td>
                <td className="py-2 text-stone-600">
                  {formatNumber(item.quantity)} {item.unit}
                </td>
                <td className="py-2 text-stone-600">{formatMoney(item.unitPrice)}</td>
                <td className="py-2 text-left font-bold text-stone-800">{formatMoney(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 space-y-1.5 border-t border-dashed border-stone-200 pt-3 text-sm">
          <div className="flex justify-between text-stone-500">
            <span>تخفیف</span>
            <span>{formatMoney(sale.discount)} تومان</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-stone-900">
            <span>مبلغ کل فاکتور</span>
            <span>{formatMoney(sale.totalAmount)} تومان</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>مبلغ دریافتی</span>
            <span>{formatMoney(sale.paidAmount)} تومان</span>
          </div>
          {remaining !== 0 ? (
            <div className={`flex justify-between font-bold ${remaining > 0 ? "text-rose-600" : "text-emerald-700"}`}>
              <span>{remaining > 0 ? "مانده نسیه" : "بستانکاری مشتری"}</span>
              <span>{formatMoney(Math.abs(remaining))} تومان</span>
            </div>
          ) : null}
        </div>

        <p className="mt-3 inline-block rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-600">
          نوع پرداخت: {PAYMENT_LABELS[sale.paymentType] || sale.paymentType}
        </p>

        {sale.note ? <p className="mt-3 rounded-xl bg-stone-50 p-3 text-xs text-stone-500">{sale.note}</p> : null}
      </div>

      {sale.customerId ? (
        <Link
          href={`/customers/${sale.customerId}`}
          className="block rounded-2xl bg-stone-800 py-3 text-center text-sm font-bold text-white active:scale-[0.98] print:hidden"
        >
          مشاهده حساب مشتری
        </Link>
      ) : null}
    </div>
  );
}
