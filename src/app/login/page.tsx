"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-4xl backdrop-blur">
            🌿
          </div>
          <h1 className="text-2xl font-bold tracking-tight">فروشگاه میرملک</h1>
          <p className="mt-1 text-sm text-emerald-100">مدیریت قیمت‌ها و حساب مشتریان</p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">نام کاربری</label>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="نام کاربری"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">رمز عبور</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="رمز عبور"
            />
          </div>

          {state.error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-emerald-700 py-3 text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? "در حال ورود..." : "ورود"}
          </button>

          <p className="pt-2 text-center text-xs text-stone-400">
            نام کاربری پیش‌فرض: admin — رمز: admin123
          </p>
        </form>
      </div>
    </main>
  );
}
