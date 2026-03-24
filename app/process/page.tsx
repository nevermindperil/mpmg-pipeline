'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const defaultChecklistCategories = [
  { id: 'hall', name: 'Venue & Production', tasks: ['공연장 최종 대관 계약서 서명', '테크 라이더(음향/조명) 리뷰', '로컬 프로덕션/경호 팀 섭외'] },
  { id: 'visa', name: 'Legal & Admin', tasks: ['아티스트 비자(C-4) 초청장 발급', '문체부 공연 허가 신청', '해외 송금 및 세무(원천징수) 처리'] },
  { id: 'promo', name: 'Marketing & Ticketing', tasks: ['메인 포스터 및 키 비주얼 확정', '티켓 예매처 오픈 공지', '국내 프레스 인터뷰 일정 조율'] },
  { id: 'hos', name: 'Hospitality', tasks: ['항공권(First/Business) 발권', '5성급 호텔 스위트룸 예약', '식단(Allergy) 및 라이더 물품 세팅'] },
];

export default function ProcessPage() {
  const [confirmedOffers, setConfirmedOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editableChecklist, setEditableChecklist] = useState<any[]>([]);

  const fetchConfirmedOffers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('status', '계약 완료')
      .order('created_at', { ascending: false });

    if (error) console.error('Error:', error);
    else setConfirmedOffers(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchConfirmedOffers(); }, []);

  const toggleAccordion = (id: string) => {
    if (expandedProjectId === id) {
      setExpandedProjectId(null);
      setEditingProjectId(null);
    } else {
      setExpandedProjectId(id);
      setEditingProjectId(null);
    }
  };

  const handleToggleTask = async (offerId: string, taskKey: string, currentStatus: any) => {
    const newStatus = { ...currentStatus, [taskKey]: !currentStatus[taskKey] };
    setConfirmedOffers(prev => prev.map(offer => offer.id === offerId ? { ...offer, checklist_status: newStatus } : offer));
    await supabase.from('offers').update({ checklist_status: newStatus }).eq('id', offerId);
  };

  const calculateProgress = (statusObj: any, checklist: any[]) => {
    if (!statusObj) return 0;
    const totalTasks = checklist.reduce((acc, cat) => acc + cat.tasks.length, 0);
    if (totalTasks === 0) return 0;
    const completedCount = Object.values(statusObj).filter(Boolean).length;
    return Math.round((completedCount / totalTasks) * 100);
  };

  const startEditing = (offer: any) => {
    setEditingProjectId(offer.id);
    const currentList = offer.custom_checklist || JSON.parse(JSON.stringify(defaultChecklistCategories));
    setEditableChecklist(currentList);
  };

  const handleTaskTextChange = (catIdx: number, taskIdx: number, newText: string) => {
    const newList = [...editableChecklist];
    newList[catIdx].tasks[taskIdx] = newText;
    setEditableChecklist(newList);
  };

  const handleRemoveTask = (catIdx: number, taskIdx: number) => {
    const newList = [...editableChecklist];
    newList[catIdx].tasks.splice(taskIdx, 1);
    setEditableChecklist(newList);
  };

  const handleAddTask = (catIdx: number) => {
    const newList = [...editableChecklist];
    newList[catIdx].tasks.push('새로운 준비 항목 입력...');
    setEditableChecklist(newList);
  };

  const saveChecklist = async (offerId: string) => {
    setConfirmedOffers(prev => prev.map(o => o.id === offerId ? { ...o, custom_checklist: editableChecklist } : o));
    const { error } = await supabase.from('offers').update({ custom_checklist: editableChecklist }).eq('id', offerId);
    if (error) alert("저장 실패: " + error.message);
    else setEditingProjectId(null);
  };

  return (
    // 🔥 하단 여백의 범인인 flex h-screen과 main 태그를 제거하고 배경색을 통일했습니다.
    <div className="min-h-screen selection:bg-[#1D1D1F] selection:text-white">
      <header className="px-16 py-12 flex justify-between items-end bg-[#F5F5F7]/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#E5E5EA]">
        <div>
          <h2 className="text-5xl font-extrabold tracking-tighter text-[#1D1D1F]">Project Execution</h2>
          <p className="text-[#86868B] font-mono text-xs uppercase tracking-widest mt-3">Post-Contract Tasks & Readiness</p>
        </div>
      </header>
      
      <div className="px-16 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-[#86868B] font-mono text-xs uppercase tracking-widest animate-pulse">Syncing with Database...</div>
        ) : (
          <div className="space-y-6 max-w-6xl">
            {confirmedOffers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center bg-white rounded-3xl border border-[#E5E5EA] p-10 shadow-sm">
                <p className="text-4xl mb-4">🎫</p>
                <p className="text-[#1D1D1F] font-bold text-lg">아직 계약 완료된 내한공연이 없습니다.</p>
              </div>
            ) : (
              confirmedOffers.map((offer) => {
                const currentStatus = offer.checklist_status || {};
                const activeChecklist = offer.custom_checklist || defaultChecklistCategories;
                const progress = calculateProgress(currentStatus, activeChecklist);
                const isEditing = editingProjectId === offer.id;

                return (
                  <div key={offer.id} className={`bg-white rounded-3xl transition-all duration-300 ${expandedProjectId === offer.id ? 'border border-[#E5E5EA] shadow-md' : 'border border-transparent hover:border-[#E5E5EA] hover:shadow-sm'}`}>
                    <div onClick={() => !isEditing && toggleAccordion(offer.id)} className={`px-10 py-8 flex justify-between items-center group ${isEditing ? 'cursor-default' : 'cursor-pointer'}`}>
                      <div className="flex-1 grid grid-cols-[1fr,auto] items-center gap-8">
                        <div>
                          <h3 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tighter">{offer.name} <span className="font-normal text-[#86868B] text-xl ml-1">SEOUL</span></h3>
                          <p className="text-xs text-[#86868B] font-mono mt-2 uppercase tracking-widest">{offer.genre || 'TBD'} / {offer.fee || '$ -'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold tracking-widest text-[#86868B] uppercase">Readiness</span>
                            <div className="w-32 h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                                <div className="h-full bg-[#1D1D1F] rounded-full transition-all duration-500 ease-out" style={{width: `${progress}%`}}></div>
                            </div>
                            <span className="text-lg font-bold text-[#1D1D1F] font-mono w-12 text-right">{progress}%</span>
                        </div>
                      </div>
                      {!isEditing && <span className={`text-2xl text-[#D1D1D6] ml-12 transition-transform duration-300 ${expandedProjectId === offer.id ? 'rotate-180' : 'group-hover:text-[#1D1D1F]'}`}>↓</span>}
                    </div>

                    {expandedProjectId === offer.id && (
                      <div className="px-10 pb-10 pt-2 border-t border-[#E5E5EA] bg-[#F5F5F7]/30 rounded-b-3xl">
                        {!isEditing ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mt-8">
                              {activeChecklist.map((cat: any, catIdx: number) => (
                                <div key={cat.id} className="space-y-4">
                                  <h4 className="font-bold text-[11px] text-[#86868B] mb-5 uppercase tracking-widest border-b border-[#E5E5EA] pb-3">{cat.name}</h4>
                                  {cat.tasks.map((task: string, idx: number) => {
                                    const taskKey = `${cat.id}-${idx}`;
                                    const isChecked = !!currentStatus[taskKey];
                                    return (
                                      <label key={idx} className="flex items-start gap-4 p-3 pl-0 border-b border-[#E5E5EA] cursor-pointer group hover:border-[#1D1D1F] transition-colors">
                                        <input type="checkbox" checked={isChecked} onChange={() => handleToggleTask(offer.id, taskKey, currentStatus)} className="mt-1 w-5 h-5 accent-[#1D1D1F] border-[#D1D1D6] rounded-md transition-all cursor-pointer" />
                                        <span className={`text-sm transition-all ${isChecked ? 'text-[#86868B] line-through' : 'text-[#1D1D1F] group-hover:font-medium'}`}>{task}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                            <div className="mt-14 pt-8 border-t border-[#E5E5EA] flex justify-end gap-4">
                                <button onClick={() => startEditing(offer)} className="px-6 py-3.5 text-xs font-bold text-white bg-[#1D1D1F] rounded-xl hover:bg-[#434344] uppercase tracking-widest transition-colors shadow-md">Edit Process</button>
                            </div>
                          </>
                        ) : (
                          <div className="animate-in fade-in duration-300">
                            <div className="flex justify-between items-center mt-6 mb-8 border-b border-[#1D1D1F] pb-4">
                              <h3 className="text-lg font-bold text-[#1D1D1F]">프로세스 맞춤 설정 (Edit Mode)</h3>
                              <p className="text-xs text-[#86868B]">이 아티스트만을 위한 체크리스트를 구성하세요.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                              {editableChecklist.map((cat, catIdx) => (
                                <div key={cat.id} className="space-y-3 bg-white p-6 rounded-2xl border border-[#E5E5EA] shadow-sm">
                                  <h4 className="font-bold text-[11px] text-[#1D1D1F] mb-4 uppercase tracking-widest">{cat.name}</h4>
                                  {cat.tasks.map((task: string, taskIdx: number) => (
                                    <div key={taskIdx} className="flex items-center gap-2 group">
                                      <div className="text-[#D1D1D6] text-lg w-4 text-center">·</div>
                                      <input 
                                        type="text" 
                                        value={task}
                                        onChange={(e) => handleTaskTextChange(catIdx, taskIdx, e.target.value)}
                                        className="flex-1 bg-[#F5F5F7] border border-transparent hover:border-[#E5E5EA] focus:border-[#1D1D1F] focus:bg-white rounded-lg px-3 py-2 text-sm text-[#1D1D1F] outline-none transition-all"
                                      />
                                      <button onClick={() => handleRemoveTask(catIdx, taskIdx)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#86868B] hover:text-red-500 hover:bg-red-50 transition-colors">✕</button>
                                    </div>
                                  ))}
                                  <button onClick={() => handleAddTask(catIdx)} className="mt-4 w-full py-2.5 border border-dashed border-[#D1D1D6] rounded-lg text-xs font-bold text-[#86868B] hover:border-[#1D1D1F] hover:text-[#1D1D1F] transition-all">
                                    + 새로운 업무 추가하기
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="mt-14 pt-8 border-t border-[#E5E5EA] flex justify-end gap-4">
                                <button onClick={() => setEditingProjectId(null)} className="px-6 py-3.5 text-xs font-bold text-[#1D1D1F] bg-white border border-[#E5E5EA] rounded-xl hover:bg-[#F5F5F7] uppercase tracking-widest transition-colors">Cancel</button>
                                <button onClick={() => saveChecklist(offer.id)} className="px-6 py-3.5 text-xs font-bold text-white bg-[#1D1D1F] rounded-xl hover:bg-[#434344] uppercase tracking-widest transition-colors shadow-md">Save Changes</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}