'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

const COLUMNS = ['리스트업', '오퍼 준비', '협상 중', '계약 완료'];

export default function Home() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({ name: '', genre: '', fee: '' });
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const fetchOffers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
    if (!error) setOffers(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('offerId', id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, status: string) => {
    const id = e.dataTransfer.getData('offerId');
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from('offers').update({ status }).eq('id', id);
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.name) return;
    const { data, error } = await supabase.from('offers').insert([{ ...newOffer, status: '리스트업' }]).select();
    if (!error) { setOffers([...(data || []), ...offers]); setIsAddModalOpen(false); setNewOffer({ name: '', genre: '', fee: '' }); }
  };

  const handleUpdateOffer = async () => {
    const { error } = await supabase.from('offers').update({
      name: editForm.name,
      genre: editForm.genre,
      fee: editForm.fee,
      agency_contact: editForm.agency_contact,
      past_history: editForm.past_history
    }).eq('id', selectedOffer.id);

    if (!error) {
      setOffers(prev => prev.map(o => o.id === selectedOffer.id ? { ...o, ...editForm } : o));
      setSelectedOffer({ ...selectedOffer, ...editForm });
      setIsEditing(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('정말로 이 아티스트 정보를 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('offers').delete().eq('id', id);
    if (!error) { setOffers(prev => prev.filter(o => o.id !== id)); setIsDrawerOpen(false); }
  };

  const openDrawer = (offer: any) => {
    setSelectedOffer(offer);
    setEditForm(offer);
    setIsDrawerOpen(true);
    setIsEditing(false);
  };

  return (
    <div className="min-h-full">
      {/* 여백을 약간 줄여서 80% 뷰에서 더 꽉 차 보이게 조정 */}
      <header className="px-16 py-8 flex justify-between items-end bg-[#F5F5F7]/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#E5E5EA]">
        <div>
          <h2 className="text-5xl font-extrabold tracking-tighter">내한공연</h2>
          <p className="text-[#86868B] font-mono text-xs uppercase tracking-widest mt-2">Active Pipeline</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-[#1D1D1F] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#434344]">
          + New Offer
        </button>
      </header>
      
      <div className="px-16 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-[#86868B] font-mono text-xs animate-pulse">Syncing...</div>
        ) : (
          <div className="flex gap-8 overflow-x-auto pb-10">
            {COLUMNS.map((col) => (
              <div key={col} className="flex-1 min-w-[280px]" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, col)}>
                <h4 className="flex justify-between items-end border-b-2 border-[#1D1D1F] pb-4 mb-6 font-extrabold uppercase tracking-wider text-sm">
                  {col} <span className="font-mono text-[#86868B] font-normal">{offers.filter(o => o.status === col).length}</span>
                </h4>
                <div className="space-y-4">
                  {offers.filter(o => o.status === col).map((offer) => (
                    <div key={offer.id} draggable onDragStart={(e) => handleDragStart(e, offer.id)} onClick={() => openDrawer(offer)} className="bg-white p-6 rounded-2xl border border-[#E5E5EA] shadow-sm cursor-grab hover:border-[#1D1D1F] transition-all duration-300">
                      <h5 className="text-xl font-bold tracking-tight">{offer.name}</h5>
                      <div className="flex justify-between items-center mt-4 text-[11px] font-mono text-[#86868B]">
                        <span>{offer.genre || 'TBD'}</span>
                        <span className="text-[#1D1D1F] font-bold">{offer.fee || 'TBD'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && <AddModal onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddOffer} newOffer={newOffer} setNewOffer={setNewOffer} />}
      {isDrawerOpen && <DetailDrawer selectedOffer={selectedOffer} isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} onClose={() => setIsDrawerOpen(false)} onDelete={() => handleDeleteOffer(selectedOffer.id)} onEdit={() => setIsEditing(true)} onSave={handleUpdateOffer} onCancel={() => setIsEditing(false)} />}
    </div>
  );
}

// 🔥 에러가 났던 하위 컴포넌트들의 null 방지 처리
function DetailDrawer({ selectedOffer, isEditing, editForm, setEditForm, onClose, onDelete, onEdit, onSave, onCancel }: any) {
  return (
    <>
      <div className="fixed inset-0 bg-[#F5F5F7]/60 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-full max-w-[550px] bg-white shadow-2xl z-50 p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
        <div className="flex justify-between items-center mb-12">
          <span className="bg-[#F5F5F7] text-[#1D1D1F] px-4 py-2 rounded-full uppercase tracking-widest font-bold text-[10px]">{selectedOffer.status}</span>
          <button onClick={onClose} className="text-[#86868B] hover:text-[#1D1D1F] text-2xl font-light">✕</button>
        </div>

        {isEditing ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <InputSmall label="Artist Name" value={editForm.name} onChange={(val:any) => setEditForm({...editForm, name: val})} />
            <div className="grid grid-cols-2 gap-6">
              <InputSmall label="Genre" value={editForm.genre} onChange={(val:any) => setEditForm({...editForm, genre: val})} />
              <InputSmall label="Fee" value={editForm.fee} onChange={(val:any) => setEditForm({...editForm, fee: val})} />
            </div>
            <TextArea label="Agency Contact" value={editForm.agency_contact} onChange={(val:any) => setEditForm({...editForm, agency_contact: val})} />
            <TextArea label="Past History" value={editForm.past_history} onChange={(val:any) => setEditForm({...editForm, past_history: val})} />
            <div className="flex gap-4 pt-6">
              <button onClick={onCancel} className="flex-1 py-3 border border-[#E5E5EA] rounded-xl text-xs font-bold uppercase tracking-widest">Cancel</button>
              <button onClick={onSave} className="flex-1 py-3 bg-[#1D1D1F] text-white rounded-xl text-xs font-bold uppercase tracking-widest">Save</button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-5xl font-black tracking-tighter mb-4 leading-none">{selectedOffer.name}</h2>
            <p className="text-[#86868B] font-mono text-sm uppercase tracking-widest mb-12">{selectedOffer.genre || 'TBD'}</p>
            <div className="space-y-10">
              <Section label="Target Fee" value={selectedOffer.fee || '$ -'} isMono />
              <Section label="Agency / Management" value={selectedOffer.agency_contact || 'No info.'} isBox />
              <Section label="Past Tours" value={selectedOffer.past_history || 'No records.'} isBox />
            </div>
            <div className="mt-16 flex gap-4">
              <button onClick={onDelete} className="px-6 py-4 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all">Delete</button>
              <button onClick={onEdit} className="flex-1 bg-[#1D1D1F] text-white rounded-xl py-4 text-xs font-bold uppercase tracking-widest shadow-md">Edit Details</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// 🔥 value || '' 를 적용해 null 에러 방지
function InputSmall({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest block mb-2">{label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm focus:border-[#1D1D1F] outline-none" />
    </div>
  );
}

function TextArea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest block mb-2">{label}</label>
      <textarea rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm focus:border-[#1D1D1F] outline-none resize-none" />
    </div>
  );
}

function Section({ label, value, isMono = false, isBox = false }: any) {
  return (
    <div className="border-t border-[#E5E5EA] pt-8">
      <h4 className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest mb-3">{label}</h4>
      <div className={`${isBox ? 'bg-[#F5F5F7] p-5 rounded-2xl' : ''} ${isMono ? 'font-mono text-3xl' : 'text-md'} leading-relaxed whitespace-pre-wrap`}>{value}</div>
    </div>
  );
}

function AddModal({ onClose, onSubmit, newOffer, setNewOffer }: any) {
  return (
    <div className="fixed inset-0 bg-[#F5F5F7]/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="bg-white p-12 rounded-3xl border border-[#E5E5EA] shadow-2xl w-full max-w-[450px]">
        <h3 className="text-2xl font-black mb-8">New Artist</h3>
        <form onSubmit={onSubmit} className="space-y-6">
          <InputSmall label="Artist Name" value={newOffer.name} onChange={(val:any) => setNewOffer({...newOffer, name: val})} />
          <div className="grid grid-cols-2 gap-4">
            <InputSmall label="Genre" value={newOffer.genre} onChange={(val:any) => setNewOffer({...newOffer, genre: val})} />
            <InputSmall label="Fee" value={newOffer.fee} onChange={(val:any) => setNewOffer({...newOffer, fee: val})} />
          </div>
          <button type="submit" className="w-full bg-[#1D1D1F] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest mt-4 shadow-md">Add to Pipeline</button>
          <button type="button" onClick={onClose} className="w-full text-[#86868B] text-xs font-bold uppercase tracking-widest mt-2">Cancel</button>
        </form>
      </div>
    </div>
  );
}