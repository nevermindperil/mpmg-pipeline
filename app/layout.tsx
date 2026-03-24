'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col md:flex-row items-center justify-center md:justify-start px-4 py-3 rounded-xl md:rounded-lg text-[10px] md:text-sm transition-all tracking-tight md:tracking-wide ${
      isActive 
        ? 'bg-[#1D1D1F] text-white font-bold shadow-lg md:shadow-md' 
        : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5EA]/50 font-medium'
    }`;
  };

  return (
    <html lang="ko">
      <body className="bg-[#F5F5F7] text-[#1D1D1F] antialiased overflow-x-hidden">
        <div className="flex flex-col md:flex-row min-h-screen">
          
          {/* 💻 데스크톱 사이드바 (모바일에서는 숨김) */}
          <aside className="hidden md:flex w-64 bg-[#F5F5F7] border-r border-[#E5E5EA] flex-col shrink-0 sticky top-0 h-screen">
            <div className="p-10 pb-12">
              <Link href="/"><h1 className="text-3xl font-black tracking-tighter uppercase cursor-pointer">MPMG</h1></Link>
            </div>
            <nav className="flex-1 space-y-1.5 px-6">
              <Link href="/" className={getMenuClass('/')}>Booking Pipeline</Link>
              <Link href="/process" className={getMenuClass('/process')}>Project Execution</Link>
              <Link href="/global" className={getMenuClass('/global')}>Global Intelligence</Link>
            </nav>
            <div className="p-8 text-[10px] text-[#86868B] font-mono tracking-widest uppercase">Ver 3.0.0</div>
          </aside>

          {/* 📱 모바일 하단 네비게이션 (데스크톱에서는 숨김) */}
          <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[100] flex items-center justify-around px-4">
            <Link href="/" className={getMenuClass('/')}>
              <span className="text-lg mb-1">📋</span>
              <span>Pipeline</span>
            </Link>
            <Link href="/process" className={getMenuClass('/process')}>
              <span className="text-lg mb-1">⚡</span>
              <span>Execution</span>
            </Link>
            <Link href="/global" className={getMenuClass('/global')}>
              <span className="text-lg mb-1">🌐</span>
              <span>Global</span>
            </Link>
          </nav>

          {/* 메인 영역 (모바일 패딩 조정) */}
          <main className="flex-1 bg-white md:bg-white min-h-screen pb-32 md:pb-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}