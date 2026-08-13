import { createClient } from "@/lib/supabase/client";
import { mapPgError } from "@/lib/supabase/errors";
import type { Database } from "@/types/database";
import type { Category } from "@/data-access/categories";

const supabase = createClient();

export const categoriesApi = {
  async listAll(): Promise<Category[]> {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  async create(row: Database["public"]["Tables"]["categories"]["Insert"]): Promise<void> {
    const { error } = await supabase.from("categories").insert(row);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại."));
  },

  async update(id: string, row: Database["public"]["Tables"]["categories"]["Update"]): Promise<void> {
    const { error } = await supabase.from("categories").update(row).eq("id", id);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại."));
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase.from("categories").update({ is_active: isActive }).eq("id", id);
    if (error) throw new Error(error.message);
  },
};
