'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold text-[#1C2B3A] mb-4"
            style={{ background: 'linear-gradient(135deg, #E8C96A, #C9A84C)' }}
          >
            ✈
          </div>
          <h1 className="text-[1.6rem] font-bold text-[#1C2B3A]">Travocom Admin</h1>
          <p className="text-[15px] text-[#8B9FAE] mt-1">Enter your password to continue</p>
        </div>

        <form action={action} className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.06)] p-7 space-y-5">
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-widest text-[#8B9FAE] mb-2">
              Admin Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••••••"
              autoFocus
              required
              className="w-full px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.10)] text-[16px] text-[#1C2B3A] placeholder-[#8B9FAE] focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {state?.error && (
            <p className="text-[14px] text-red-500 font-medium">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 rounded-xl font-bold text-[16px] text-[#1C2B3A] disabled:opacity-50 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #E8C96A, #C9A84C)' }}
          >
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
