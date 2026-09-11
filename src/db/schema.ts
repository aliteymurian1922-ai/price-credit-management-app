import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// ---------- کاربران (حداکثر ۲ کاربر: مدیر و همکار) ----------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("admin"), // admin | staff
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- کالاها / لیست قیمت خرید و فروش ----------
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  unit: text("unit").notNull().default("عدد"), // کیلوگرم، بسته، عدد، لیتر...
  category: text("category"),
  buyPrice: numeric("buy_price", { precision: 14, scale: 2 }).notNull().default("0"),
  sellPrice: numeric("sell_price", { precision: 14, scale: 2 }).notNull().default("0"),
  stock: numeric("stock", { precision: 14, scale: 3 }).notNull().default("0"),
  trackStock: boolean("track_stock").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- مشتریان ----------
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  note: text("note"),
  balance: numeric("balance", { precision: 14, scale: 2 }).notNull().default("0"), // مثبت = بدهکار به فروشگاه
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- فاکتور فروش ----------
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
  customerNameSnapshot: text("customer_name_snapshot"),
  paymentType: text("payment_type").notNull().default("cash"), // cash | credit | mixed
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  discount: numeric("discount", { precision: 14, scale: 2 }).notNull().default("0"),
  paidAmount: numeric("paid_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  note: text("note"),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
  createdByName: text("created_by_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- اقلام فاکتور فروش ----------
export const saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id")
    .notNull()
    .references(() => sales.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  unit: text("unit").notNull().default("عدد"),
  quantity: numeric("quantity", { precision: 14, scale: 3 }).notNull().default("0"),
  unitPrice: numeric("unit_price", { precision: 14, scale: 2 }).notNull().default("0"),
  totalPrice: numeric("total_price", { precision: 14, scale: 2 }).notNull().default("0"),
});

// ---------- گردش حساب مشتری (نسیه / پرداخت / اصلاحیه) ----------
export const customerLedger = pgTable("customer_ledger", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  saleId: integer("sale_id").references(() => sales.id, { onDelete: "set null" }),
  type: text("type").notNull(), // sale | payment | adjustment
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull().default("0"), // + بدهکار میکند، - پرداخت
  balanceAfter: numeric("balance_after", { precision: 14, scale: 2 }).notNull().default("0"),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
  createdByName: text("created_by_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
