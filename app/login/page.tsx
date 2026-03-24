'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    else router.push('/'); // 로그인 성공 시 메인으로
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-[#F5F5F7]">
      <div className="w-full max-w-[400px] p-12 bg-white rounded-[40px] shadow-2xl border border-[#E5E5EA]">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 text-center">MPMG</h1>
        <p className="text-[10px] text-[#86868B] font-mono tracking-widest uppercase mb-12 text-center">Private Access Only</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="email" placeholder="Email Address" 
            className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none focus:ring-1 focus:ring-[#1D1D1F] transition-all"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none focus:ring-1 focus:ring-[#1D1D1F] transition-all"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
          <button type="submit" className="w-full py-5 bg-[#1D1D1F] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#434344] transition-all shadow-xl active:scale-[0.98]">
            Authorize Access
          </button>
        </form>
      </div>
    </div>
  );
}