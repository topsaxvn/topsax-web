import { createClient } from "@/lib/supabase/client";
import { mapPgError } from "@/lib/supabase/errors";
import type { Database } from "@/types/database";
import type { Brand } from "@/data-access/brands";

const supabase = createClient();

export const brandsApi = {
  async listAll(): Promise<Brand[]> {
    const { data, error } = await supabase.from("brands").select("*").order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  async create(row: Database["public"]["Tables"]["brands"]["Insert"]): Promise<void> {
    const { error } = await supabase.from("brands").insert(row);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại."));
  },

  async update(id: string, row: Database["public"]["Tables"]["brands"]["Update"]): Promise<void> {
    const { error } = await supabase.from("brands").update(row).eq("id", id);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại."));
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase.from("brands").update({ is_active: isActive }).eq("id", id);
    if (error) throw new Error(error.message);
  },
};
