"use client";

import { useActionState, useState } from "react";
import { createStaffUserAction } from "./actions";

export default function NewUserForm() {
  const [state, formAction, isPending] = useActionState(createStaffUserAction, {});
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-stone-300 py-3 text-sm font-bold text-stone-500 active:scale-[0.98]"
      >
        + افزودن کاربر دوم
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-2xl bg-stone-50 p-3.5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">نام کامل</label>
        <input
          name="fullName"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-600"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">نام کاربری</label>
        <input
          name="username"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-600"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">رمز عبور</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-600"
        />
      </div>

      {state.error ? <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{state.error}</p> : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? "در حال ذخیره..." : "ذخیره کاربر"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl bg-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
