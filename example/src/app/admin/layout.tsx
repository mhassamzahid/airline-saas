import type { Metadata } from 'next';
import { LayoutDashboard, Inbox, LogOut, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { logoutAction } from './login/actions';

export const metadata: Metadata = { title: 'Travocom Admin' };

const NAV = [
  { href: '/admin/rates',     label: 'Daily Rates',  Icon: BarChart3 },
  { href: '/admin/enquiries', label: 'Enquiries',    Icon: Inbox },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#F8F5F0]">

      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-[#1C2B3A] flex flex-col sticky top-0 h-screen overflow-y-auto">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[#1C2B3A] text-[15px] shrink-0"
              style={{ background: 'linear-gradient(135deg, #E8C96A, #C9A84C)' }}
            >
              ✈
            </div>
            <div>
              <p className="font-bold text-white text-[15px] leading-none">Travocom</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
