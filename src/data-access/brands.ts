import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Brand = Database["public"]["Tables"]["brands"]["Row"];

export async function getAllBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("brands").select("*").order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getActiveBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}
