"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";

export type ProductFormState = { error?: string };

function parseDecimal(value: FormDataEntryValue | null): string {
  const n = parseFloat(String(value ?? "0").replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return "0";
  return n.toString();
}

function readProductInput(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const unit = String(formData.get("unit") || "عدد").trim() || "عدد";
  const category = String(formData.get("category") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const buyPrice = parseDecimal(formData.get("buyPrice"));
  const sellPrice = parseDecimal(formData.get("sellPrice"));
  const stock = parseDecimal(formData.get("stock"));
  const trackStock = formData.get("trackStock") === "on";

  return { name, unit, category, note, buyPrice, sellPrice, stock, trackStock };
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireSession();
  const input = readProductInput(formData);

  if (!input.name) {
    return { error: "نام کالا الزامی است" };
  }

  await db.insert(products).values({
    name: input.name,
    unit: input.unit,
    category: input.category || null,
    note: input.note || null,
    buyPrice: input.buyPrice,
    sellPrice: input.sellPrice,
    stock: input.stock,
    trackStock: input.trackStock,
  });

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProductAction(
  id: number,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireSession();
  const input = readProductInput(formData);

  if (!input.name) {
    return { error: "نام کالا الزامی است" };
  }

  await db
    .update(products)
    .set({
      name: input.name,
      unit: input.unit,
      category: input.category || null,
      note: input.note || null,
      buyPrice: input.buyPrice,
      sellPrice: input.sellPrice,
      stock: input.stock,
      trackStock: input.trackStock,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/products");
  redirect("/products");
}

export async function deleteProductAction(id: number) {
  "use server";
  await requireSession();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/products");
}

export async function toggleProductActiveAction(id: number, isActive: boolean) {
  "use server";
  await requireSession();
  await db.update(products).set({ isActive, updatedAt: new Date() }).where(eq(products.id, id));
  revalidatePath("/products");
}
