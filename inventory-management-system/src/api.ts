import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;

// ── Types ────────────────────────────────────────────────────
export interface Product {
  product_code: string;
  name: string;
  description?: string;
  weight?: number;
  price?: number;
  quantity: number;
  last_updated?: string;
}

export interface Order {
  order_id: string;
  type: "sale" | "purchase";
  customer_id?: string;
  supplier_id?: string;
  products: { product_code: string; quantity: number }[];
  status: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Batch {
  batch_number: string;
  raw_materials: { product_code: string; quantity: number }[];
  output: { product_code: string; quantity: number }[];
  status: string;
  notes?: string;
  start_date?: string;
  end_date?: string;
}

export interface Customer {
  customer_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Supplier {
  supplier_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

// ── Products ─────────────────────────────────────────────────
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw new Error(error.message);
    return data;
  },
  getOne: async (code: string): Promise<Product> => {
    const { data, error } = await supabase.from("products").select("*").eq("product_code", code).single();
    if (error) throw new Error(error.message);
    return data;
  },
  create: async (product: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase.from("products").insert(product).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  update: async (code: string, product: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase.from("products").update(product).eq("product_code", code).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  remove: async (code: string): Promise<void> => {
    const { error } = await supabase.from("products").delete().eq("product_code", code);
    if (error) throw new Error(error.message);
  },
};

// ── Orders ───────────────────────────────────────────────────
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  create: async (order: Partial<Order>): Promise<Order> => {
    const { data, error } = await supabase.from("orders").insert(order).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateStatus: async (id: string, status: string): Promise<void> => {
    const { error } = await supabase.from("orders").update({ status }).eq("order_id", id);
    if (error) throw new Error(error.message);
  },
  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from("orders").delete().eq("order_id", id);
    if (error) throw new Error(error.message);
  },
};

// ── Manufacturing ─────────────────────────────────────────────
export const manufacturingApi = {
  getAll: async (): Promise<Batch[]> => {
    const { data, error } = await supabase.from("manufacturing").select("*");
    if (error) throw new Error(error.message);
    return data;
  },
  create: async (batch: Partial<Batch>): Promise<Batch> => {
    const { data, error } = await supabase.from("manufacturing").insert(batch).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  complete: async (batch_number: string): Promise<void> => {
    const { error } = await supabase.from("manufacturing").update({ status: "completed" }).eq("batch_number", batch_number);
    if (error) throw new Error(error.message);
  },
  remove: async (batch_number: string): Promise<void> => {
    const { error } = await supabase.from("manufacturing").delete().eq("batch_number", batch_number);
    if (error) throw new Error(error.message);
  },
};

// ── Customers ────────────────────────────────────────────────
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const { data, error } = await supabase.from("customers").select("*");
    if (error) throw new Error(error.message);
    return data;
  },
  create: async (customer: Partial<Customer>): Promise<Customer> => {
    const { data, error } = await supabase.from("customers").insert(customer).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
};

// ── Suppliers ────────────────────────────────────────────────
export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const { data, error } = await supabase.from("suppliers").select("*");
    if (error) throw new Error(error.message);
    return data;
  },
  create: async (supplier: Partial<Supplier>): Promise<Supplier> => {
    const { data, error } = await supabase.from("suppliers").insert(supplier).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
};