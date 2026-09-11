import ProductForm from "../ProductForm";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return <ProductForm action={createProductAction} title="افزودن کالای جدید" />;
}
