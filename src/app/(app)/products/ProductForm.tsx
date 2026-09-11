"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { ProductFormState } from "./actions";

const UNITS = ["کیلوگرم", "گرم", "عدد", "بسته", "لیتر", "میلی‌لیتر", "کارتن"];

type ProductFormProps = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  initial?: {
    name: string;
    unit: string;
    category: string | null;
    note: string | null;
    buyPrice: string;
    sellPrice: string;
    stock: string;
    trackStock: boolean;
  };
  title: string;
};

export default function ProductForm({ action, initial, title }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm ring-1 ring-stone-100"
        >
          →
        </button>
        <h1 className="text-lg font-bold text-stone-800">{title}</h1>
      </div>

      <form action={formAction} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">نام کالا *</label>
          <input
            name="name"
            defaultValue={initial?.name}
            required
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="مثال: برنج طارم ارگانیک"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">واحد</label>
            <select
              name="unit"
              defaultValue={initial?.unit ?? "کیلوگرم"}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">دسته‌بندی</label>
            <input
              name="category"
              defaultValue={initial?.category ?? ""}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
              placeholder="مثال: غلات"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">قیمت خرید (تومان)</label>
            <input
              name="buyPrice"
              type="number"
              inputMode="decimal"
              min={0}
              defaultValue={initial?.buyPrice ?? "0"}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">قیمت فروش (تومان)</label>
            <input
              name="sellPrice"
              type="number"
              inputMode="decimal"
              min={0}
              defaultValue={initial?.sellPrice ?? "0"}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
          <input
            id="trackStock"
            name="trackStock"
            type="checkbox"
            defaultChecked={initial?.trackStock ?? false}
            className="h-5 w-5 accent-emerald-700"
          />
          <label htmlFor="trackStock" className="text-sm text-stone-700">
            مدیریت موجودی انبار برای این کالا
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">موجودی فعلی</label>
          <input
            name="stock"
            type="number"
            inputMode="decimal"
            min={0}
            defaultValue={initial?.stock ?? "0"}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">یادداشت</label>
          <textarea
            name="note"
            defaultValue={initial?.note ?? ""}
            rows={2}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
          />
        </div>

        {state.error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-emerald-700 py-3 text-base font-semibold text-white active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? "در حال ذخیره..." : "ذخیره کالا"}
        </button>
      </form>
    </div>
  );
}
