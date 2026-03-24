'use client';

import React, { useState, useEffect } from 'react';

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

  // 🔥 실시간 투어 뉴스 가져오기 함수
  const fetchTourNews = async () => {
    setIsLoading(true);
    try {
      // Google News RSS에서 'concert tour' 키워드로 검색 (CORS 해결을 위해 Proxy 사용)
      const targetUrl = `https://news.google.com/rss/search?q=concert+tour+music+industry&hl=en-US&gl=US&ceid=US:en`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      // XML 데이터를 파싱하여 JSON 형태로 변환
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
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

  // 시간 포맷 변경 함수
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
  };

  return (
    <div className="min-h-full">
      <header className="px-16 py-12 border-b border-[#E5E5EA] bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-5xl font-extrabold tracking-tighter">Global Intelligence</h2>
        <p className="text-[#86868B] font-mono text-xs uppercase tracking-widest mt-3 font-semibold">Real-time Industry Monitoring</p>
      </header>

      <div className="px-16 py-12 space-y-16">
        {/* Agencies Section */}
        <section>
          <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-8 border-b border-[#E5E5EA] pb-4">Major Talent Agencies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENCIES.map((agency) => (
              <a key={agency.name} href={agency.url} target="_blank" rel="noopener noreferrer" className="group bg-[#F5F5F7] p-8 rounded-3xl border border-transparent hover:border-[#1D1D1F] hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl font-black tracking-tighter group-hover:scale-110 transition-transform duration-500">{agency.name}</span>
                  <span className="text-[10px] font-bold text-white bg-[#1D1D1F] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">VISIT ↗</span>
                </div>
                <p className="text-sm text-[#86868B] font-medium">{agency.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Industry News Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-8 border-b border-[#E5E5EA] pb-4">Real-time Feed Sources</h3>
            <div className="space-y-4">
              {NEWS_SOURCES.map((source) => (
                <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-white border border-[#E5E5EA] rounded-2xl hover:bg-[#F5F5F7] transition-all group">
                  <div>
                    <h4 className="font-bold text-lg">{source.name}</h4>
                    <p className="text-xs text-[#86868B]">{source.desc}</p>
                  </div>
                  <span className="text-[#D1D1D6] group-hover:text-[#1D1D1F] transition-colors">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* 🔥 REAL LIVE SIGNALS (진짜 데이터 표시) */}
          <div className="bg-[#1D1D1F] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden min-h-[500px]">
            <div className="absolute top-0 right-0 p-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-10">Live Tour Signals (Global)</h3>
            
            {isLoading ? (
              <div className="space-y-8 animate-pulse">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl"></div>)}
              </div>
            ) : (
              <div className="space-y-8">
                {articles.map((article, idx) => (
                  <a key={idx} href={article.link} target="_blank" rel="noopener noreferrer" className="block group border-l-2 border-gray-700 pl-6 py-1 hover:border-white transition-all">
                    <span className="text-[10px] font-mono text-gray-500 block mb-2 uppercase tracking-widest">
                      {formatTime(article.pubDate)} · {article.source}
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                      {article.title}
                    </p>
                  </a>
                ))}
              </div>
            )}

            <button 
              onClick={fetchTourNews}
              className="w-full mt-12 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all text-gray-400 hover:text-white"
            >
              Refresh Intelligence
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}