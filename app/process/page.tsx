'use client';

import React from 'react';

const PROCESS_STEPS = [
  { step: '01', title: 'Contracting', desc: 'LOI 발송 및 계약 조건 최종 조율', status: 'Completed' },
  { step: '02', title: 'Venue Setup', desc: '대관 확정 및 기술 라이더 검토', status: 'In Progress' },
  { step: '03', title: 'Marketing', desc: '티켓 오픈 공지 및 홍보 전략 수립', status: 'Pending' },
  { step: '04', title: 'Operation', desc: '현장 운영 인력 및 보안 계획 수립', status: 'Pending' },
];

export default function ProcessPage() {
  return (
    <div className="min-h-full">
      <header className="px-6 md:px-16 py-8 md:py-12 border-b border-[#E5E5EA] bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-black">Project Execution</h2>
        <p className="text-[#86868B] font-mono text-[10px] uppercase tracking-widest mt-2">Standard Operating Procedure</p>
      </header>

      <div className="px-6 md:px-16 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          {PROCESS_STEPS.map((item, idx) => (
            <div key={idx} className="relative pl-12 md:pl-16 group">
              {/* 타임라인 세로선 */}
              {idx !== PROCESS_STEPS.length - 1 && (
                <div className="absolute left-[21px] md:left-[27px] top-10 bottom-[-30px] w-[2px] bg-[#E5E5EA] group-hover:bg-[#1D1D1F] transition-colors"></div>
              )}
              
              {/* 숫자 원형 아이콘 */}
              <div className={`absolute left-0 top-0 w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                item.status === 'Completed' ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white' : 
                item.status === 'In Progress' ? 'bg-white border-[#1D1D1F] text-[#1D1D1F] shadow-lg' : 
                'bg-white border-[#E5E5EA] text-[#D1D1D6]'
              }`}>
                <span className="text-xs md:text-sm font-black">{item.step}</span>
              </div>

              {/* 단계 설명 카드 */}
              <div className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] border transition-all ${
                item.status === 'In Progress' ? 'bg-white border-[#1D1D1F] shadow-xl' : 'bg-[#F5F5F7] border-transparent'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg md:text-xl font-bold tracking-tight text-black">{item.title}</h4>
                  <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded ${
                    item.status === 'In Progress' ? 'bg-black text-white' : 'text-[#86868B]'
                  }`}>{item.status}</span>
                </div>
                <p className="text-sm md:text-base text-[#86868B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}