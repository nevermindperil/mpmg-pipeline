'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center px-4 py-3 rounded-lg text-sm transition-all tracking-wide ${
      isActive 
        ? 'bg-[#1D1D1F] text-white font-bold shadow-md' 
        : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5EA]/50 font-medium'
    }`;
  };

  return (
    <html lang="ko">
      <body className="bg-[#F5F5F7] text-[#1D1D1F] antialiased overflow-hidden">
        {/* 🔥 [해결 포인트] 
            zoom이 0.8(80%)이면, 실제 브라우저를 꽉 채우기 위해 
            너비와 높이를 거꾸로 125% (1/0.8) 만큼 늘려줘야 합니다. 
        */}
        <div 
          style={{ 
            zoom: '0.8', 
            width: '125vw', 
            height: '125vh',
            position: 'absolute',
            top: 0,
            left: 0
          }} 
          className="flex overflow-hidden"
        >
          {/* 사이드바 - 이제 높이가 125vh이므로 화면 끝까지 내려갑니다 */}
          <aside className="w-64 bg-[#F5F5F7] border-r border-[#E5E5EA] flex flex-col shrink-0 h-full">
            <div className="p-10 pb-12">
              <Link href="/">
                <h1 className="text-3xl font-black tracking-tighter uppercase cursor-pointer hover:opacity-70 transition-opacity">
                  MPMG
                </h1>
              </Link>
            </div>
            <nav className="flex-1 space-y-1.5 px-6">
              <Link href="/" className={getMenuClass('/')}>Booking Pipeline</Link>
              <Link href="/process" className={getMenuClass('/process')}>Project Execution</Link>
              <Link href="/global" className={getMenuClass('/global')}>Global Intelligence</Link>
            </nav>
            <div className="p-8 text-[10px] text-[#86868B] font-mono tracking-widest uppercase">
              Ver 2.2.2<br/>MPMG STUDIO
            </div>
          </aside>

          {/* 메인 영역 - 컨텐츠가 많아지면 내부에서만 스크롤됩니다 */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white h-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}