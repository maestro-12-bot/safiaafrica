export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artisan_products: {
        Row: {
          artisan_id: string | null
          created_at: string | null
          description: string | null
          design_style: string | null
          dimensions: string | null
          featured: boolean | null
          frame_type: string | null
          id: string
          images: string[] | null
          inventory: number | null
          likes: number | null
          materials: string | null
          name: string
          price: number | null
          status: string | null
          views: number | null
        }
        Insert: {
          artisan_id?: string | null
          created_at?: string | null
          description?: string | null
          design_style?: string | null
          dimensions?: string | null
          featured?: boolean | null
          frame_type?: string | null
          id?: string
          images?: string[] | null
          inventory?: number | null
          likes?: number | null
          materials?: string | null
          name: string
          price?: number | null
          status?: string | null
          views?: number | null
        }
        Update: {
          artisan_id?: string | null
          created_at?: string | null
          description?: string | null
          design_style?: string | null
          dimensions?: string | null
          featured?: boolean | null
          frame_type?: string | null
          id?: string
          images?: string[] | null
          inventory?: number | null
          likes?: number | null
          materials?: string | null
          name?: string
          price?: number | null
          status?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artisan_products_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
        ]
      }
      artisans: {
        Row: {
          auth_user_id: string | null
          bio: string | null
          created_at: string | null
          email: string
          featured: boolean | null
          full_name: string
          id: string
          location: string | null
          password_hash: string | null
          phone: string | null
          photo_url: string | null
          provider: string | null
          skills: string[] | null
          social_links: Json | null
          status: string | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          auth_user_id?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          featured?: boolean | null
          full_name: string
          id?: string
          location?: string | null
          password_hash?: string | null
          phone?: string | null
          photo_url?: string | null
          provider?: string | null
          skills?: string[] | null
          social_links?: Json | null
          status?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          auth_user_id?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          featured?: boolean | null
          full_name?: string
          id?: string
          location?: string | null
          password_hash?: string | null
          phone?: string | null
          photo_url?: string | null
          provider?: string | null
          skills?: string[] | null
          social_links?: Json | null
          status?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          artisan_id: string | null
          artisan_share: number | null
          created_at: string | null
          gross: number | null
          id: string
          order_number: string | null
          platform_share: number | null
          product_id: string | null
          status: string | null
        }
        Insert: {
          artisan_id?: string | null
          artisan_share?: number | null
          created_at?: string | null
          gross?: number | null
          id?: string
          order_number?: string | null
          platform_share?: number | null
          product_id?: string | null
          status?: string | null
        }
        Update: {
          artisan_id?: string | null
          artisan_share?: number | null
          created_at?: string | null
          gross?: number | null
          id?: string
          order_number?: string | null
          platform_share?: number | null
          product_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "artisan_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          artwork_type: string | null
          collection: string
          color: string | null
          company_name: string | null
          country: string
          created_at: string
          currency: string
          custom_size: string | null
          customer_name: string
          district: string | null
          email: string
          finish: string | null
          frame_type: string | null
          id: string
          material: string | null
          notes: string | null
          order_number: string
          orientation: string | null
          phone: string
          postal_code: string | null
          product_name: string
          province: string | null
          quantity: number
          shipping: number
          size_code: string
          status: string
          subtotal: number
          tax: number
          total: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          address: string
          artwork_type?: string | null
          collection: string
          color?: string | null
          company_name?: string | null
          country: string
          created_at?: string
          currency?: string
          custom_size?: string | null
          customer_name: string
          district?: string | null
          email: string
          finish?: string | null
          frame_type?: string | null
          id?: string
          material?: string | null
          notes?: string | null
          order_number: string
          orientation?: string | null
          phone: string
          postal_code?: string | null
          product_name: string
          province?: string | null
          quantity?: number
          shipping?: number
          size_code: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          address?: string
          artwork_type?: string | null
          collection?: string
          color?: string | null
          company_name?: string | null
          country?: string
          created_at?: string
          currency?: string
          custom_size?: string | null
          customer_name?: string
          district?: string | null
          email?: string
          finish?: string | null
          frame_type?: string | null
          id?: string
          material?: string | null
          notes?: string | null
          order_number?: string
          orientation?: string | null
          phone?: string
          postal_code?: string | null
          product_name?: string
          province?: string | null
          quantity?: number
          shipping?: number
          size_code?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string | null
          id: string
          path: string
          referrer: string | null
          session_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number | null
          artisan_id: string | null
          created_at: string | null
          id: string
          note: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          artisan_id?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          artisan_id?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
