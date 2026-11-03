'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { exchangeCodeForToken } from '@/lib/spotifyAuth';
import { Loader2 } from 'lucide-react';

export default function CallbackPage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState<string>(
    'Memverifikasi otorisasi OAuth 2.0 PKCE dengan Spotify...'
  );
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    async function processCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setErrorText(`Otorisasi dibatalkan: ${error}`);
        setTimeout(() => router.replace('/'), 2500);
        return;
      }

      if (!code) {
        router.replace('/');
        return;
      }

      try {
        setStatusText('Menukarkan kode akses & menyiapkan Listening DNA kamu...');
        await exchangeCodeForToken(code);
        router.replace('/');
      } catch (err) {
        setErrorText(
          err instanceof Error
            ? err.message
            : 'Gagal memproses sesi login Spotify.'
        );
        setTimeout(() => router.replace('/'), 3000);
      }
    }
    processCallback();
  }, [router]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-2xl bg-[#121212] p-8 space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-[#1ED760]/15 text-[#1ED760] flex items-center justify-center mx-auto">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <h1 className="text-xl font-bold text-white">
          Menghubungkan ke Sepotifi AI Studio
        </h1>
        {errorText ? (
          <p className="text-sm text-rose-400">{errorText}</p>
        ) : (
          <p className="text-sm text-[#B3B3B3]">{statusText}</p>
        )}
        <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-[#1ED760] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
