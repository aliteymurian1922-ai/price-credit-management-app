"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { CustomerFormState } from "./actions";

type CustomerFormProps = {
  action: (state: CustomerFormState, formData: FormData) => Promise<CustomerFormState>;
  initial?: {
    name: string;
    phone: string | null;
    address: string | null;
    note: string | null;
  };
  title: string;
  showInitialBalance?: boolean;
};

export default function CustomerForm({ action, initial, title, showInitialBalance }: CustomerFormProps) {
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
          <label className="mb-1.5 block text-sm font-medium text-stone-700">نام مشتری *</label>
          <input
            name="name"
            defaultValue={initial?.name}
            required
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="نام و نام خانوادگی"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">شماره تماس</label>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            defaultValue={initial?.phone ?? ""}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
            placeholder="09xxxxxxxxx"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">آدرس</label>
          <input
            name="address"
            defaultValue={initial?.address ?? ""}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
          />
        </div>

        {showInitialBalance ? (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              مانده اولیه حساب (اختیاری، تومان)
            </label>
            <input
              name="initialBalance"
              type="number"
              inputMode="decimal"
              defaultValue={0}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
              placeholder="در صورت وجود بدهی قبلی وارد کنید"
            />
          </div>
        ) : null}

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
          {isPending ? "در حال ذخیره..." : "ذخیره مشتری"}
        </button>
      </form>
    </div>
  );
}
