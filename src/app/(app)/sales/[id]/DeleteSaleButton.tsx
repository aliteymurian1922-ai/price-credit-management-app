"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSaleAction } from "../actions";

export default function DeleteSaleButton({ saleId }: { saleId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (window.confirm("آیا از حذف این فاکتور مطمئن هستید؟ در صورت نسیه بودن، مانده حساب مشتری اصلاح می‌شود.")) {
          startTransition(async () => {
            await deleteSaleAction(saleId);
            router.push("/sales");
          });
        }
      }}
      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 active:scale-95 disabled:opacity-50"
    >
      {isPending ? "..." : "حذف فاکتور"}
    </button>
  );
}
