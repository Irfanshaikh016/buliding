import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
    // Return null or throw clear indicator when unconfigured
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('http')
  );
}
