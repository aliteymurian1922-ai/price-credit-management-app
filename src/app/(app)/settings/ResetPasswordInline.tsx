"use client";

import { useActionState, useState } from "react";
import type { SettingsFormState } from "./actions";

export default function ResetPasswordInline({
  action,
}: {
  action: (state: SettingsFormState, formData: FormData) => Promise<SettingsFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-600 active:scale-95"
      >
        تغییر رمز
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-2 flex w-full items-center gap-2">
      <input
        name="newPassword"
        type="password"
        placeholder="رمز عبور جدید"
        required
        className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 rounded-lg bg-emerald-700 px-2.5 py-1.5 text-xs font-bold text-white"
      >
        {isPending ? "..." : "ثبت"}
      </button>
      {state.error ? <span className="text-[10px] text-red-600">{state.error}</span> : null}
      {state.success ? <span className="text-[10px] text-emerald-600">{state.success}</span> : null}
    </form>
  );
}
