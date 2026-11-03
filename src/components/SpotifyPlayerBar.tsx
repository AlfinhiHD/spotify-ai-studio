'use client';

import React, { useEffect, useRef } from 'react';
import { SkipBack, SkipForward } from 'lucide-react';
import { SpotifyTrack } from '@/types/spotify';

interface SpotifyIframeController {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  addListener: (
    event: string,
    cb: (e: {
      data?: {
        position?: number;
        duration?: number;
        isPaused?: boolean;
      };
    }) => void
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: {
      createController: (
        element: HTMLElement | null,
        options: { uri: string; width?: string | number; height?: string | number },
        callback: (controller: SpotifyIframeController) => void
      ) => void;
    }) => void;
    SpotifyIframeApiInstance?: {
      createController: (
        element: HTMLElement | null,
        options: { uri: string; width?: string | number; height?: string | number },
        callback: (controller: SpotifyIframeController) => void
      ) => void;
    };
  }
}

interface Props {
  activeTrack: SpotifyTrack | null;
  playTriggerCount: number;
  onPrev: () => void;
  onNext: () => void;
  fallbackCover: string;
}

export default function SpotifyPlayerBar({
  activeTrack,
  playTriggerCount,
  onPrev,
  onNext,
}: Props) {
  const embedHostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyIframeController | null>(null);
  const lastTriggerCountRef = useRef<number>(playTriggerCount);
  const loadedTrackUriRef = useRef<string | null>(null);

  // Initialize Spotify IFrame API Controller
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const attachController = (IFrameAPI: {
      createController: (
        element: HTMLElement | null,
        options: { uri: string; width?: string | number; height?: string | number },
        callback: (controller: SpotifyIframeController) => void
      ) => void;
    }) => {
      window.SpotifyIframeApiInstance = IFrameAPI;
      if (!embedHostRef.current || controllerRef.current) return;

      const initialUri =
        activeTrack && !activeTrack.id.startsWith('demo_')
          ? activeTrack.uri
          : 'spotify:track:3xKsf9qdS1CyvXSMEid6g8';

      loadedTrackUriRef.current = initialUri;

      IFrameAPI.createController(
        embedHostRef.current,
        { uri: initialUri, width: '100%', height: 80 },
        (controller) => {
          controllerRef.current = controller;
        }
      );
    };

    if (window.SpotifyIframeApiInstance) {
      attachController(window.SpotifyIframeApiInstance);
      return;
    }

    window.onSpotifyIframeApiReady = attachController;

    const existingScript = document.getElementById('spotify-iframe-api');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'spotify-iframe-api';
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Trigger play/reload when playTriggerCount increments (Explicit user action)
  useEffect(() => {
    if (!activeTrack) return;

    if (playTriggerCount > lastTriggerCountRef.current) {
      lastTriggerCountRef.current = playTriggerCount;

      if (controllerRef.current && !activeTrack.id.startsWith('demo_')) {
        if (loadedTrackUriRef.current !== activeTrack.uri) {
          controllerRef.current.loadUri(activeTrack.uri);
          loadedTrackUriRef.current = activeTrack.uri;
        }
        controllerRef.current.play();
      }
    }
  }, [activeTrack, playTriggerCount]);

  return (
    <footer className="h-[96px] bg-black px-3 sm:px-6 flex items-center justify-center gap-2 sm:gap-4 shrink-0 border-t border-white/10 z-40 relative">
      {/* Skip to Previous Track */}
      <button
        type="button"
        onClick={onPrev}
        title="Lagu Sebelumnya"
        aria-label="Lagu Sebelumnya"
        className="w-10 h-10 rounded-full bg-[#181818] hover:bg-[#282828] text-[#B3B3B3] hover:text-[#1ED760] flex items-center justify-center transition-all shrink-0 cursor-pointer border border-white/5 shadow-md active:scale-95"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      {/* The Single Unified Spotify Audio Player */}
      <div className="flex-1 max-w-4xl h-[80px] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#181818] flex items-center justify-center">
        <div ref={embedHostRef} className="w-full h-full" />
      </div>

      {/* Skip to Next Track */}
      <button
        type="button"
        onClick={onNext}
        title="Lagu Berikutnya"
        aria-label="Lagu Berikutnya"
        className="w-10 h-10 rounded-full bg-[#181818] hover:bg-[#282828] text-[#B3B3B3] hover:text-[#1ED760] flex items-center justify-center transition-all shrink-0 cursor-pointer border border-white/5 shadow-md active:scale-95"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>
    </footer>
  );
}
