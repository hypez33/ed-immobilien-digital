export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InquiryStatus = 'new' | 'in_progress' | 'done' | 'archived';

export interface Database {
  public: {
    Tables: {
      inquiries: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string | null;
          service_or_anliegen: string;
          message: string;
          status: InquiryStatus;
          source: string | null;
          notes: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          service_or_anliegen: string;
          message: string;
          status?: InquiryStatus;
          source?: string | null;
          notes?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          service_or_anliegen?: string;
          message?: string;
          status?: InquiryStatus;
          source?: string | null;
          notes?: Json | null;
        };
      };
      listings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          type: string;
          status: string;
          price: number;
          price_suffix: string | null;
          area: number;
          rooms: number;
          address: string;
          city: string;
          zip: string;
          description: string | null;
          features: Json | null;
          images: Json | null;
          is_featured: boolean;
          published: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug: string;
          type: string;
          status: string;
          price: number;
          price_suffix?: string | null;
          area: number;
          rooms: number;
          address: string;
          city: string;
          zip: string;
          description?: string | null;
          features?: Json | null;
          images?: Json | null;
          is_featured?: boolean;
          published?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          slug?: string;
          type?: string;
          status?: string;
          price?: number;
          price_suffix?: string | null;
          area?: number;
          rooms?: number;
          address?: string;
          city?: string;
          zip?: string;
          description?: string | null;
          features?: Json | null;
          images?: Json | null;
          is_featured?: boolean;
          published?: boolean;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'moderator' | 'user';
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'admin' | 'moderator' | 'user';
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'moderator' | 'user';
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: 'admin' | 'moderator' | 'user';
      inquiry_status: InquiryStatus;
    };
  };
}
