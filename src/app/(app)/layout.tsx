import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import BottomNav from "./BottomNav";
import { logoutAction } from "./logout-action";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-stone-50">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-emerald-800 px-4 py-3 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <div>
            <p className="text-sm font-bold leading-tight">فروشگاه میرملک</p>
            <p className="text-[11px] leading-tight text-emerald-200">مواد غذایی ارگانیک</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-100">{session.fullName}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg bg-emerald-900/60 px-2.5 py-1.5 text-xs font-medium text-emerald-50 active:scale-95"
            >
              خروج
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

      <BottomNav />
    </div>
  );
}
