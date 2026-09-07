'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { encrypt } from '@/lib/session';

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = formData.get('password') as string;

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Invalid password. Try again.' };
  }

  const token = await encrypt({ authenticated: true });
  const store = await cookies();

  store.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  redirect('/admin/rates');
}

export async function logoutAction() {
  const store = await cookies();
  store.delete('admin_session');
  redirect('/admin/login');
}
