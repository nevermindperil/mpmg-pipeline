'use client';

import React, { useState, useEffect } from 'react';

// 1. 데이터 정의 (이 부분이 빠져서 에러가 났었습니다!)
const AGENCIES = [
  { name: 'WME', desc: 'William Morris Endeavor', url: 'https://www.wmeagency.com/music/' },
  { name: 'CAA', desc: 'Creative Artists Agency', url: 'https://www.caa.com/' },
  { name: 'UTA', desc: 'United Talent Agency', url: 'https://www.unitedtalent.com/' },
  { name: 'Wasserman', desc: 'Wasserman Music', url: 'https://www.teamwass.com/music/' },
  { name: 'Paradigm', desc: 'Paradigm Talent Agency', url: 'https://www.paradigmagency.com/' },
  { name: 'Primary Talent', desc: 'Primary Talent International', url: 'https://primarytalent.com/' },
];

const NEWS_SOURCES = [
  { name: 'Billboard Biz', url: 'https://www.billboard.com/business/', desc: '차트 및 비즈니스 데이터' },
  { name: 'Pollstar', url: 'https://www.pollstar.com/', desc: '투어 및 박스오피스 전문' },
  { name: 'NME News', url: 'https://www.nme.com/news', desc: '글로벌 음악 및 페스티벌 뉴스' },
  { name: 'Variety Music', url: 'https://variety.com/v/music/', desc: '업계 인사이트 및 분석' },
];

export default function GlobalPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 실시간 투어 뉴스 가져오기 함수
  const fetchTourNews = async () => {
    setIsLoading(true);
    try {
      const targetUrl = `https://news.google.com/rss/search?q=concert+tour+music+industry&hl=en-US&gl=US&ceid=US:en`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(proxyUrl);
      const xmlString = await response.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const items = xmlDoc.querySelectorAll("item");
      
      const parsedArticles = Array.from(items).slice(0, 6).map(item => ({
        title: item.querySelector("title")?.textContent,
        link: item.querySelector("link")?.textContent,
        pubDate: item.querySelector("pubDate")?.textContent,
        source: item.querySelector("source")?.textContent,
      }));

      setArticles(parsedArticles);
    } catch (error) {
      console.error("News fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTourNews();
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
  };

  return (
    <div className="min-h-full">
      {/* 📱 모바일 헤더 최적화: 여백 축소 및 폰트 사이즈 조정 */}
      <header className="px-6 md:px-16 py-8 md:py-12 border-b border-[#E5E5EA] bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">Global Intelligence</h2>
        <p className="text-[#86868B] font-mono text-[10px] uppercase tracking-widest mt-2">Real-time Industry Monitoring</p>
      </header>

      <div className="px-6 md:px-16 py-8 md:py-12 space-y-12 md:space-y-16">
        {/* Agencies Section: 모바일에서는 1열, 데스크톱에서는 3열 */}
        <section>
          <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-6 border-b border-[#E5E5EA] pb-4">Major Talent Agencies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {AGENCIES.map((agency) => (
              <a key={agency.name} href={agency.url} target="_blank" rel="noopener noreferrer" className="bg-[#F5F5F7] p-6 md:p-8 rounded-2xl md:rounded-3xl border border-transparent hover:border-[#1D1D1F] transition-all">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl md:text-3xl font-black tracking-tighter">{agency.name}</span>
                  <span className="text-[8px] font-bold text-white bg-[#1D1D1F] px-2 py-1 rounded-full">VISIT</span>
                </div>
                <p className="text-xs text-[#86868B]">{agency.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Industry News Section: 모바일에서는 순서 변경 (뉴스를 위로) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* 🔥 REAL LIVE SIGNALS (모바일 우선순위 반영) */}
          <div className="order-1 lg:order-2 bg-[#1D1D1F] rounded-[32px] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden min-h-[450px]">
            <div className="absolute top-0 right-0 p-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-8">Live Tour Signals</h3>
            
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl"></div>)}
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article, idx) => (
                  <a key={idx} href={article.link} target="_blank" rel="noopener noreferrer" className="block group border-l border-gray-700 pl-4 py-1 hover:border-white transition-all">
                    <span className="text-[10px] font-mono text-gray-500 block mb-1 uppercase tracking-widest">
                      {formatTime(article.pubDate)} · {article.source}
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-gray-200 group-hover:text-white line-clamp-2">
                      {article.title}
                    </p>
                  </a>
                ))}
              </div>
            )}

            <button 
              onClick={fetchTourNews}
              className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all text-gray-400"
            >
              Refresh News
            </button>
          </div>

          {/* Sources Section */}
          <div className="order-2 lg:order-1">
            <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-6 border-b border-[#E5E5EA] pb-4">Intelligence Sources</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
              {NEWS_SOURCES.map((source) => (
                <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-white border border-[#E5E5EA] rounded-2xl hover:bg-[#F5F5F7] transition-all group">
                  <span className="font-bold text-sm md:text-lg">{source.name}</span>
                  <span className="hidden md:block text-[#D1D1D6] group-hover:text-[#1D1D1F]">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}