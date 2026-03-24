// 주요 변경 포인트만 적용한 코드입니다.
export default function GlobalPage() {
    // ... (기존 state 및 fetch 함수 동일)
  
    return (
      <div className="min-h-full">
        {/* 헤더: 모바일에서 텍스트 크기 및 여백 축소 */}
        <header className="px-6 md:px-16 py-8 md:py-12 border-b border-[#E5E5EA] bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">Global Intelligence</h2>
          <p className="text-[#86868B] font-mono text-[10px] uppercase tracking-widest mt-2">Real-time Industry Monitoring</p>
        </header>
  
        <div className="px-6 md:px-16 py-8 md:py-12 space-y-12 md:space-y-16">
          {/* Agencies Section: md(768px) 미만에서는 1열, 이상에서는 3열 */}
          <section>
            <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-6 border-b border-[#E5E5EA] pb-4">Major Talent Agencies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {AGENCIES.map((agency) => (
                <a key={agency.name} href={agency.url} target="_blank" rel="noopener noreferrer" className="bg-[#F5F5F7] p-6 md:p-8 rounded-2xl md:rounded-3xl border border-transparent hover:border-[#1D1D1F] transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl md:text-3xl font-black tracking-tighter">{agency.name}</span>
                    <span className="text-[8px] font-bold text-white bg-[#1D1D1F] px-2 py-1 rounded-full">GO</span>
                  </div>
                  <p className="text-xs text-[#86868B]">{agency.desc}</p>
                </a>
              ))}
            </div>
          </section>
  
          {/* Industry News & Live Signals: 모바일에서는 위아래로 배치 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Sources */}
            <div className="order-2 lg:order-1">
               <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-6 border-b border-[#E5E5EA] pb-4">Sources</h3>
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                 {NEWS_SOURCES.map((source) => (
                   <a key={source.name} href={source.url} className="p-4 bg-white border border-[#E5E5EA] rounded-xl">
                     <h4 className="font-bold text-sm">{source.name}</h4>
                   </a>
                 ))}
               </div>
            </div>
  
            {/* 🔥 REAL LIVE SIGNALS: 모바일에서 가장 먼저 보이도록 order-1 설정 가능 */}
            <div className="order-1 lg:order-2 bg-[#1D1D1F] rounded-3xl p-6 md:p-10 text-white shadow-2xl min-h-[400px]">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-8">Live Tour Signals</h3>
              {/* ... (기존 뉴스 리스트 로직 동일) */}
            </div>
          </section>
        </div>
      </div>
    );
  }