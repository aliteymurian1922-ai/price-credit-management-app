"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession, hashPassword, verifyPassword } from "@/lib/auth";

export type SettingsFormState = { error?: string; success?: string };

const MAX_USERS = 2;

export async function changePasswordAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await requireSession();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || !newPassword) {
    return { error: "همه فیلدها را پر کنید" };
  }
  if (newPassword.length < 4) {
    return { error: "رمز عبور جدید باید حداقل ۴ کاراکتر باشد" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "تکرار رمز عبور مطابقت ندارد" };
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user) return { error: "کاربر یافت نشد" };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { error: "رمز عبور فعلی اشتباه است" };

  const newHash = await hashPassword(newPassword);
  await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, session.userId));

  return { success: "رمز عبور با موفقیت تغییر کرد" };
}

export async function createStaffUserAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireSession();

  const [{ value: userCount }] = await db.select({ value: count() }).from(users);
  if (userCount >= MAX_USERS) {
    return { error: "حداکثر تعداد کاربران (۲ کاربر) ثبت شده است" };
  }

  const username = String(formData.get("username") || "").trim().toLowerCase();
  const fullName = String(formData.get("fullName") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !fullName || !password) {
    return { error: "همه فیلدها را پر کنید" };
  }
  if (password.length < 4) {
    return { error: "رمز عبور باید حداقل ۴ کاراکتر باشد" };
  }

  const [existing] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (existing) {
    return { error: "این نام کاربری قبلا ثبت شده است" };
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({ username, fullName, passwordHash, role: "staff" });

  revalidatePath("/settings");
  redirect("/settings");
}

export async function deleteUserAction(id: number) {
  "use server";
  const session = await requireSession();
  if (session.userId === id) return;

  const [{ value: userCount }] = await db.select({ value: count() }).from(users);
  if (userCount <= 1) return;

  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/settings");
}

export async function resetUserPasswordAction(
  id: number,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireSession();
  const newPassword = String(formData.get("newPassword") || "");
  if (newPassword.length < 4) {
    return { error: "رمز عبور باید حداقل ۴ کاراکتر باشد" };
  }
  const newHash = await hashPassword(newPassword);
  await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, id));
  revalidatePath("/settings");
  return { success: "رمز عبور با موفقیت بازنشانی شد" };
}


