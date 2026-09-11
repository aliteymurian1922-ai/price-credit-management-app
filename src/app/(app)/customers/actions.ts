"use server";

import { db } from "@/db";
import { customers, customerLedger } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";

export type CustomerFormState = { error?: string };

function readCustomerInput(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const note = String(formData.get("note") || "").trim();
  return { name, phone, address, note };
}

export async function createCustomerAction(
  _prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  await requireSession();
  const input = readCustomerInput(formData);
  if (!input.name) return { error: "نام مشتری الزامی است" };

  const initialBalance = parseFloat(String(formData.get("initialBalance") || "0")) || 0;

  const [created] = await db
    .insert(customers)
    .values({
      name: input.name,
      phone: input.phone || null,
      address: input.address || null,
      note: input.note || null,
      balance: initialBalance.toString(),
    })
    .returning();

  if (initialBalance !== 0 && created) {
    const session = await requireSession();
    await db.insert(customerLedger).values({
      customerId: created.id,
      type: "adjustment",
      amount: initialBalance.toString(),
      balanceAfter: initialBalance.toString(),
      description: "مانده اولیه حساب",
      createdBy: session.userId,
      createdByName: session.fullName,
    });
  }

  revalidatePath("/customers");
  redirect("/customers");
}

export async function updateCustomerAction(
  id: number,
  _prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  await requireSession();
  const input = readCustomerInput(formData);
  if (!input.name) return { error: "نام مشتری الزامی است" };

  await db
    .update(customers)
    .set({
      name: input.name,
      phone: input.phone || null,
      address: input.address || null,
      note: input.note || null,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, id));

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}

export async function deleteCustomerAction(id: number) {
  "use server";
  await requireSession();
  await db.delete(customers).where(eq(customers.id, id));
  revalidatePath("/customers");
}

export type LedgerFormState = { error?: string };

export async function addLedgerEntryAction(
  customerId: number,
  _prevState: LedgerFormState,
  formData: FormData
): Promise<LedgerFormState> {
  const session = await requireSession();
  const type = String(formData.get("type") || "payment");
  const amountRaw = parseFloat(String(formData.get("amount") || "0").replace(/,/g, ""));
  const description = String(formData.get("description") || "").trim();

  if (!Number.isFinite(amountRaw) || amountRaw <= 0) {
    return { error: "مبلغ معتبر وارد کنید" };
  }

  const signedAmount = type === "payment" ? -Math.abs(amountRaw) : Math.abs(amountRaw);

  const [customer] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
  if (!customer) return { error: "مشتری یافت نشد" };

  const newBalance = Number(customer.balance) + signedAmount;

  await db.transaction(async (tx) => {
    await tx
      .update(customers)
      .set({ balance: newBalance.toString(), updatedAt: new Date() })
      .where(eq(customers.id, customerId));

    await tx.insert(customerLedger).values({
      customerId,
      type: type === "payment" ? "payment" : "adjustment",
      amount: signedAmount.toString(),
      balanceAfter: newBalance.toString(),
      description:
        description || (type === "payment" ? "دریافت پرداخت نقدی" : "ثبت بدهی دستی"),
      createdBy: session.userId,
      createdByName: session.fullName,
    });
  });

  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/customers");
  redirect(`/customers/${customerId}`);
}
