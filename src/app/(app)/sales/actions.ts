"use server";

import { db } from "@/db";
import { sales, saleItems, customers, customerLedger, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";

export type SaleItemInput = {
  productId: number | null;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
};

export type CreateSalePayload = {
  customerId: number | null;
  paidAmount: number;
  discount: number;
  note?: string;
  items: SaleItemInput[];
};

export type CreateSaleResult = { success: boolean; error?: string; saleId?: number };

export async function createSaleAction(payload: CreateSalePayload): Promise<CreateSaleResult> {
  const session = await requireSession();

  const items = (payload.items || []).filter(
    (it) => it.productName?.trim() && it.quantity > 0 && it.unitPrice >= 0
  );

  if (items.length === 0) {
    return { success: false, error: "حداقل یک کالا باید در فاکتور باشد" };
  }

  const discount = Math.max(0, Number(payload.discount) || 0);
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const totalAmount = Math.max(0, subtotal - discount);
  const paidAmount = Math.max(0, Number(payload.paidAmount) || 0);
  const remaining = Math.round((totalAmount - paidAmount) * 100) / 100;

  if (remaining > 0 && !payload.customerId) {
    return { success: false, error: "برای ثبت فروش نسیه باید یک مشتری انتخاب شود" };
  }

  let paymentType: string = "cash";
  if (paidAmount <= 0 && remaining > 0) paymentType = "credit";
  else if (remaining > 0) paymentType = "mixed";

  let customerName: string | null = null;
  if (payload.customerId) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, payload.customerId))
      .limit(1);
    if (!customer) return { success: false, error: "مشتری انتخاب‌شده یافت نشد" };
    customerName = customer.name;
  }

  let saleId: number | undefined;

  await db.transaction(async (tx) => {
    const [createdSale] = await tx
      .insert(sales)
      .values({
        customerId: payload.customerId,
        customerNameSnapshot: customerName,
        paymentType,
        totalAmount: totalAmount.toString(),
        discount: discount.toString(),
        paidAmount: paidAmount.toString(),
        note: payload.note?.trim() || null,
        createdBy: session.userId,
        createdByName: session.fullName,
      })
      .returning();

    saleId = createdSale.id;

    for (const item of items) {
      const totalPrice = Math.round(item.quantity * item.unitPrice * 100) / 100;
      await tx.insert(saleItems).values({
        saleId: createdSale.id,
        productId: item.productId,
        productName: item.productName,
        unit: item.unit,
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        totalPrice: totalPrice.toString(),
      });

      if (item.productId) {
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);
        if (product?.trackStock) {
          const newStock = Number(product.stock) - item.quantity;
          await tx
            .update(products)
            .set({ stock: newStock.toString(), updatedAt: new Date() })
            .where(eq(products.id, item.productId));
        }
      }
    }

    if (payload.customerId && remaining !== 0) {
      const [customer] = await tx
        .select()
        .from(customers)
        .where(eq(customers.id, payload.customerId))
        .limit(1);

      if (customer) {
        const newBalance = Number(customer.balance) + remaining;
        await tx
          .update(customers)
          .set({ balance: newBalance.toString(), updatedAt: new Date() })
          .where(eq(customers.id, payload.customerId));

        await tx.insert(customerLedger).values({
          customerId: payload.customerId,
          saleId: createdSale.id,
          type: "sale",
          amount: remaining.toString(),
          balanceAfter: newBalance.toString(),
          description: `فروش نسیه - فاکتور شماره ${createdSale.id}`,
          createdBy: session.userId,
          createdByName: session.fullName,
        });
      }
    }
  });

  revalidatePath("/");
  revalidatePath("/sales");
  revalidatePath("/customers");
  if (payload.customerId) revalidatePath(`/customers/${payload.customerId}`);
  if (payload.items.some((it) => it.productId)) revalidatePath("/products");

  return { success: true, saleId };
}

export async function deleteSaleAction(id: number) {
  "use server";
  await requireSession();

  await db.transaction(async (tx) => {
    const [sale] = await tx.select().from(sales).where(eq(sales.id, id)).limit(1);
    if (!sale) return;

    if (sale.customerId) {
      const remaining = Number(sale.totalAmount) - Number(sale.paidAmount);
      if (remaining !== 0) {
        const [customer] = await tx
          .select()
          .from(customers)
          .where(eq(customers.id, sale.customerId))
          .limit(1);
        if (customer) {
          const newBalance = Number(customer.balance) - remaining;
          await tx
            .update(customers)
            .set({ balance: newBalance.toString(), updatedAt: new Date() })
            .where(eq(customers.id, sale.customerId));

          await tx.insert(customerLedger).values({
            customerId: sale.customerId,
            saleId: sale.id,
            type: "adjustment",
            amount: (-remaining).toString(),
            balanceAfter: newBalance.toString(),
            description: `اصلاح به دلیل حذف فاکتور شماره ${sale.id}`,
          });
        }
      }
    }

    await tx.delete(sales).where(eq(sales.id, id));
  });

  revalidatePath("/");
  revalidatePath("/sales");
  revalidatePath("/customers");
}
