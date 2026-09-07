'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase';

export interface RateRow {
  travel_type: string;
  zone: string;
  comfort_level: string;
  duration_days: number;
  group_type: string;
  price_per_person: number;
}

export async function saveRatesAction(rows: RateRow[]) {
  const db = createAdminClient();

  const { error } = await db
    .from('hajj_umrah_rates')
    .upsert(rows, { onConflict: 'travel_type,zone,comfort_level,duration_days,group_type' });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/rates');
  return { success: true };
}
