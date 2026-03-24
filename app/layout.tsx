'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="ko">
      <body className="bg-[#F5F5F7] text-[#1D1D1F] antialiased">
        <div className="flex min-h-screen">
          <aside className="w-80 bg-[#F5F5F7] border-r border-[#E5E5EA] flex flex-col shrink-0 sticky top-0 h-screen">
            <div className="p-12 pb-20">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">MPMG</h1>
              <p className="text-[10px] text-[#86868B] font-mono tracking-widest uppercase mt-2">Intelligence v3.0</p>
            </div>
            <nav className="flex-1 space-y-2 px-8">
              <Link href="/" className={`block px-6 py-4 rounded-2xl font-bold transition-all ${pathname === '/' ? 'bg-white shadow-xl' : 'text-[#86868B] hover:text-black'}`}>Pipeline</Link>
              <Link href="/process" className={`block px-6 py-4 rounded-2xl font-bold transition-all ${pathname === '/process' ? 'bg-white shadow-xl' : 'text-[#86868B] hover:text-black'}`}>Execution</Link>
              <Link href="/global" className={`block px-6 py-4 rounded-2xl font-bold transition-all ${pathname === '/global' ? 'bg-white shadow-xl' : 'text-[#86868B] hover:text-black'}`}>Global</Link>
            </nav>
          </aside>
          <main className="flex-1 bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}