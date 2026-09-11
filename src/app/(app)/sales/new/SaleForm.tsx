"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSaleAction, type SaleItemInput } from "../actions";
import { formatMoney, formatNumber } from "@/lib/format";

type ProductOption = {
  id: number;
  name: string;
  unit: string;
  sellPrice: string;
};

type CustomerOption = {
  id: number;
  name: string;
  phone: string | null;
  balance: string;
};

type CartItem = SaleItemInput & { key: string };

export default function SaleForm({
  products,
  customers,
  initialCustomerId,
}: {
  products: ProductOption[];
  customers: CustomerOption[];
  initialCustomerId?: number | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [customerId, setCustomerId] = useState<number | null>(initialCustomerId ?? null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paidMode, setPaidMode] = useState<"full" | "none" | "custom">("full");
  const [customPaid, setCustomPaid] = useState<number>(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedCustomer = customers.find((c) => c.id === customerId) ?? null;

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers.slice(0, 8);
    return customers
      .filter((c) => c.name.includes(customerSearch) || (c.phone || "").includes(customerSearch))
      .slice(0, 8);
  }, [customers, customerSearch]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products.slice(0, 8);
    return products.filter((p) => p.name.includes(productSearch)).slice(0, 8);
  }, [products, productSearch]);

  const subtotal = cart.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const total = Math.max(0, subtotal - (discount || 0));
  const paidAmount = paidMode === "full" ? total : paidMode === "none" ? 0 : customPaid;
  const remaining = Math.round((total - paidAmount) * 100) / 100;

  function addProduct(p: ProductOption) {
    setCart((prev) => {
      const existing = prev.find((it) => it.productId === p.id);
      if (existing) {
        return prev.map((it) =>
          it.productId === p.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [
        ...prev,
        {
          key: `${p.id}-${Date.now()}`,
          productId: p.id,
          productName: p.name,
          unit: p.unit,
          quantity: 1,
          unitPrice: Number(p.sellPrice),
        },
      ];
    });
    setProductSearch("");
  }

  function updateItem(key: string, patch: Partial<CartItem>) {
    setCart((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }

  function removeItem(key: string) {
    setCart((prev) => prev.filter((it) => it.key !== key));
  }

  function handleSubmit() {
    setError(null);
    if (cart.length === 0) {
      setError("حداقل یک کالا به فاکتور اضافه کنید");
      return;
    }
    if (remaining > 0 && !customerId) {
      setError("برای فروش نسیه باید مشتری انتخاب شود");
      return;
    }

    startTransition(async () => {
      const result = await createSaleAction({
        customerId,
        paidAmount,
        discount,
        note,
        items: cart.map(({ key: _key, ...rest }) => rest),
      });

      if (!result.success) {
        setError(result.error || "ثبت فروش با خطا مواجه شد");
        return;
      }

      router.push(`/sales/${result.saleId}`);
    });
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm ring-1 ring-stone-100"
        >
          →
        </button>
        <h1 className="text-lg font-bold text-stone-800">ثبت فروش جدید</h1>
      </div>

      {/* Customer */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <h2 className="mb-2 text-sm font-bold text-stone-800">مشتری</h2>
        {selectedCustomer ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3">
            <div>
              <p className="text-sm font-bold text-emerald-800">{selectedCustomer.name}</p>
              <p className="text-[11px] text-emerald-600">
                مانده فعلی: {formatMoney(selectedCustomer.balance)} تومان
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCustomerId(null)}
              className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 shadow-sm"
            >
              تغییر
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="جستجوی مشتری یا انتخاب نکنید برای فروش نقدی"
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
            />
            {filteredCustomers.length > 0 ? (
              <ul className="max-h-48 space-y-1 overflow-y-auto">
                {filteredCustomers.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setCustomerId(c.id)}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm active:bg-stone-100"
                    >
                      <span className="text-stone-700">{c.name}</span>
                      <span className="text-xs text-stone-400">{c.phone}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-center text-xs text-stone-400">مشتری‌ای یافت نشد</p>
            )}
          </div>
        )}
      </section>

      {/* Product picker */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <h2 className="mb-2 text-sm font-bold text-stone-800">افزودن کالا</h2>
        <input
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          placeholder="جستجوی کالا..."
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
        />
        {filteredProducts.length > 0 ? (
          <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto">
            {filteredProducts.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => addProduct(p)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm active:bg-stone-100"
                >
                  <span className="text-stone-700">{p.name}</span>
                  <span className="text-xs font-medium text-emerald-700">
                    {formatMoney(p.sellPrice)} / {p.unit}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 py-2 text-center text-xs text-stone-400">کالایی یافت نشد</p>
        )}
      </section>

      {/* Cart */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <h2 className="mb-2 text-sm font-bold text-stone-800">اقلام فاکتور ({formatNumber(cart.length)})</h2>
        {cart.length === 0 ? (
          <p className="py-4 text-center text-sm text-stone-400">هنوز کالایی اضافه نشده</p>
        ) : (
          <ul className="space-y-2.5">
            {cart.map((item) => (
              <li key={item.key} className="rounded-xl bg-stone-50 p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-stone-800">{item.productName}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-xs text-red-500"
                  >
                    حذف
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-[10px] text-stone-400">تعداد ({item.unit})</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.key, { quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-sm outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-stone-400">قیمت واحد</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.key, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-sm outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-stone-400">جمع</label>
                    <p className="flex h-[38px] items-center justify-center rounded-lg bg-stone-100 text-sm font-bold text-stone-700">
                      {formatMoney(item.quantity * item.unitPrice)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Summary & payment */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <h2 className="mb-2 text-sm font-bold text-stone-800">جمع‌بندی و پرداخت</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-stone-500">جمع کل</span>
            <span className="font-medium text-stone-700">{formatMoney(subtotal)} تومان</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-stone-500">تخفیف</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className="w-32 rounded-lg border border-stone-300 bg-stone-50 px-2 py-1.5 text-left text-sm outline-none focus:border-emerald-600"
            />
          </div>
          <div className="flex items-center justify-between border-t border-stone-100 pt-2">
            <span className="font-bold text-stone-800">مبلغ قابل پرداخت</span>
            <span className="text-lg font-extrabold text-stone-900">{formatMoney(total)} تومان</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaidMode("full")}
            className={`rounded-xl py-2 text-xs font-bold ${
              paidMode === "full" ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-500"
            }`}
          >
            پرداخت نقدی کامل
          </button>
          <button
            type="button"
            onClick={() => setPaidMode("none")}
            className={`rounded-xl py-2 text-xs font-bold ${
              paidMode === "none" ? "bg-rose-600 text-white" : "bg-stone-100 text-stone-500"
            }`}
          >
            نسیه کامل
          </button>
        </div>

        <div className="mt-2">
          <label className="mb-1.5 block text-xs font-medium text-stone-500">
            مبلغ دریافتی (برای پرداخت جزئی مقدار را تغییر دهید)
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={paidMode === "custom" ? customPaid : paidAmount}
            onChange={(e) => {
              setPaidMode("custom");
              setCustomPaid(parseFloat(e.target.value) || 0);
            }}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
          />
        </div>

        {remaining !== 0 ? (
          <p className={`mt-2 rounded-xl px-3 py-2 text-sm font-bold ${remaining > 0 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
            {remaining > 0
              ? `مانده نسیه: ${formatMoney(remaining)} تومان به حساب مشتری اضافه می‌شود`
              : `مبلغ اضافه دریافتی: ${formatMoney(Math.abs(remaining))} تومان`}
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <label className="mb-1.5 block text-sm font-medium text-stone-700">توضیحات فاکتور</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
        />
      </section>

      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full rounded-xl bg-emerald-700 py-3.5 text-base font-bold text-white active:scale-[0.98] disabled:opacity-60"
      >
        {isPending ? "در حال ثبت فاکتور..." : `ثبت فروش · ${formatMoney(total)} تومان`}
      </button>
    </div>
  );
}
