"use server";

import { redirect } from "next/navigation";
import { findUserByUsername, verifyPassword, createSessionCookie } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "نام کاربری و رمز عبور را وارد کنید" };
  }

  const user = await findUserByUsername(username);
  if (!user) {
    return { error: "نام کاربری یا رمز عبور اشتباه است" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "نام کاربری یا رمز عبور اشتباه است" };
  }

  await createSessionCookie({
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
  });

  redirect("/");
}
