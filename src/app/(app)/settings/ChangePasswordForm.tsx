"use client";

import { useActionState } from "react";
import { changePasswordAction } from "./actions";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">رمز عبور فعلی</label>
        <input
          name="currentPassword"
          type="password"
          required
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">رمز عبور جدید</label>
        <input
          name="newPassword"
          type="password"
          required
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">تکرار رمز عبور جدید</label>
        <input
          name="confirmPassword"
          type="password"
          required
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
        />
      </div>

      {state.error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p> : null}
      {state.success ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.success}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-stone-800 py-2.5 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-60"
      >
        {isPending ? "در حال ذخیره..." : "تغییر رمز عبور"}
      </button>
    </form>
  );
}
