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
export type SongKeyMode = "major" | "minor";
export type CourseStatus = "draft" | "published";
/** notes = luyện nốt, song = bài hát, bonus = bài thêm */
export type CourseItemKind = "notes" | "song" | "bonus";
export type CourseOrderStatus = "pending" | "paid" | "cancelled";
export type BankPaymentResult = "matched" | "no_code" | "no_order" | "already_paid" | "amount_low" | "no_amount";

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
      // Bảng "songs" thuộc project cảm âm (virtual-piano) dùng chung Supabase
      // project với TOPSAX. TOPSAX chỉ đọc (không tạo/sửa) các bài đã published.
      songs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          singer: string;
          description: string | null;
          lines: Json;
          scale_root: number;
          scale_type: string;
          instrument: string;
          naming: string;
          song_key: number;
          song_key_mode: SongKeyMode;
          published: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug?: string;
          title?: string;
          singer?: string;
          description?: string | null;
          lines?: Json;
          scale_root?: number;
          scale_type?: string;
          instrument?: string;
          naming?: string;
          song_key?: number;
          song_key_mode?: SongKeyMode;
          published?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["songs"]["Insert"]>;
        Relationships: [];
      };
      // Từ đây: supabase/migrations/20261110000000_admin_role_and_course.sql
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string;
          description: string;
          price: number;
          total_days: number;
          status: CourseStatus;
          pay_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string;
          description?: string;
          price?: number;
          total_days?: number;
          status?: CourseStatus;
          pay_code?: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      course_lessons: {
        Row: {
          id: string;
          course_id: string;
          day: number;
          title: string;
          note: string;
          is_free: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          day: number;
          title?: string;
          note?: string;
          is_free?: boolean;
          is_published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["course_lessons"]["Insert"]>;
        Relationships: [];
      };
      course_enrollments: {
        Row: { course_id: string; user_id: string; note: string; created_by: string | null; created_at: string };
        Insert: { course_id: string; user_id: string; note?: string; created_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["course_enrollments"]["Insert"]>;
        Relationships: [];
      };
      // supabase/migrations/20261114000000_course_products.sql
      course_products: {
        Row: { course_id: string; product_id: string; position: number; created_at: string };
        Insert: { course_id: string; product_id: string; position?: number };
        Update: Partial<Database["public"]["Tables"]["course_products"]["Insert"]>;
        Relationships: [];
      };
      // Từ đây: supabase/migrations/20261111000000_course_day_items.sql
      course_items: {
        Row: {
          id: string;
          lesson_id: string;
          kind: CourseItemKind;
          position: number;
          title: string;
          subtitle: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          kind: CourseItemKind;
          position?: number;
          title?: string;
          subtitle?: string;
        };
        Update: Partial<Database["public"]["Tables"]["course_items"]["Insert"]>;
        Relationships: [];
      };
      course_item_content: {
        Row: { item_id: string; score: Json; file_name: string; video_url: string; updated_at: string };
        Insert: { item_id: string; score: Json; file_name?: string; video_url?: string };
        Update: Partial<Database["public"]["Tables"]["course_item_content"]["Insert"]>;
        Relationships: [];
      };
      course_lesson_guides: {
        Row: { lesson_id: string; guide: string; updated_at: string };
        Insert: { lesson_id: string; guide?: string };
        Update: Partial<Database["public"]["Tables"]["course_lesson_guides"]["Insert"]>;
        Relationships: [];
      };
      course_item_progress: {
        Row: {
          user_id: string;
          item_id: string;
          best_score: number;
          stars: number;
          attempts: number;
          updated_at: string;
        };
        Insert: { user_id?: string; item_id: string; best_score: number; stars: number; attempts?: number };
        Update: Partial<Database["public"]["Tables"]["course_item_progress"]["Insert"]>;
        Relationships: [];
      };
      // Từ đây: supabase/migrations/20261112000000_course_orders.sql
      course_orders: {
        Row: {
          id: string;
          code: string;
          course_id: string;
          user_id: string;
          buyer_name: string;
          amount: number;
          transfer_note: string;
          status: CourseOrderStatus;
          paid_at: string | null;
          paid_by: string;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: { status?: CourseOrderStatus };
        Relationships: [];
      };
      bank_payments: {
        Row: {
          id: number;
          received_at: string;
          raw: string;
          amount: number | null;
          codes: string[];
          order_id: string | null;
          result: BankPaymentResult;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      has_course_access: { Args: { p_course: string }; Returns: boolean };
      can_open_lesson: { Args: { p_lesson: string }; Returns: boolean };
      admin_grant_course: { Args: { p_course: string; p_email: string; p_note?: string }; Returns: string };
      admin_course_students: {
        Args: { p_course: string };
        Returns: {
          user_id: string;
          email: string;
          note: string;
          granted_at: string;
          lessons_done: number;
          last_activity: string | null;
        }[];
      };
      create_course_order: { Args: { p_course: string }; Returns: Database["public"]["Tables"]["course_orders"]["Row"] };
      record_bank_payment: {
        Args: { p_secret: string; p_raw: string; p_amount: number | null; p_codes: string[] };
        Returns: { result: BankPaymentResult; order: string | null };
      };
      admin_rotate_bank_secret: { Args: Record<string, never>; Returns: string };
      admin_bank_secret_created_at: { Args: Record<string, never>; Returns: string | null };
      admin_confirm_order: { Args: { p_order: string }; Returns: undefined };
      admin_course_orders: {
        Args: { p_course: string };
        Returns: {
          id: string;
          code: string;
          email: string;
          buyer_name: string;
          amount: number;
          transfer_note: string;
          status: CourseOrderStatus;
          paid_by: string;
          created_at: string;
          paid_at: string | null;
        }[];
      };
    };
    Enums: {
      product_condition: ProductCondition;
      product_status: ProductStatus;
      product_inspection_status: ProductInspectionStatus;
      post_status: PostStatus;
      contact_message_status: ContactMessageStatus;
      song_key_mode: SongKeyMode;
      course_status: CourseStatus;
    };
  };
}
