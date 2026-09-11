import { notFound } from "next/navigation";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import CustomerForm from "../../CustomerForm";
import { updateCustomerAction } from "../../actions";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isInteger(customerId)) notFound();

  const [customer] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
  if (!customer) notFound();

  const boundAction = updateCustomerAction.bind(null, customerId);

  return (
    <CustomerForm
      action={boundAction}
      title="ویرایش مشتری"
      initial={{
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        note: customer.note,
      }}
    />
  );
}
