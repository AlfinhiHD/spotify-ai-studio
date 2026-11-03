# Sepotifi AI Studio — Next.js App Router

Aplikasi web **AI Playlist Curator & Massive Listening DNA Analytics** berbasis **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, siap di-deploy ke **Vercel**.

## Lokasi Proyek
`D:\PERSONAL PROJECT\spotify-ai-studio`

## Menjalankan Secara Lokal
```bash
npm.cmd run dev
```
Buka: **http://127.0.0.1:5173**

## Cara Deploy ke Vercel (Production)
1. Push folder ini ke GitHub atau jalankan `npx vercel` di dalam `D:\PERSONAL PROJECT\spotify-ai-studio`.
2. Tambahkan Environment Variable di Vercel:
   - `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` = `69029b97a6c247c2a80b926be374c05c`
3. Setelah mendapatkan URL Vercel (misal `https://sepotifi-studio.vercel.app`), buka [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) -> **Settings** -> **Redirect URIs**, lalu tambahkan:
   - `https://sepotifi-studio.vercel.app/callback`
   *(tetap biarkan `http://127.0.0.1:5173/callback` agar versi lokal tetap jalan).*
