'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log("로그인 시도 중...");

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        console.error("Login Error:", loginError.message);
      } else if (data.session) {
        console.log("로그인 성공! 세션 생성됨. 이동 중...");
        // 🔥 가장 확실한 방법: 새로고침을 동반한 강제 이동
        window.location.href = '/'; 
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error("Unexpected Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F7]">
      <div className="w-full max-w-[400px] p-12 bg-white rounded-[40px] shadow-2xl border border-[#E5E5EA]">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 text-center text-black">MPMG</h1>
        <p className="text-[10px] text-[#86868B] font-mono tracking-widest uppercase mb-12 text-center">Private Access Only</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="email" placeholder="Email Address" 
            className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none focus:ring-1 focus:ring-[#1D1D1F] transition-all text-black"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none focus:ring-1 focus:ring-[#1D1D1F] transition-all text-black"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-[#1D1D1F] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#434344] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authorizing...' : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
}