import { db } from "@/db";
import { products, customers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import SaleForm from "./SaleForm";

export const dynamic = "force-dynamic";

export default async function NewSalePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;

  const [productRows, customerRows] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        unit: products.unit,
        sellPrice: products.sellPrice,
      })
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(asc(products.name)),
    db
      .select({
        id: customers.id,
        name: customers.name,
        phone: customers.phone,
        balance: customers.balance,
      })
      .from(customers)
      .orderBy(asc(customers.name)),
  ]);

  const parsedCustomerId = customerId ? Number(customerId) : null;

  return (
    <SaleForm
      products={productRows}
      customers={customerRows}
      initialCustomerId={Number.isInteger(parsedCustomerId) ? parsedCustomerId : null}
    />
  );
}
