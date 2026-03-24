'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function ProcessPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const fetchSteps = async () => {
    const { data } = await supabase.from('process_steps').select('*').order('step_order', { ascending: true });
    if (data) setSteps(data);
    setLoading(false);
  };

  useEffect(() => { fetchSteps(); }, []);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    await supabase.from('process_steps').update({ status: newStatus }).match({ id });
    fetchSteps();
  };

  const progress = steps.length > 0 ? Math.round((steps.filter(s => s.status === 'Completed').length / steps.length) * 100) : 0;

  return (
    <div className="min-h-full">
      <header className="px-6 md:px-16 py-8 md:py-12 border-b border-[#E5E5EA] bg-white sticky top-0 z-30">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Execution</h2>
          <span className="text-4xl md:text-6xl font-black tracking-tighter">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
          <div className="h-full bg-black transition-all duration-700" style={{ width: `${progress}%` }}></div>
        </div>
      </header>

      <div className="px-6 md:px-16 py-12">
        {/* 💻 PC View: 시원한 리스트 형식 */}
        <div className="hidden md:block space-y-4">
          {steps.map((item) => (
            <div key={item.id} onClick={() => toggleStatus(item.id, item.status)} className={`flex items-center justify-between p-8 rounded-[32px] border cursor-pointer transition-all ${item.status === 'Completed' ? 'bg-[#F5F5F7] border-transparent' : 'bg-white border-[#E5E5EA] hover:border-black shadow-sm'}`}>
              <div className="flex items-center gap-8">
                <span className={`text-2xl font-black ${item.status === 'Completed' ? 'text-gray-300' : 'text-black'}`}>{item.step_order.toString().padStart(2, '0')}</span>
                <div>
                  <h4 className="text-xl font-bold tracking-tight">{item.title}</h4>
                  <p className="text-sm text-[#86868B]">{item.description}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest ${item.status === 'Completed' ? 'bg-black text-white' : 'bg-white border border-[#E5E5EA] text-[#86868B]'}`}>{item.status}</span>
            </div>
          ))}
        </div>

        {/* 📱 Mobile View: 세로형 타임라인 형식 */}
        <div className="md:hidden space-y-10">
          {steps.map((item, idx) => (
            <div key={item.id} className="relative pl-12" onClick={() => toggleStatus(item.id, item.status)}>
              {idx !== steps.length - 1 && <div className="absolute left-[21px] top-10 bottom-[-40px] w-[2px] bg-[#E5E5EA]"></div>}
              <div className={`absolute left-0 top-0 w-11 h-11 rounded-full flex items-center justify-center border-2 z-10 ${item.status === 'Completed' ? 'bg-black border-black text-white' : 'bg-white border-[#E5E5EA] text-[#D1D1D6]'}`}>
                {item.status === 'Completed' ? '✓' : idx + 1}
              </div>
              <div className={`p-6 rounded-[24px] border ${item.status === 'Completed' ? 'bg-[#F5F5F7] opacity-60' : 'bg-white shadow-md'}`}>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-xs text-[#86868B]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}