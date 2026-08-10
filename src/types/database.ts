// Kiểu dữ liệu khớp với supabase/migrations/20260810173338_init_schema.sql.
// Viết tay để dùng ngay khi chưa link Supabase CLI. Sau khi migration đã
// chạy trên project thật, có thể thay bằng lệnh chính thức:
//   npx supabase gen types typescript --project-id <ref> > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProductCondition = "new" | "used" | "like_new" | "refurbished";
export type ProductStatus = "available" | "sold" | "hidden";
export type ProductInspectionStatus = "pending" | "in_progress" | "passed" | "failed";
export type PostStatus = "draft" | "published" | "archived";
export type ContactMessageStatus = "new" | "contacted" | "closed";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string | null;
          brand_id: string | null;
          model: string | null;
          sku: string | null;
          description: string | null;
          short_description: string | null;
          price: number;
          currency: string;
          condition: ProductCondition;
          status: ProductStatus;
          inspection_status: ProductInspectionStatus;
          featured: boolean;
          stock_quantity: number;
          serial_number: string | null;
          year: number | null;
          specifications: Json;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id?: string | null;
          brand_id?: string | null;
          model?: string | null;
          sku?: string | null;
          description?: string | null;
          short_description?: string | null;
          price: number;
          currency?: string;
          condition?: ProductCondition;
          status?: ProductStatus;
          inspection_status?: ProductInspectionStatus;
          featured?: boolean;
          stock_quantity?: number;
          serial_number?: string | null;
          year?: number | null;
          specifications?: Json;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_brand_id_fkey";
            columns: ["brand_id"];
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          public_id: string;
          alt_text: string | null;
          sort_order: number;
          is_thumbnail: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          public_id: string;
          alt_text?: string | null;
          sort_order?: number;
          is_thumbnail?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_categories"]["Insert"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          thumbnail_url: string | null;
          author_id: string | null;
          category_id: string | null;
          status: PostStatus;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string;
          thumbnail_url?: string | null;
          author_id?: string | null;
          category_id?: string | null;
          status?: PostStatus;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          message: string;
          product_id: string | null;
          status: ContactMessageStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          message: string;
          product_id?: string | null;
          status?: ContactMessageStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "contact_messages_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_condition: ProductCondition;
      product_status: ProductStatus;
      product_inspection_status: ProductInspectionStatus;
      post_status: PostStatus;
      contact_message_status: ContactMessageStatus;
    };
  };
}
