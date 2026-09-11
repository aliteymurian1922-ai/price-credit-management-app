"use client";

import { useActionState, useState } from "react";
import type { LedgerFormState } from "../actions";

export default function LedgerForm({
  action,
}: {
  action: (state: LedgerFormState, formData: FormData) => Promise<LedgerFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [type, setType] = useState<"payment" | "debt">("payment");

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setType("payment")}
          className={`rounded-xl py-2.5 text-sm font-bold transition ${
            type === "payment" ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          💰 دریافت پرداخت
        </button>
        <button
          type="button"
          onClick={() => setType("debt")}
          className={`rounded-xl py-2.5 text-sm font-bold transition ${
            type === "debt" ? "bg-rose-600 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          📝 ثبت بدهی دستی
        </button>
      </div>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="type" value={type} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">مبلغ (تومان)</label>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            min={0}
            required
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
            placeholder="0"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">توضیحات (اختیاری)</label>
          <input
            name="description"
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
            placeholder={type === "payment" ? "مثال: پرداخت نقدی" : "مثال: خرید نسیه بدون فاکتور"}
          />
        </div>

        {state.error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className={`w-full rounded-xl py-3 text-base font-semibold text-white active:scale-[0.98] disabled:opacity-60 ${
            type === "payment" ? "bg-emerald-700" : "bg-rose-600"
          }`}
        >
          {isPending ? "در حال ثبت..." : type === "payment" ? "ثبت دریافت وجه" : "ثبت بدهی"}
        </button>
      </form>
    </div>
  );
}
