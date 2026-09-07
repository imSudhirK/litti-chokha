/**
 * Database types.
 *
 * Hand-written to match supabase/migrations/*.sql. Once the Supabase CLI is
 * linked to the project you can regenerate this file instead of editing it:
 *
 *   npx supabase gen types typescript --project-id <id> > src/lib/db.types.ts
 *
 * Until then: when you add a feature migration, add its tables here in the
 * same shape (Row / Insert / Update).
 */

type Timestamp = string;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          notes: string | null;
          done: boolean;
          due_date: string | null;
          position: number;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          notes?: string | null;
          done?: boolean;
          due_date?: string | null;
          position?: number;
        };
        Update: {
          title?: string;
          notes?: string | null;
          done?: boolean;
          due_date?: string | null;
          position?: number;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          archived: boolean;
          position: number;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          archived?: boolean;
          position?: number;
        };
        Update: {
          name?: string;
          color?: string;
          archived?: boolean;
          position?: number;
        };
        Relationships: [];
      };
      habit_entries: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          entry_date: string;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          entry_date: string;
        };
        Update: never;
        Relationships: [];
      };
      allowlist: {
        Row: { email: string; note: string | null; created_at: Timestamp };
        Insert: { email: string; note?: string | null };
        Update: { note?: string | null };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

/** Convenience alias: `Tables<"todos">` is the row type for the todos table. */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
