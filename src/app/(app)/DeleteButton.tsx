"use client";

import { useTransition } from "react";

export default function DeleteButton({
  action,
  confirmText,
  label = "حذف",
  className,
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (window.confirm(confirmText)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className={
        className ??
        "rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 active:scale-95 disabled:opacity-50"
      }
    >
      {isPending ? "..." : label}
    </button>
  );
}
