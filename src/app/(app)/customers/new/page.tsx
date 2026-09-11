import CustomerForm from "../CustomerForm";
import { createCustomerAction } from "../actions";

export default function NewCustomerPage() {
  return <CustomerForm action={createCustomerAction} title="افزودن مشتری جدید" showInitialBalance />;
}
