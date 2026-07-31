import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client — safe to use in Client Components. Only ever
 * initialized with the public anon key; RLS policies protect the data.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
