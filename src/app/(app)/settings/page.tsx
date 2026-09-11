import { db } from "@/db";
import { users } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";
import NewUserForm from "./NewUserForm";
import ResetPasswordInline from "./ResetPasswordInline";
import DeleteButton from "../DeleteButton";
import { deleteUserAction, resetUserPasswordAction } from "./actions";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const allUsers = await db.select().from(users).orderBy(asc(users.id));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-stone-800">تنظیمات</h1>
        <p className="text-xs text-stone-500">مدیریت کاربران و حساب کاربری</p>
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <h2 className="mb-1 text-sm font-bold text-stone-800">حساب کاربری من</h2>
        <p className="mb-3 text-xs text-stone-500">
          {session.fullName} · نام کاربری: {session.username}
        </p>
        <ChangePasswordForm />
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <h2 className="mb-3 text-sm font-bold text-stone-800">کاربران سیستم ({allUsers.length} از ۲)</h2>
        <ul className="space-y-2">
          {allUsers.map((u) => (
            <li key={u.id} className="rounded-xl bg-stone-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    {u.fullName} {u.id === session.userId ? "(شما)" : ""}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    @{u.username} · {u.role === "admin" ? "مدیر" : "همکار"} · عضویت از {formatDate(u.createdAt)}
                  </p>
                </div>
                {u.id !== session.userId ? (
                  <DeleteButton
                    action={deleteUserAction.bind(null, u.id)}
                    confirmText={`آیا از حذف کاربر «${u.fullName}» مطمئن هستید؟`}
                  />
                ) : null}
              </div>
              {u.id !== session.userId ? (
                <ResetPasswordInline action={resetUserPasswordAction.bind(null, u.id)} />
              ) : null}
            </li>
          ))}
        </ul>

        {allUsers.length < 2 ? (
          <div className="mt-3">
            <NewUserForm />
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-stone-100">
        <p className="text-xs text-stone-400">نرم‌افزار مدیریت فروشگاه میرملک · نسخه ۱.۰</p>
      </section>
    </div>
  );
}
