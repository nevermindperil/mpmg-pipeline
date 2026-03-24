'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function PipelinePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({ name: '', date: '', status: 'Negotiating', priority: 'Medium', venue: '' });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
    if (confirm('정말로 삭제하시겠습니까?')) {
      await supabase.from('artists').delete().match({ id });
      fetchData();
    }
  };

  return (
    <div className="p-16">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Booking Pipeline</h2>
          <p className="text-[#86868B] font-mono text-xs uppercase tracking-[0.3em] mt-2">Artist Offer Management</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-2xl active:scale-95"
        >
          + ADD NEW OFFER
        </button>
      </div>

      <div className="bg-white border border-[#E5E5EA] rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F5F7] border-b border-[#E5E5EA]">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Artist</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Estimated Date</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Venue</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Priority</th>
              <th className="px-8 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                <td className="px-8 py-6 font-black text-xl tracking-tighter">{item.name}</td>
                <td className="px-8 py-6 text-sm font-medium">{item.date}</td>
                <td className="px-8 py-6 text-sm text-[#86868B]">{item.venue}</td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest">
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm font-bold">{item.priority}</td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors px-4">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-[500px] rounded-[40px] p-12 shadow-2xl">
            <h3 className="text-3xl font-black mb-8 tracking-tighter">NEW OFFER</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              <input type="text" placeholder="Artist Name" className="w-full p-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={e => setNewArtist({...newArtist, name: e.target.value})} required />
              <input type="text" placeholder="Date (e.g. 2025.10)" className="w-full p-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={e => setNewArtist({...newArtist, date: e.target.value})} />
              <input type="text" placeholder="Venue" className="w-full p-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={e => setNewArtist({...newArtist, venue: e.target.value})} />
              <select className="w-full p-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={e => setNewArtist({...newArtist, status: e.target.value})}>
                <option value="Negotiating">Negotiating</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Reviewing">Reviewing</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400">CANCEL</button>
                <button type="submit" className="flex-2 py-4 bg-black text-white rounded-2xl font-bold">SAVE OFFER</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}