'use client';

import React from 'react';

const BOOKING_DATA = [
  { id: 1, artist: 'Oasis', date: '2025.10', status: 'Negotiating', priority: 'High', venue: 'K-Spome' },
  { id: 2, artist: 'The 1975', date: '2025.12', status: 'Confirmed', priority: 'Critical', venue: 'Inspire Arena' },
  { id: 3, artist: 'Lana Del Rey', date: '2026.03', status: 'Reviewing', priority: 'Medium', venue: 'TBD' },
];

export default function PipelinePage() {
  return (
    <div className="min-h-full">
      <header className="px-6 md:px-16 py-8 md:py-12 border-b border-[#E5E5EA] bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-black">Booking Pipeline</h2>
        <p className="text-[#86868B] font-mono text-[10px] uppercase tracking-widest mt-2">Current Negotiation Status</p>
      </header>

      <div className="px-6 md:px-16 py-8 md:py-12">
        {/* 모바일/데스크톱 공통 그리드 시스템 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {BOOKING_DATA.map((item) => (
            <div key={item.id} className="group bg-white p-6 md:p-8 rounded-[32px] border border-[#E5E5EA] hover:border-[#1D1D1F] transition-all shadow-sm hover:shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    item.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-[#F5F5F7] text-[#86868B]'
                  }`}>
                    {item.priority}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter mt-3 text-black">{item.artist}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#86868B] block uppercase tracking-tighter">{item.date}</span>
                  <span className="text-sm font-bold text-[#1D1D1F]">{item.venue}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-[#F5F5F7]">
                <span className="text-xs font-medium text-[#86868B]">Status</span>
                <span className="text-xs font-bold text-[#1D1D1F] flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}