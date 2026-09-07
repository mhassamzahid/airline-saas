'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase';

export async function updateStatusAction(formData: FormData) {
  const id     = formData.get('id') as string;
  const status = formData.get('status') as string;

  const db = createAdminClient();
  const { error } = await db.from('enquiries').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/enquiries');
}

export async function updateNotesAction(formData: FormData) {
  const id    = formData.get('id') as string;
  const notes = formData.get('notes') as string;

  const db = createAdminClient();
  const { error } = await db.from('enquiries').update({ notes }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/enquiries');
}
