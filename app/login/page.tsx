'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr'; // 🔥 최신 SSR 패키지 사용
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 브라우저용 클라이언트 생성 (환경변수 직접 참조)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        // 로그인 성공 시 세션 동기화를 위해 페이지를 새로고침하며 이동
        router.refresh();
        router.push('/');
      }
    } catch (err) {
      setError('로그인 서버와 통신 중 오류가 발생했습니다.');
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