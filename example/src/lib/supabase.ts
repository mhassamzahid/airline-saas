import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin panel server actions — bypasses RLS using service role key
export function createAdminClient() {
  return createClient(url, svc, { auth: { persistSession: false } });
}

// Customer form — anonymous, subject to RLS (insert-only on enquiries)
export function createAnonClient() {
  return createClient(url, anon, { auth: { persistSession: false } });
}
