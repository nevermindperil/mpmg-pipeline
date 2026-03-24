'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function PipelinePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({ name: '', date: '', status: 'Negotiating', priority: 'Medium', venue: '' });

  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('artists').select('*').order('created_at', { ascending: false });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('artists').insert([newArtist]);
    if (!error) {
      setIsModalOpen(false);
      setNewArtist({ name: '', date: '', status: 'Negotiating', priority: 'Medium', venue: '' });
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('삭제하시겠습니까?')) {
      await supabase.from('artists').delete().match({ id });
      fetchData();
    }
  };

  return (
    <div className="min-h-full">
      <header className="px-6 md:px-16 py-8 md:py-12 border-b border-[#E5E5EA] bg-white flex justify-between items-end sticky top-0 z-30">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black">Booking Pipeline</h2>
          <p className="text-[#86868B] font-mono text-[10px] uppercase tracking-widest mt-2">Global Live Tracking</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-black text-white px-5 py-3 rounded-xl font-bold text-xs shadow-xl active:scale-95 transition-all">
          + ADD NEW
        </button>
      </header>

      <div className="px-6 md:px-16 py-8">
        {loading ? (
          <div className="text-center py-20 font-mono text-gray-400">CONNECTING...</div>
        ) : (
          <>
            {/* 💻 PC View: 예전에 쓰던 깔끔한 표 형식 (768px 이상에서만 보임) */}
            <div className="hidden md:block overflow-hidden border border-[#E5E5EA] rounded-[32px]">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-[#F5F5F7] border-b border-[#E5E5EA]">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Artist</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Date</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Venue</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Priority</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F7]">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                      <td className="px-8 py-6 font-black text-lg tracking-tighter">{item.name}</td>
                      <td className="px-8 py-6 text-sm text-[#86868B]">{item.date}</td>
                      <td className="px-8 py-6 text-sm font-medium">{item.venue}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest border border-green-100">{item.status}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-bold uppercase ${item.priority === 'High' ? 'text-red-500' : 'text-gray-400'}`}>{item.priority}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 Mobile View: 아까 만든 세련된 카드 형식 (768px 미만에서만 보임) */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[32px] border border-[#E5E5EA] shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black tracking-tighter text-black">{item.name}</h3>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                    <div><p className="text-[#86868B] mb-1">Date</p><p className="font-bold">{item.date}</p></div>
                    <div><p className="text-[#86868B] mb-1">Venue</p><p className="font-bold">{item.venue}</p></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#F5F5F7]">
                    <span className="text-[10px] font-bold bg-[#F5F5F7] px-3 py-1 rounded-full">{item.priority}</span>
                    <span className="text-xs font-bold text-green-600">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 모달은 공통 (모바일 최적화) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8">
            <h3 className="text-2xl font-black mb-6 tracking-tighter">NEW OFFER</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" placeholder="Artist Name" className="w-full p-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={e => setNewArtist({...newArtist, name: e.target.value})} required />
              <div className="flex gap-4">
                <input type="text" placeholder="Date" className="w-full p-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={e => setNewArtist({...newArtist, date: e.target.value})} />
                <input type="text" placeholder="Venue" className="w-full p-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={e => setNewArtist({...newArtist, venue: e.target.value})} />
              </div>
              <select className="w-full p-4 bg-[#F5F5F7] rounded-2xl outline-none font-bold" onChange={e => setNewArtist({...newArtist, status: e.target.value})}>
                <option value="Negotiating">Negotiating</option>
                <option value="Confirmed">Confirmed</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-gray-400">CLOSE</button>
                <button type="submit" className="flex-2 bg-black text-white px-8 py-4 rounded-2xl font-bold">SAVE</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}