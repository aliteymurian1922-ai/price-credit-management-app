import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { and, asc, ilike, or } from "drizzle-orm";
import { formatMoney, formatNumber } from "@/lib/format";
import { deleteProductAction, toggleProductActiveAction } from "./actions";
import DeleteButton from "../DeleteButton";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const rows = await db
    .select()
    .from(products)
    .where(
      query
        ? or(ilike(products.name, `%${query}%`), ilike(products.category, `%${query}%`))
        : undefined
    )
    .orderBy(asc(products.name));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-stone-800">لیست قیمت کالاها</h1>
          <p className="text-xs text-stone-500">{formatNumber(rows.length)} کالا</p>
        </div>
        <Link
          href="/products/new"
          className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-bold text-white active:scale-95"
        >
          + کالای جدید
        </Link>
      </div>

      <form action="/products" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="جستجوی کالا یا دسته‌بندی..."
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
        />
        <button className="rounded-xl bg-stone-800 px-4 text-sm font-medium text-white">جستجو</button>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-stone-400 shadow-sm ring-1 ring-stone-100">
          کالایی یافت نشد. یک کالای جدید اضافه کنید.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((p) => {
            const margin = Number(p.sellPrice) - Number(p.buyPrice);
            return (
              <li
                key={p.id}
                className={`rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-stone-100 ${
                  !p.isActive ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-stone-800">{p.name}</p>
                    <p className="text-[11px] text-stone-400">
                      {p.category ? `${p.category} · ` : ""}
                      واحد: {p.unit}
                      {p.trackStock ? ` · موجودی: ${formatNumber(p.stock)}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Link
                      href={`/products/${p.id}/edit`}
                      className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-700 active:scale-95"
                    >
                      ویرایش
                    </Link>
                    <DeleteButton
                      action={deleteProductAction.bind(null, p.id)}
                      confirmText={`آیا از حذف «${p.name}» مطمئن هستید؟`}
                    />
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs">
                  <span className="text-stone-500">
                    خرید: <span className="font-bold text-stone-700">{formatMoney(p.buyPrice)}</span>
                  </span>
                  <span className="text-stone-500">
                    فروش: <span className="font-bold text-emerald-700">{formatMoney(p.sellPrice)}</span>
                  </span>
                  <span className={`text-stone-500 ${margin < 0 ? "text-rose-600" : ""}`}>
                    سود: <span className="font-bold">{formatMoney(margin)}</span>
                  </span>
                </div>
                <form
                  action={toggleProductActiveAction.bind(null, p.id, !p.isActive)}
                  className="mt-2 text-left"
                >
                  <button className="text-[11px] text-stone-400 underline underline-offset-2">
                    {p.isActive ? "غیرفعال کردن" : "فعال کردن"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
