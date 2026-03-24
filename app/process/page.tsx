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

  const progress = steps.length > 0 
    ? Math.round((steps.filter(s => s.status === 'Completed').length / steps.length) * 100) 
    : 0;

  return (
    <div className="p-16">
      <div className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">Execution</h2>
            <p className="text-[#86868B] font-mono text-xs uppercase tracking-[0.3em] mt-2">Standard Operating Procedure</p>
          </div>
          <div className="text-right">
            <span className="text-7xl font-black tracking-tighter">{progress}%</span>
          </div>
        </div>
        <div className="w-full h-4 bg-[#E5E5EA] rounded-full overflow-hidden">
          <div className="h-full bg-black transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl">
        {steps.map((item) => (
          <div 
            key={item.id} 
            onClick={() => toggleStatus(item.id, item.status)}
            className={`flex items-center justify-between p-8 rounded-[32px] border cursor-pointer transition-all ${
              item.status === 'Completed' ? 'bg-[#F5F5F7] border-transparent opacity-50' : 'bg-white border-[#E5E5EA] hover:border-black shadow-sm'
            }`}
          >
            <div className="flex items-center gap-8">
              <span className="text-2xl font-black w-8">{item.step_order}</span>
              <div>
                <h4 className="text-xl font-bold tracking-tight">{item.title}</h4>
                <p className="text-[#86868B] text-sm mt-1">{item.description}</p>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              item.status === 'Completed' ? 'bg-black border-black text-white' : 'border-[#E5E5EA]'
            }`}>
              {item.status === 'Completed' && '✓'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}