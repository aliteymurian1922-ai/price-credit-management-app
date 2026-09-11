import { notFound } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProductForm from "../../ProductForm";
import { updateProductAction } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, productId);

  return (
    <ProductForm
      action={boundAction}
      title="ویرایش کالا"
      initial={{
        name: product.name,
        unit: product.unit,
        category: product.category,
        note: product.note,
        buyPrice: product.buyPrice,
        sellPrice: product.sellPrice,
        stock: product.stock,
        trackStock: product.trackStock,
      }}
    />
  );
}
