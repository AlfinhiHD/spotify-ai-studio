'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  Check,
  Clock,
  Copy,
  Disc3,
  ExternalLink,
  Globe,
  Heart,
  KeyRound,
  Library,
  ListMusic,
  Loader2,
  Lock,
  LogOut,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Users,
  Wand2,
  X,
} from 'lucide-react';
import {
  CreatedPlaylistResult,
  EnergyPhase,
  ListeningData,
  PlaylistDraft,
  ResolvedPlaylistItem,
  SpotifyPlaylistSummary,
  SpotifyTrack,
  TimeRange,
} from '@/types/spotify';
import {
  getRedirectUri,
  getSavedClientId,
  getSavedGeminiKey,
  getValidAccessToken,
  logoutSpotify,
  saveClientId,
  saveGeminiKey,
  startSpotifyLogin,
} from '@/lib/spotifyAuth';
import {
  createSpotifyPlaylist,
  fetchAllListeningData,
  fetchAllUserPlaylists,
  fetchPlaylistTracks,
  resolveCandidatesInParallel,
  searchTracksLive,
  updateSpotifyPlaylist,
} from '@/lib/spotifyApi';
import {
  arrangeTracksByEnergyFlow,
  cleanPromptText,
  enhancePromptWithGemini,
  generateAestheticTitle,
  generateGeminiCuratedPlan,
  generateSmartCuratedPlan,
  parseCustomTrackLines,
  VIBE_PRESETS,
} from '@/lib/playlistCurator';
import { DEMO_LISTENING_DATA, resolveCandidatesDemo } from '@/lib/demoData';
import SpotifyPlayerBar from '@/components/SpotifyPlayerBar';
import ListeningDnaView from '@/components/ListeningDnaView';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function buildInitialDemoDraft(presetId = VIBE_PRESETS[0].id): PlaylistDraft {
  const preset = VIBE_PRESETS.find((p) => p.id === presetId) || VIBE_PRESETS[0];
  const plan = generateSmartCuratedPlan(
    preset.prompt,
    DEMO_LISTENING_DATA,
    true,
    preset.id
  );
  const resolved = resolveCandidatesDemo(plan.candidates);
  return {
    name: plan.name,
    description: plan.description,
    isPublic: false,
    prompt: preset.prompt,
    items: resolved.items,
    skipped: resolved.skipped,
    curationSource: 'smart-spotify',
    coverUrl: preset.image,
  };
}

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [listeningData, setListeningData] =
    useState<ListeningData>(DEMO_LISTENING_DATA);
  const [initialSyncing, setInitialSyncing] = useState<boolean>(true);

  // Studio Navigation State (3 distinct explicit flows)
  const [activeView, setActiveView] = useState<'create' | 'library' | 'dna'>('create');
  const [sidebarTab, setSidebarTab] = useState<
    'presets' | 'artists' | 'recent' | 'playlists'
  >('presets');
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
  const [phaseFilter, setPhaseFilter] = useState<'ALL' | EnergyPhase>('ALL');

  // AI Library Studio Specific State
  const [selectedLibraryPlaylist, setSelectedLibraryPlaylist] =
    useState<SpotifyPlaylistSummary | null>(null);
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [loadingLibraryTracks, setLoadingLibraryTracks] =
    useState<boolean>(false);

  // Settings & Credentials State
  const [clientId, setClientId] = useState<string>(() => getSavedClientId());
  const [geminiKey, setGeminiKey] = useState<string>(() => getSavedGeminiKey());
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copiedUri, setCopiedUri] = useState<boolean>(false);

  // AI DJ Composer State
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
    VIBE_PRESETS[0].id
  );
  const [prompt, setPrompt] = useState<string>(VIBE_PRESETS[0].prompt);
  const [curationMode, setCurationMode] = useState<
    'smart-spotify' | 'gemini' | 'custom-list'
  >('gemini');
  const [customTrackText, setCustomTrackText] = useState<string>(
    "Hindia - Evaluasi\nNIKI - lowkey\nHONNE - la la la that's how it goes\nRex Orange County - Pluto Projector\nLANY - Malibu Nights\nMen I Trust - Show Me How"
  );
  const [useListeningTaste, setUseListeningTaste] = useState<boolean>(true);
  const [tasteBlendMode, setTasteBlendMode] = useState<'balanced' | 'discovery'>('balanced');
  const [trackCount, setTrackCount] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<string>('');
  const [searchProgress, setSearchProgress] = useState<{
    done: number;
    total: number;
  }>({ done: 0, total: 0 });

  // Active Draft & Playback State
  const [draft, setDraft] = useState<PlaylistDraft>(() =>
    buildInitialDemoDraft(VIBE_PRESETS[0].id)
  );
  const [curationNotice, setCurationNotice] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<SpotifyTrack | null>(
    () => DEMO_LISTENING_DATA.topTracks.short_term[0] || null
  );
  const [playTriggerCount, setPlayTriggerCount] = useState<number>(0);

  // Live Catalog Search & Save State
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
  const [liveSearchResults, setLiveSearchResults] = useState<SpotifyTrack[]>([]);
  const [searchingLive, setSearchingLive] = useState<boolean>(false);
  const [isSavingPlaylist, setIsSavingPlaylist] = useState<boolean>(false);
  const [createdResult, setCreatedResult] =
    useState<CreatedPlaylistResult | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Check existing OAuth token on mount
  useEffect(() => {
    async function loadSession() {
      setInitialSyncing(true);
      try {
        const existingToken = await getValidAccessToken();
        if (existingToken) {
          const data = await fetchAllListeningData(existingToken);
          setToken(existingToken);
          setIsDemo(false);
          setListeningData(data);

          if (data.playlistWarning) {
            notify(
              `Playlist Spotify gagal dimuat (${data.playlistWarning}). Coba Logout & Login ulang.`
            );
          }

          if (data.currentlyPlaying?.item) {
            setActiveTrack(data.currentlyPlaying.item);
          } else if (data.topTracks.short_term[0]) {
            setActiveTrack(data.topTracks.short_term[0]);
          }

          // Automatically curate initial playlist blending user's real top tracks
          const initialPlan = generateSmartCuratedPlan(
            VIBE_PRESETS[0].prompt,
            data,
            true,
            VIBE_PRESETS[0].id
          );
          const resolved = await resolveCandidatesInParallel(
            existingToken,
            initialPlan.candidates
          );
          if (resolved.items.length > 0) {
            setDraft({
              name: initialPlan.name,
              description: initialPlan.description,
              isPublic: false,
              prompt: VIBE_PRESETS[0].prompt,
              items: resolved.items,
              skipped: resolved.skipped,
              curationSource: 'smart-spotify',
              coverUrl: VIBE_PRESETS[0].image,
            });
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/401|403|forbidden|expired/i.test(msg)) {
          notify(
            'Sesi Spotify ditolak (401/403). Pastikan akun terdaftar di Spotify Dashboard atau Login ulang.'
          );
        } else {
          notify(`Gagal sinkronisasi Spotify: ${msg}`);
        }
      } finally {
        setInitialSyncing(false);
      }
    }
    loadSession();
  }, []);

  const filteredItems = useMemo(() => {
    if (phaseFilter === 'ALL') return draft.items;
    return draft.items.filter((i) => i.candidate.phase === phaseFilter);
  }, [draft.items, phaseFilter]);

  const totalDraftDurationMs = useMemo(() => {
    return draft.items.reduce((acc, item) => acc + item.track.duration_ms, 0);
  }, [draft]);

  const playlistCoverUrl =
    draft.coverUrl ||
    draft.items[0]?.track.album.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80';

  const filteredPlaylists = useMemo(() => {
    if (!librarySearchQuery.trim()) return listeningData.playlists;
    const q = librarySearchQuery.toLowerCase();
    return listeningData.playlists.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
  }, [listeningData.playlists, librarySearchQuery]);

  const handleConnectSpotify = async () => {
    try {
      await startSpotifyLogin(clientId);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Gagal memulai login.');
    }
  };

  const handleLogout = () => {
    logoutSpotify();
    setToken(null);
    setIsDemo(true);
    setListeningData(DEMO_LISTENING_DATA);
    setDraft(buildInitialDemoDraft(VIBE_PRESETS[0].id));
    setSelectedLibraryPlaylist(null);
    setCreatedResult(null);
    notify('Sesi diputus — kembali ke Mode Pratinjau.');
  };

  const handleRefreshData = async () => {
    if (!token || isDemo) {
      handleConnectSpotify();
      return;
    }
    setInitialSyncing(true);
    try {
      const data = await fetchAllListeningData(token);
      setListeningData(data);
      if (data.playlistWarning) {
        notify(
          `Data DNA dimuat, tapi playlist gagal (${data.playlistWarning}).`
        );
      } else {
        notify('Data Listening DNA & Library Playlist berhasil diperbarui!');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Gagal memuat ulang data.');
    } finally {
      setInitialSyncing(false);
    }
  };

  const refreshLibraryPlaylists = async (activeToken: string, userId?: string) => {
    try {
      const freshPlaylists = await fetchAllUserPlaylists(activeToken, userId);
      setListeningData((prev) => {
        const likedEntry = prev.playlists.find((p) => p.id === 'liked-songs');
        return {
          ...prev,
          playlists: likedEntry ? [likedEntry, ...freshPlaylists] : freshPlaylists,
          playlistWarning: undefined,
        };
      });
    } catch {
      // Non-fatal background refresh
    }
  };

  const handleExportListeningJson = () => {
    const blob = new Blob([JSON.stringify(listeningData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spotify-listening-dna-${listeningData.profile.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('File JSON Listening DNA berhasil diunduh.');
  };

  const runPlaylistGenerator = async (
    overridePrompt?: string,
    overridePresetId?: string
  ) => {
    const targetPrompt = overridePrompt ?? prompt;
    const targetPresetId =
      overridePrompt !== undefined ? overridePresetId : selectedPresetId;

    setIsGenerating(true);
    setCreatedResult(null);
    setCurationNotice(null);
    setPhaseFilter('ALL');
    setSearchProgress({ done: 0, total: 0 });
    setActiveView('create');

    try {
      let plan: {
        name: string;
        description: string;
        candidates: ReturnType<typeof parseCustomTrackLines>;
        usedFallback?: boolean;
        modelUsed?: string;
        warning?: string;
      };
      let activeSource: 'gemini' | 'smart-spotify' | 'custom-list' = curationMode;

      const effectiveKey =
        geminiKey.trim() ||
        process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
        '';

      if (curationMode === 'custom-list' && !overridePrompt) {
        setPipelineStage('Menganalisis daftar lagu manual & merancang Energy Arc...');
        const candidates = parseCustomTrackLines(customTrackText);
        if (!candidates.length) {
          throw new Error('Format baris: Nama Artis - Judul Lagu');
        }
        activeSource = 'custom-list';
        plan = {
          name: 'Custom Curated Mix',
          description: 'Disusun dengan Sepotifi AI Studio.',
          candidates,
        };
      } else if (curationMode === 'gemini' || (overridePrompt !== undefined && !targetPresetId && effectiveKey)) {
        if (!effectiveKey) {
          setShowSettings(true);
          throw new Error(
            'Masukkan Gemini API Key di Pengaturan atau gunakan mode Smart Rule.'
          );
        }

        // Check if user prompt references an existing playlist in their Spotify library
        let referencedPlaylistContext = '';
        if (listeningData?.playlists && token && !isDemo && targetPrompt.trim()) {
          const cleanPromptLower = targetPrompt.toLowerCase();
          const matchedPl = listeningData.playlists.find((p) => {
            const plNameLower = p.name.trim().toLowerCase();
            if (p.id === 'liked-songs') {
              return /liked songs|lagu yang disukai|koleksi favorit/i.test(cleanPromptLower);
            }
            return (
              plNameLower.length >= 3 &&
              !p.id.startsWith('demo-') &&
              cleanPromptLower.includes(plNameLower)
            );
          });

          if (matchedPl) {
            setPipelineStage(
              `Membaca lagu dari playlist library "${matchedPl.name}"...`
            );
            try {
              const plTracks = await fetchPlaylistTracks(
                token,
                matchedPl.id,
                matchedPl.name
              );
              if (plTracks.length > 0) {
                const sampleTracks = plTracks
                  .slice(0, 18)
                  .map((t) => `"${t.name}" by ${t.artists[0]?.name}`)
                  .join(', ');
                referencedPlaylistContext = `The user specifically asked for a playlist related/connected to their existing Spotify playlist: "${matchedPl.name}".
Tracks currently inside "${matchedPl.name}": [${sampleTracks}].
CRITICAL REQUIREMENT: Match the exact sonic universe, emotional texture, instrumentals, and subgenre of these tracks. Curate complementary tracks that sound like an authentic companion mix to "${matchedPl.name}".`;
              }
            } catch {
              // Non-fatal
            }
          }
        }

        setPipelineStage(`Gemini AI DJ sedang meracik ${trackCount} lagu & alur energi...`);
        plan = await generateGeminiCuratedPlan(
          effectiveKey,
          targetPrompt,
          listeningData,
          useListeningTaste,
          trackCount,
          tasteBlendMode,
          referencedPlaylistContext
        );
        activeSource = plan.usedFallback ? 'smart-spotify' : 'gemini';
        if (plan.usedFallback && plan.warning) {
          setCurationNotice(
            `Gemini gagal (${plan.warning}) — sementara memakai Smart Rule offline.`
          );
        }
      } else {
        activeSource = 'smart-spotify';
        setPipelineStage(
          'Smart Curator sedang memadukan tema dengan Listening DNA kamu...'
        );
        plan = generateSmartCuratedPlan(
          targetPrompt,
          listeningData,
          useListeningTaste,
          targetPresetId,
          trackCount
        );
      }

      setPipelineStage('Mencari & memvalidasi lagu secara paralel di Spotify...');
      setSearchProgress({ done: 0, total: plan.candidates.length });

      const resolved =
        isDemo || !token
          ? resolveCandidatesDemo(plan.candidates)
          : await resolveCandidatesInParallel(
              token,
              plan.candidates,
              (done, total) => setSearchProgress({ done, total }),
              trackCount
            );

      const rawItems =
        resolved.items.length > 0
          ? resolved.items
          : resolveCandidatesDemo(plan.candidates).items;
      const finalItems = rawItems.slice(0, trackCount);

      const targetPreset = VIBE_PRESETS.find((p) => p.id === targetPresetId);

      setDraft({
        name: plan.name,
        description: plan.description,
        isPublic: false,
        prompt: targetPrompt,
        items: finalItems,
        skipped: resolved.skipped,
        curationSource: activeSource,
        coverUrl: targetPreset?.image || finalItems[0]?.track.album.images?.[0]?.url,
      });

      if (finalItems[0]?.track) {
        setActiveTrack(finalItems[0].track);
      }
      if (plan.usedFallback && plan.warning) {
        notify(`Gemini bermasalah (${plan.warning}) — fallback ke Smart Rule.`);
      } else {
        notify(
          `Playlist "${plan.name}" (${finalItems.length} lagu${
            plan.modelUsed ? ` • ${plan.modelUsed}` : ''
          }) siap!`
        );
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Gagal menyusun playlist.');
    } finally {
      setIsGenerating(false);
      setPipelineStage('');
    }
  };

  const handleSaveToSpotify = async () => {
    if (!draft.items.length) return;
    if (isDemo || !token) {
      handleConnectSpotify();
      return;
    }
    setIsSavingPlaylist(true);
    try {
      const result = await createSpotifyPlaylist(
        token,
        draft,
        listeningData.profile.id
      );
      setCreatedResult(result);
      await refreshLibraryPlaylists(token, listeningData.profile.id);
      notify(`Tersimpan sebagai playlist baru: "${result.name}"`);
    } catch (err) {
      notify(
        err instanceof Error ? err.message : 'Gagal menyimpan ke Spotify.'
      );
    } finally {
      setIsSavingPlaylist(false);
    }
  };

  const handleUpdateExistingPlaylist = async () => {
    if (!draft.items.length || !draft.originalPlaylistId) return;
    if (isDemo || !token) {
      handleConnectSpotify();
      return;
    }
    setIsSavingPlaylist(true);
    try {
      const result = await updateSpotifyPlaylist(
        token,
        draft.originalPlaylistId,
        draft
      );
      setCreatedResult(result);
      setSelectedLibraryPlaylist((prev) =>
        prev && prev.id === result.id
          ? {
              ...prev,
              name: draft.name,
              description: draft.description,
              public: draft.isPublic,
              tracks: { total: result.trackCount },
            }
          : prev
      );
      await refreshLibraryPlaylists(token, listeningData.profile.id);
      notify(`Playlist asli "${result.name}" berhasil diperbarui!`);
    } catch (err) {
      notify(
        err instanceof Error ? err.message : 'Gagal memperbarui playlist Spotify.'
      );
    } finally {
      setIsSavingPlaylist(false);
    }
  };

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveSearchQuery.trim()) return;
    if (isDemo || !token) {
      notify('Hubungkan akun Spotify untuk mencari di katalog penuh Spotify.');
      return;
    }
    setSearchingLive(true);
    try {
      const tracks = await searchTracksLive(token, liveSearchQuery);
      setLiveSearchResults(tracks);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Gagal mencari lagu.');
    } finally {
      setSearchingLive(false);
    }
  };

  const handleAddTrackToDraft = (track: SpotifyTrack) => {
    if (draft.items.some((i) => i.track.id === track.id)) {
      notify('Lagu sudah ada di dalam playlist.');
      return;
    }
    setDraft({
      ...draft,
      items: [
        ...draft.items,
        {
          candidate: {
            artist: track.artists.map((a) => a.name).join(', '),
            title: track.name,
            phase: 'Groove',
            reason: 'Ditambahkan lewat pencarian',
          },
          track,
        },
      ],
    });
    notify(`Ditambahkan: ${track.name}`);
  };

  const handleEnhancePrompt = async () => {
    const raw = prompt.trim();
    if (!raw || isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);
    try {
      const effectiveKey =
        geminiKey.trim() || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      const enhanced = await enhancePromptWithGemini(
        effectiveKey,
        raw,
        listeningData
      );
      setPrompt(enhanced.refinedPrompt);
      setDraft((prev) => ({
        ...prev,
        name: enhanced.suggestedTitle,
        prompt: enhanced.refinedPrompt,
      }));
      if (enhanced.usedFallback) {
        notify(
          `Gemini belum merespons (${enhanced.warning || 'fallback lokal'}) — memakai template prompt.`
        );
      } else {
        notify('Prompt berhasil diperkaya & dirapikan oleh Gemini AI!');
      }
    } catch {
      notify('Gagal menyempurnakan prompt.');
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Open & Recreate an existing Spotify Playlist in AI Library Studio
  const handleOpenLibraryPlaylist = async (pl: SpotifyPlaylistSummary) => {
    setSelectedLibraryPlaylist(pl);
    setActiveView('library');
    setCreatedResult(null);
    setPhaseFilter('ALL');
    const isDemoPlaylist =
      pl.id.startsWith('demo-') || pl.id === 'pl1' || pl.id === 'pl2';
    if ((!token || isDemo) && !isDemoPlaylist) {
      notify('Hubungkan akun Spotify untuk memuat lagu asli dari playlist ini.');
      return;
    }
    setLoadingLibraryTracks(true);
    notify(`Memuat lagu dari "${pl.name}"...`);
    try {
      const tracks = await fetchPlaylistTracks(token || '', pl.id, pl.name);
      if (tracks.length > 0) {
        setListeningData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            playlists: prev.playlists.map((p) =>
              p.id === pl.id ? { ...p, tracks: { total: tracks.length } } : p
            ),
          };
        });
      }
      const items: ResolvedPlaylistItem[] = tracks.map((track, idx) => ({
        candidate: {
          artist: track.artists[0]?.name || 'Artist',
          title: track.name,
          phase:
            idx < tracks.length * 0.22
              ? 'Warmup'
              : idx < tracks.length * 0.55
              ? 'Groove'
              : idx < tracks.length * 0.8
              ? 'Peak'
              : 'Cooldown',
          reason: 'Urutan asli di playlist Spotify kamu',
        },
        track,
      }));
      setDraft({
        name: pl.name,
        description:
          pl.description || 'Disusun dengan Sepotifi AI Studio.',
        isPublic: Boolean(pl.public),
        prompt: `Disusun ulang dari playlist: ${pl.name}`,
        items,
        skipped: [],
        curationSource: 'smart-spotify',
        coverUrl: pl.images?.[0]?.url,
        originalPlaylistId: pl.id,
      });
      if (tracks[0]) setActiveTrack(tracks[0]);
      if (tracks.length === 0) {
        notify(`Playlist "${pl.name}" masih kosong — kamu bisa tambah lagu di sini lalu simpan!`);
      } else {
        notify(`"${pl.name}" (${tracks.length} lagu asli) siap diatur!`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/403|scope|forbidden/i.test(msg)) {
        notify(
          'Akses playlist ditolak Spotify (403). Pastikan playlist ini milikmu / akun terdaftar di Dashboard, atau Logout & Login ulang.'
        );
      } else {
        notify(`Gagal memuat lagu: ${msg}`);
      }
    } finally {
      setLoadingLibraryTracks(false);
    }
  };

  const handleAiArrangeFlow = () => {
    if (!draft.items.length) return;
    const currentTracks = draft.items.map((i) => i.track);
    const reordered = arrangeTracksByEnergyFlow(currentTracks);
    setDraft((prev) => ({
      ...prev,
      items: reordered,
    }));
    notify(
      'Alur lagu berhasil disusun ke 4 fase energi (Warmup → Groove → Peak → Cooldown)!'
    );
  };

  const handleRemixLibraryPlaylist = () => {
    if (!draft.items.length) return;
    const topArtists = Array.from(
      new Set(draft.items.slice(0, 5).map((i) => i.candidate.artist))
    ).join(', ');
    const remixPrompt = `Remix dan kurasi lagu baru dengan tema seperti "${draft.name}", menghadirkan artis sejenis ${topArtists}`;
    setPrompt(remixPrompt);
    setSelectedPresetId(undefined);
    setActiveView('create');
    runPlaylistGenerator(remixPrompt, undefined);
  };

  const handleRemixWithPrompt = () => {
    const topArtists = Array.from(
      new Set(draft.items.slice(0, 4).map((i) => i.candidate.artist))
    ).join(', ');
    const remixPrompt = `Remix dan perbarui playlist "${draft.name}" dengan soundscape lebih segar, menghadirkan nuansa sejenis ${topArtists}`;
    setPrompt(remixPrompt);
    setSelectedPresetId(undefined);
    setActiveView('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notify('Prompt remix disiapkan di composer!');
  };

  const handleRemoveTrackFromDraft = (trackId: string) => {
    setDraft({
      ...draft,
      items: draft.items.filter((item) => item.track.id !== trackId),
    });
  };

  const handleMoveTrack = (trackId: string, direction: 'up' | 'down') => {
    setDraft((prev) => {
      const idx = prev.items.findIndex((i) => i.track.id === trackId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.items.length) return prev;
      const nextItems = [...prev.items];
      const [moved] = nextItems.splice(idx, 1);
      nextItems.splice(targetIdx, 0, moved);
      return { ...prev, items: nextItems };
    });
  };

  const handlePlayTrack = (track: SpotifyTrack) => {
    setActiveTrack(track);
    setPlayTriggerCount((c) => c + 1);
  };

  const handleCopyRedirectUri = () => {
    navigator.clipboard.writeText(getRedirectUri());
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const canEditOriginalPlaylist = Boolean(
    !isDemo &&
      token &&
      draft.originalPlaylistId &&
      draft.originalPlaylistId !== 'liked-songs' &&
      !draft.originalPlaylistId.startsWith('demo-') &&
      draft.originalPlaylistId !== 'pl1' &&
      draft.originalPlaylistId !== 'pl2' &&
      (!selectedLibraryPlaylist?.owner?.id ||
        selectedLibraryPlaylist.owner.id === listeningData.profile.id ||
        selectedLibraryPlaylist.collaborative)
  );

  const createdResultBanner = createdResult ? (
    <section className="rounded-2xl bg-[#181818] p-5 space-y-3 border border-[#1ED760]/40 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase text-[#1ED760]">
            Tersimpan di Akun Spotify Kamu
          </div>
          <h3 className="text-lg font-bold text-white">
            {createdResult.name} ({createdResult.trackCount} lagu)
          </h3>
        </div>
        <a
          href={createdResult.url}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2 rounded-full bg-[#1ED760] hover:bg-[#3BE477] text-black font-bold text-xs flex items-center gap-1.5"
        >
          <span>Buka di Aplikasi Spotify</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  ) : null;

  const renderTrackRowActions = (track: SpotifyTrack, index: number) => (
    <div
      className="flex items-center justify-end gap-1.5 text-xs font-mono text-[#B3B3B3]"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="group-hover:hidden">
        {formatDuration(track.duration_ms)}
      </span>
      <div className="hidden group-hover:flex items-center gap-0.5">
        {phaseFilter === 'ALL' && (
          <>
            <button
              type="button"
              disabled={index === 0}
              onClick={() => handleMoveTrack(track.id, 'up')}
              title="Geser lagu ke atas"
              className="p-1 text-[#B3B3B3] hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === draft.items.length - 1}
              onClick={() => handleMoveTrack(track.id, 'down')}
              title="Geser lagu ke bawah"
              className="p-1 text-[#B3B3B3] hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        <a
          href={
            track.external_urls?.spotify ||
            `https://open.spotify.com/track/${track.id}`
          }
          target="_blank"
          rel="noreferrer"
          title="Buka di Spotify"
          className="p-1 text-[#B3B3B3] hover:text-white"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          type="button"
          onClick={() => handleRemoveTrackFromDraft(track.id)}
          title="Hapus dari playlist"
          className="p-1 text-[#B3B3B3] hover:text-rose-400 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden select-none">
      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#1ED760] text-black text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-3">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-black/70 hover:text-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN STUDIO WORKSPACE (LEFT RAIL + MAIN CANVAS) */}
      <div className="flex-1 flex gap-2.5 p-2.5 overflow-hidden min-h-0">
        {/* LEFT NAVIGATION RAIL */}
        <aside className="w-[280px] lg:w-[310px] bg-[#121212] rounded-xl hidden md:flex flex-col justify-between p-4 shrink-0">
          <div className="space-y-5 overflow-y-auto pr-1">
            {/* Brand Header */}
            <div className="flex items-center justify-between px-1 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#1ED760] text-black flex items-center justify-center">
                  <Disc3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-base tracking-tight text-white">
                    Sepotifi Studio
                  </div>
                  <div className="text-xs text-[#B3B3B3]">
                    AI Curator & DNA Analytics
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                title="Pengaturan & Multi-User"
                className="p-2 rounded-full bg-[#181818] hover:bg-[#282828] text-[#B3B3B3] hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Workspace Navigation (3 Distinct Modes) */}
            <div className="space-y-1">
              <div className="px-1 pb-1 text-xs font-bold uppercase tracking-wider text-[#727272]">
                Workspace Utama
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveView('create');
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors cursor-pointer ${
                  activeView === 'create'
                    ? 'bg-[#1ED760] text-black shadow-md'
                    : 'text-[#B3B3B3] hover:bg-[#181818] hover:text-white'
                }`}
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Creator (Buat Baru)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView('library');
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors cursor-pointer ${
                  activeView === 'library'
                    ? 'bg-[#1ED760] text-black shadow-md'
                    : 'text-[#B3B3B3] hover:bg-[#181818] hover:text-white'
                }`}
              >
                <Library className="w-4 h-4" />
                <span>AI Library Studio</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('dna')}
                className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors cursor-pointer ${
                  activeView === 'dna'
                    ? 'bg-[#1ED760] text-black shadow-md'
                    : 'text-[#B3B3B3] hover:bg-[#181818] hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Listening DNA Massive</span>
              </button>
            </div>

            {/* Library / Koleksi Section with Visual Tabs */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#727272]">
                  Koleksi & Eksplorasi
                </span>
                <span className="text-[11px] text-[#1ED760] font-semibold">
                  {sidebarTab === 'presets' && `${VIBE_PRESETS.length} Presets`}
                  {sidebarTab === 'artists' && `${listeningData.topArtists.short_term.length} Artis`}
                  {sidebarTab === 'recent' && `${listeningData.recentlyPlayed.length} Diputar`}
                  {sidebarTab === 'playlists' && `${listeningData.playlists.length} Playlist`}
                </span>
              </div>

              {/* 4 Category Filter Pills */}
              <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-xl">
                {[
                  { key: 'presets', label: 'Preset' },
                  { key: 'artists', label: 'Artis' },
                  { key: 'recent', label: 'Recent' },
                  { key: 'playlists', label: 'Library' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSidebarTab(tab.key as any)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer truncate ${
                      sidebarTab === tab.key
                        ? 'bg-[#282828] text-white shadow-sm'
                        : 'text-[#888888] hover:text-[#D4D4D4]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content with Rich Visual Image Cards */}
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {sidebarTab === 'presets' &&
                  VIBE_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(preset.id);
                          setPrompt(preset.prompt);
                          setActiveView('create');
                          runPlaylistGenerator(preset.prompt, preset.id);
                        }}
                        className={`w-full p-2 rounded-xl flex items-center gap-3 text-left transition-all group cursor-pointer ${
                          isSelected
                            ? 'bg-[#242424] ring-1 ring-[#1ED760]/40'
                            : 'hover:bg-[#181818]'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                          <img
                            src={preset.image}
                            alt={preset.label}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          />
                          <div
                            className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                              isSelected ? '!opacity-100 bg-[#1ED760]/30' : ''
                            }`}
                          >
                            <Play className="w-4 h-4 fill-white text-white drop-shadow" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-[#1ED760]' : 'text-white'
                            }`}
                          >
                            {preset.label}
                          </div>
                          <div className="text-[11px] text-[#B3B3B3] truncate mt-0.5">
                            {preset.badge}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                {sidebarTab === 'artists' && (
                  <>
                    {(listeningData.topArtists.short_term.length > 0
                      ? listeningData.topArtists.short_term
                      : DEMO_LISTENING_DATA.topArtists.short_term
                    )
                      .slice(0, 15)
                      .map((artist, idx) => (
                        <button
                          key={artist.id}
                          type="button"
                          onClick={() => {
                            setSelectedPresetId(undefined);
                            const newPrompt = `Kurasi playlist dengan nuansa dan vokal seperti musik ${artist.name}, padukan dengan genre ${artist.genres?.[0] || 'indie pop'} terbaik`;
                            setPrompt(newPrompt);
                            setActiveView('create');
                            runPlaylistGenerator(newPrompt, undefined);
                          }}
                          className="w-full p-2 rounded-xl flex items-center gap-3 text-left hover:bg-[#181818] transition-colors group cursor-pointer"
                        >
                          <img
                            src={
                              artist.images?.[0]?.url ||
                              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={artist.name}
                            className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-white/10 group-hover:ring-[#1ED760] transition-all shadow-md"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white group-hover:text-[#1ED760] truncate transition-colors">
                              {artist.name}
                            </div>
                            <div className="text-[11px] text-[#888888] truncate">
                              #{idx + 1} Top Artist • {artist.genres?.[0] || 'Pop'}
                            </div>
                          </div>
                        </button>
                      ))}
                  </>
                )}

                {sidebarTab === 'recent' && (
                  <>
                    {(listeningData.recentlyPlayed.length > 0
                      ? listeningData.recentlyPlayed
                      : DEMO_LISTENING_DATA.recentlyPlayed
                    )
                      .slice(0, 20)
                      .map((item, idx) => {
                        const track = item.track;
                        const isCurrent = activeTrack?.id === track.id;
                        return (
                          <div
                            key={`${track.id}-${idx}`}
                            onClick={() => handlePlayTrack(track)}
                            className={`w-full p-2 rounded-xl flex items-center gap-3 text-left transition-colors group cursor-pointer ${
                              isCurrent ? 'bg-[#242424]' : 'hover:bg-[#181818]'
                            }`}
                          >
                            <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0 shadow">
                              <img
                                src={
                                  track.album.images?.[0]?.url ||
                                  playlistCoverUrl
                                }
                                alt={track.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-4 h-4 fill-white text-white drop-shadow" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className={`text-xs font-bold truncate ${
                                  isCurrent ? 'text-[#1ED760]' : 'text-white'
                                }`}
                              >
                                {track.name}
                              </div>
                              <div className="text-[11px] text-[#888888] truncate">
                                {track.artists.map((a) => a.name).join(', ')}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}

                {sidebarTab === 'playlists' && (
                  <div className="space-y-2">
                    {/* Active Draft */}
                    <div
                      onClick={() =>
                        setActiveView(
                          draft.originalPlaylistId ? 'library' : 'create'
                        )
                      }
                      className="p-2.5 rounded-xl bg-[#242424] ring-1 ring-[#1ED760]/30 cursor-pointer flex items-center gap-3"
                    >
                      <img
                        src={playlistCoverUrl}
                        alt={draft.name}
                        className="w-12 h-12 rounded-lg object-cover shadow shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-[#1ED760] uppercase">
                          Draft Sedang Aktif
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {draft.name}
                        </div>
                        <div className="text-[11px] text-[#888888]">
                          {draft.items.length} Lagu Disusun
                        </div>
                      </div>
                    </div>

                    {/* User's existing Spotify Playlists */}
                    {listeningData.playlists.slice(0, 30).map((pl) => (
                      <div
                        key={pl.id}
                        onClick={() => handleOpenLibraryPlaylist(pl)}
                        className="p-2 rounded-xl hover:bg-[#181818] flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={pl.images?.[0]?.url || playlistCoverUrl}
                            alt={pl.name}
                            className="w-11 h-11 rounded-lg object-cover shrink-0 shadow"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white group-hover:text-[#1ED760] truncate transition-colors">
                              {pl.name}
                            </div>
                            <div className="text-[11px] text-[#888888] truncate">
                              {pl.tracks?.total ? `${pl.tracks.total} lagu` : '0 lagu (kosong)'} • Klik atur AI
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLibraryPlaylist(pl);
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#242424] hover:bg-[#1ED760] hover:text-black text-[10px] font-bold text-[#B3B3B3] shrink-0 transition-colors cursor-pointer"
                        >
                          Tata
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Account Card */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            {isDemo ? (
              <div className="p-3.5 rounded-xl bg-[#181818] space-y-2.5">
                <div className="text-xs font-bold text-white">
                  Mode Pratinjau Aktif
                </div>
                <p className="text-xs text-[#B3B3B3]">
                  Login untuk memuat Top Artists, Recently Played & menyimpan
                  playlist ke Spotify kamu.
                </p>
                <button
                  type="button"
                  onClick={handleConnectSpotify}
                  className="w-full py-2.5 rounded-full bg-[#1ED760] hover:bg-[#3BE477] text-black font-bold text-xs transition-colors cursor-pointer"
                >
                  Log in dengan Spotify
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#181818] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={
                      listeningData.profile.images?.[0]?.url || playlistCoverUrl
                    }
                    alt={listeningData.profile.display_name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {listeningData.profile.display_name}
                    </div>
                    <div className="text-xs text-[#1ED760] truncate">
                      Spotify Connected
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-2 rounded-full hover:bg-[#282828] text-[#B3B3B3] hover:text-white cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN SCROLLABLE STUDIO VIEWPORT */}
        <main className="flex-1 bg-[#121212] rounded-xl overflow-y-auto p-4 sm:p-6 lg:p-8 relative min-w-0">
          {/* Mobile Top Navigation Bar */}
          <div className="flex md:hidden items-center justify-between gap-2 mb-5 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1ED760] text-black flex items-center justify-center">
                <Disc3 className="w-4 h-4" />
              </div>
              <span className="font-black text-sm">Sepotifi Studio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveView('create')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  activeView === 'create'
                    ? 'bg-[#1ED760] text-black'
                    : 'bg-[#242424] text-white'
                }`}
              >
                AI Creator
              </button>
              <button
                type="button"
                onClick={() => setActiveView('library')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  activeView === 'library'
                    ? 'bg-[#1ED760] text-black'
                    : 'bg-[#242424] text-white'
                }`}
              >
                Library
              </button>
              <button
                type="button"
                onClick={() => setActiveView('dna')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  activeView === 'dna'
                    ? 'bg-[#1ED760] text-black'
                    : 'bg-[#242424] text-white'
                }`}
              >
                DNA
              </button>
              {isDemo && (
                <button
                  type="button"
                  onClick={handleConnectSpotify}
                  className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-bold"
                >
                  Log in
                </button>
              )}
            </div>
          </div>

          {/* Initial Sync Shimmer Skeleton */}
          {initialSyncing ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#181818] flex items-center gap-4">
                <Loader2 className="w-6 h-6 text-[#1ED760] animate-spin shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">
                    Menyinkronkan Data Spotify & Meracik Studio...
                  </div>
                  <div className="text-xs text-[#B3B3B3]">
                    Mengambil Top Artists, Top Tracks, dan riwayat playlist langsung dari Spotify
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5 h-64 rounded-2xl skeleton-shimmer" />
                <div className="lg:col-span-7 h-64 rounded-2xl skeleton-shimmer" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-14 rounded-xl skeleton-shimmer w-full"
                  />
                ))}
              </div>
            </div>
          ) : activeView === 'dna' ? (
            <ListeningDnaView
              listeningData={listeningData}
              timeRange={timeRange}
              onChangeTimeRange={setTimeRange}
              onRefresh={handleRefreshData}
              onExportJson={handleExportListeningJson}
              onPlayTrack={handlePlayTrack}
              onSeedPrompt={(customPrompt) => {
                setSelectedPresetId(undefined);
                setPrompt(customPrompt);
                setActiveView('create');
                runPlaylistGenerator(customPrompt, undefined);
              }}
              fallbackCover={playlistCoverUrl}
            />
          ) : activeView === 'library' ? (
            /* FLOW 2: AI LIBRARY STUDIO (TATA & RECREATE PLAYLIST LAMA) */
            <div className="space-y-6 pb-10">
              {isDemo || !token ? (
                <div className="rounded-2xl bg-[#181818] p-8 sm:p-12 text-center max-w-xl mx-auto my-10 space-y-5 border border-white/10 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-[#1ED760]/20 text-[#1ED760] mx-auto flex items-center justify-center">
                    <Library className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      AI Library Studio // Playlist Asli Kamu
                    </h2>
                    <p className="text-xs sm:text-sm text-[#B3B3B3] mt-2 leading-relaxed">
                      Hubungkan akun Spotify kamu untuk membuka seluruh playlist, koleksi Liked Songs, serta menyusun ulang urutan energinya (AI Flow) atau meremix dengan AI.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleConnectSpotify}
                    className="px-8 py-3.5 rounded-full bg-[#1ED760] hover:bg-[#3BE477] text-black font-black text-sm transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
                  >
                    <Disc3 className="w-4 h-4" />
                    <span>Hubungkan Spotify Sekarang</span>
                  </button>
                </div>
              ) : loadingLibraryTracks ? (
                <div className="rounded-2xl bg-[#181818] p-12 text-center space-y-4">
                  <Loader2 className="w-8 h-8 text-[#1ED760] animate-spin mx-auto" />
                  <div className="text-sm font-bold text-white">
                    Mengambil lagu asli dari playlist Spotify...
                  </div>
                  <div className="text-xs text-[#B3B3B3]">
                    Menganalisis profil energi lagu & menyiapkan studio kurasi
                  </div>
                </div>
              ) : selectedLibraryPlaylist ? (
                /* SELECTED PLAYLIST WORKSPACE */
                <div className="space-y-6">
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => setSelectedLibraryPlaylist(null)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#B3B3B3] hover:text-white transition-colors cursor-pointer group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Kembali ke Semua Playlist</span>
                  </button>

                  {createdResultBanner}

                  {/* Playlist Hero & Controls */}
                  <section className="rounded-2xl bg-[#181818] overflow-hidden shadow-2xl">
                    <div className="p-6 bg-gradient-to-b from-[#242424] to-[#181818] flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0 w-full">
                        <img
                          src={playlistCoverUrl}
                          alt={draft.name}
                          className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover shadow-2xl shrink-0"
                        />
                        <div className="flex-1 min-w-0 w-full space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#1ED760] uppercase">
                            <Library className="w-3.5 h-3.5" />
                            <span>
                              Library Studio • {draft.items.length} Lagu (
                              {Math.max(1, Math.round(totalDraftDurationMs / 60000))} mnt)
                            </span>
                          </div>

                          <input
                            type="text"
                            value={draft.name}
                            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                            aria-label="Judul Playlist"
                            className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white border-b border-transparent hover:border-white/20 focus:border-[#1ED760] focus:outline-none pb-0.5"
                          />

                          <input
                            type="text"
                            value={draft.description}
                            onChange={(e) =>
                              setDraft({ ...draft, description: e.target.value })
                            }
                            aria-label="Deskripsi Playlist"
                            className="w-full bg-transparent text-xs sm:text-sm text-[#B3B3B3] border-b border-transparent hover:border-white/20 focus:border-[#1ED760] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setDraft({ ...draft, isPublic: !draft.isPublic })
                          }
                          className="px-4 py-2.5 rounded-full bg-[#121212] hover:bg-[#282828] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {draft.isPublic ? (
                            <>
                              <Globe className="w-3.5 h-3.5 text-[#1ED760]" />
                              <span>Publik</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-[#B3B3B3]" />
                              <span>Privat</span>
                            </>
                          )}
                        </button>

                        {canEditOriginalPlaylist && (
                          <button
                            type="button"
                            disabled={isSavingPlaylist || !draft.items.length}
                            onClick={handleUpdateExistingPlaylist}
                            className="px-5 py-2.5 rounded-full bg-[#1ED760] hover:bg-[#3BE477] disabled:opacity-50 text-black font-black text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            {isSavingPlaylist ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Menyimpan...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                <span>Simpan ke Playlist Asli</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isSavingPlaylist || !draft.items.length}
                          onClick={handleSaveToSpotify}
                          className="px-5 py-2.5 rounded-full bg-white hover:bg-[#1ED760] disabled:opacity-50 text-black font-black text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Simpan Sebagai Playlist Baru</span>
                        </button>
                      </div>
                    </div>

                    {/* Energy Arc & AI Tools Toolbar */}
                    <div className="px-6 py-3 bg-[#141414] border-y border-white/5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-[#B3B3B3] mr-2">
                          Filter Alur Energi:
                        </span>
                        {(['ALL', 'Warmup', 'Groove', 'Peak', 'Cooldown'] as const).map(
                          (phase) => (
                            <button
                              key={phase}
                              type="button"
                              onClick={() => setPhaseFilter(phase)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                                phaseFilter === phase
                                  ? 'bg-[#1ED760] text-black'
                                  : 'bg-[#242424] text-[#B3B3B3] hover:text-white'
                              }`}
                            >
                              {phase === 'ALL' ? `Semua (${draft.items.length})` : phase}
                            </button>
                          )
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleAiArrangeFlow}
                          title="Susun ulang alur urutan lagu berdasarkan 4 fase energi"
                          className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333333] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5 text-[#1ED760]" />
                          <span>Susun Alur Energi (AI Flow)</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRemixLibraryPlaylist}
                          title="Racik ulang playlist ini dengan AI DJ"
                          className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333333] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
                        >
                          <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Remix & Recreate dengan AI</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Search & Add Songs to this Library Playlist */}
                    <div className="px-6 py-3.5 bg-[#161616] border-b border-white/5 space-y-2.5">
                      <form onSubmit={handleLiveSearch} className="flex items-center gap-2.5">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-[#B3B3B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={liveSearchQuery}
                            onChange={(e) => setLiveSearchQuery(e.target.value)}
                            placeholder="Cari lagu di Spotify untuk ditambahkan ke playlist ini..."
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#121212] text-xs sm:text-sm text-white placeholder:text-[#727272] border border-white/10 focus:border-[#1ED760] focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={searchingLive}
                          className="px-5 py-2 rounded-full bg-[#1ED760] hover:bg-[#3BE477] disabled:opacity-50 text-black font-bold text-xs transition-colors cursor-pointer shrink-0"
                        >
                          {searchingLive ? 'Mencari...' : 'Cari Lagu'}
                        </button>
                      </form>

                      {liveSearchResults.length > 0 && (
                        <div className="rounded-xl bg-[#121212] border border-white/10 p-2 space-y-1 max-h-60 overflow-y-auto shadow-2xl">
                          <div className="text-[11px] font-bold text-[#B3B3B3] px-2 py-1 flex items-center justify-between">
                            <span>Hasil Pencarian ({liveSearchResults.length} lagu ditemukan):</span>
                            <button
                              type="button"
                              onClick={() => setLiveSearchResults([])}
                              className="text-[#B3B3B3] hover:text-white cursor-pointer"
                            >
                              Tutup
                            </button>
                          </div>
                          {liveSearchResults.map((track) => (
                            <div
                              key={track.id}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#202020] transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={track.album.images?.[0]?.url || playlistCoverUrl}
                                  alt={track.name}
                                  className="w-9 h-9 rounded object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white truncate">
                                    {track.name}
                                  </div>
                                  <div className="text-[11px] text-[#B3B3B3] truncate">
                                    {track.artists.map((a) => a.name).join(', ')}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddTrackToDraft(track)}
                                className="px-3 py-1 rounded-full bg-[#1ED760]/20 hover:bg-[#1ED760] text-[#1ED760] hover:text-black text-xs font-bold transition-all cursor-pointer shrink-0"
                              >
                                + Tambah
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tracklist Table */}
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-[32px_1fr_108px] sm:grid-cols-[36px_1.5fr_1fr_108px] gap-4 px-3 py-2 border-b border-white/10 text-xs font-bold text-[#B3B3B3] uppercase tracking-wider mb-2">
                        <div className="text-center">#</div>
                        <div>Lagu & Artis</div>
                        <div className="hidden sm:block">Tahap Energi</div>
                        <div className="flex justify-end pr-2">
                          <Clock className="w-4 h-4" />
                        </div>
                      </div>

                      {filteredItems.length === 0 ? (
                        <div className="py-10 text-center text-xs sm:text-sm text-[#888888]">
                          Playlist ini masih kosong — cari &amp; tambahkan lagu lewat kolom pencarian di atas!
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {filteredItems.map(({ candidate, track }, index) => {
                            const isCurrent = activeTrack?.id === track.id;
                            return (
                              <div
                                key={`${track.id}-${index}`}
                                onClick={() => handlePlayTrack(track)}
                                className={`grid grid-cols-[32px_1fr_108px] sm:grid-cols-[36px_1.5fr_1fr_108px] gap-4 px-3 py-2.5 rounded-xl items-center group transition-colors cursor-pointer ${
                                  isCurrent ? 'bg-[#242424]' : 'hover:bg-[#242424]/70'
                                }`}
                              >
                                <div className="flex items-center justify-center text-sm text-[#B3B3B3]">
                                  <span
                                    className={`group-hover:hidden ${
                                      isCurrent ? 'text-[#1ED760] font-bold' : ''
                                    }`}
                                  >
                                    {index + 1}
                                  </span>
                                  <Play className="w-4 h-4 fill-white text-white hidden group-hover:block" />
                                </div>

                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={track.album.images?.[0]?.url || playlistCoverUrl}
                                    alt={track.name}
                                    className="w-10 h-10 rounded-md object-cover shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div
                                      className={`text-sm font-bold truncate ${
                                        isCurrent ? 'text-[#1ED760]' : 'text-white'
                                      }`}
                                    >
                                      {track.name}
                                    </div>
                                    <div className="text-xs text-[#B3B3B3] truncate">
                                      {track.artists.map((a) => a.name).join(', ')}
                                    </div>
                                  </div>
                                </div>

                                <div className="hidden sm:block text-xs text-[#B3B3B3] truncate">
                                  <span className="px-2 py-0.5 rounded bg-[#121212] text-white font-bold mr-2">
                                    {candidate.phase}
                                  </span>
                                  <span>{candidate.reason}</span>
                                </div>

                                {renderTrackRowActions(track, index)}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              ) : (
                /* PLAYLIST OVERVIEW GRID */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1ED760]">
                        <Library className="w-3.5 h-3.5" />
                        <span>AI Library Studio</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                        Koleksi Playlist Spotify Kamu
                      </h1>
                      <p className="text-xs sm:text-sm text-[#B3B3B3] mt-1">
                        Pilih playlist untuk ditata ulang alur energinya (AI Flow), edit lagu, atau simpan langsung ke Spotify.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={librarySearchQuery}
                          onChange={(e) => setLibrarySearchQuery(e.target.value)}
                          placeholder="Cari playlist kamu..."
                          className="w-full pl-10 pr-4 py-2 rounded-full bg-[#181818] border border-white/10 text-xs sm:text-sm text-white placeholder:text-[#727272] focus:border-[#1ED760] focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRefreshData}
                        title="Muat ulang daftar playlist Spotify"
                        className="px-3.5 py-2 rounded-full bg-[#181818] hover:bg-[#242424] border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#1ED760]" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {listeningData.playlistWarning && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                      Gagal memuat sebagian playlist dari Spotify: {listeningData.playlistWarning}. Pastikan akunmu terdaftar di Spotify Developer Dashboard atau coba Logout &amp; Login ulang.
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredPlaylists.map((pl) => {
                      const isLikedSongs = pl.id === 'liked-songs';
                      const cover =
                        pl.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80';
                      return (
                        <div
                          key={pl.id}
                          onClick={() => handleOpenLibraryPlaylist(pl)}
                          className="p-3.5 rounded-2xl bg-[#181818] hover:bg-[#242424] transition-all group cursor-pointer flex flex-col justify-between border border-transparent hover:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 duration-200"
                        >
                          <div className="space-y-3">
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md bg-[#121212]">
                              <img
                                src={cover}
                                alt={pl.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-[#1ED760] text-black flex items-center justify-center shadow-lg">
                                  <Play className="w-4 h-4 fill-black ml-0.5" />
                                </div>
                              </div>
                              {isLikedSongs && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                                  <Heart className="w-3 h-3 fill-current" />
                                  <span>Favorit</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#1ED760] transition-colors">
                                {pl.name}
                              </h3>
                              <p className="text-[11px] text-[#888888] truncate mt-0.5">
                                {pl.tracks?.total ? `${pl.tracks.total} lagu` : '0 lagu (kosong / draft)'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="mt-3 w-full py-1.5 rounded-lg bg-[#202020] group-hover:bg-[#1ED760] group-hover:text-black text-[11px] font-bold text-[#CCCCCC] transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Wand2 className="w-3 h-3" />
                            <span>Buka & Tata AI</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* FLOW 1: AI CREATOR (BUAT PLAYLIST BARU DARI PROMPT / PRESET / GEMINI) */
            <div className="space-y-6 pb-10">
              {/* DEDICATED AI DJ COMPOSER DECK */}
              <section className="rounded-2xl bg-[#181818] p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1ED760]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI DJ Composer Deck</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      Racik Playlist Kurasi Otomatis
                    </h1>
                  </div>

                  {/* Engine Selector Pills */}
                  <div className="flex items-center bg-[#121212] p-1 rounded-full border border-white/5">
                    {(
                      [
                        ['gemini', '✨ Gemini AI DJ (Cerdas & Reasoning)'],
                        ['smart-spotify', 'Smart Rule (Offline / Tanpa AI)'],
                        ['custom-list', 'Input Manual'],
                      ] as const
                    ).map(([modeKey, label]) => (
                      <button
                        key={modeKey}
                        type="button"
                        onClick={() => setCurationMode(modeKey)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          curationMode === modeKey
                            ? 'bg-[#1ED760] text-black shadow'
                            : 'text-[#B3B3B3] hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Micro-explainer badge */}
                <div className="text-xs px-3.5 py-2 rounded-xl bg-[#121212] border border-white/5 flex items-center gap-2 text-[#B3B3B3]">
                  {curationMode === 'gemini' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>
                        <strong className="text-white">Gemini AI DJ Mode (Rekomendasi Utama):</strong> Menganalisis konteks emosional, genre, tema playlist library, & selera musikmu secara mendalam menggunakan LLM Gemini AI.
                      </span>
                    </>
                  )}
                  {curationMode === 'smart-spotify' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#1ED760]" />
                      <span>
                        <strong className="text-white">Smart Rule Mode (Offline Fallback):</strong> Kurasi instan berbasis aturan kata kunci & preset statis (tanpa reasoning LLM). Digunakan jika offline atau kuota API habis.
                      </span>
                    </>
                  )}
                  {curationMode === 'custom-list' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span>
                        <strong className="text-white">Input Manual:</strong> Masukkan daftar lagu buatanmu dan biarkan algoritma menyusunnya ke 4 fase energi (Warmup → Groove → Peak → Cooldown).
                      </span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left 8 Cols: Prompt Input & Artist Seeds */}
                  <div className="lg:col-span-8 space-y-3">
                    {curationMode === 'custom-list' ? (
                      <div>
                        <label className="block text-xs font-bold text-[#B3B3B3] mb-1.5">
                          Tempel Daftar Lagu (1 baris per lagu:{' '}
                          <code className="text-white">
                            Nama Artis - Judul Lagu
                          </code>
                          ):
                        </label>
                        <textarea
                          rows={4}
                          value={customTrackText}
                          onChange={(e) => setCustomTrackText(e.target.value)}
                          className="w-full p-3.5 rounded-xl bg-[#121212] text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#1ED760]"
                        />
                      </div>
                    ) : (
                      <>
                        <textarea
                          rows={3}
                          value={prompt}
                          onChange={(e) => {
                            setPrompt(e.target.value);
                            setSelectedPresetId(undefined);
                          }}
                          placeholder="Tulis mood, aktivitas, genre, atau artis referensi yang kamu mau..."
                          className="w-full p-4 rounded-xl bg-[#121212] text-sm text-white placeholder:text-[#727272] focus:outline-none focus:ring-1 focus:ring-[#1ED760]"
                        />

                        {/* Gemini Prompt Enhancer */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                          <button
                            type="button"
                            disabled={isEnhancingPrompt || !prompt.trim()}
                            onClick={handleEnhancePrompt}
                            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-indigo-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                          >
                            {isEnhancingPrompt ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Merapikan dengan Gemini AI...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Sempurnakan Prompt (Gemini AI)</span>
                              </>
                            )}
                          </button>
                          <span className="text-[11px] text-[#727272]">
                            Ketik ide santai, Gemini akan memperkaya detail & alur soniknya
                          </span>
                        </div>

                        {/* Quick Artist Seeds from User's Top Artists */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-[#B3B3B3] mr-1">
                            Sisipkan Top Artist kamu:
                          </span>
                          {listeningData.topArtists.short_term
                            .slice(0, 7)
                            .map((artist) => (
                              <button
                                key={artist.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPresetId(undefined);
                                  setPrompt((prev) =>
                                    prev.includes(artist.name)
                                      ? prev
                                      : `${prev.trim()}, dengan nuansa ${artist.name}`
                                  );
                                }}
                                className="px-3 py-1 rounded-full bg-[#242424] hover:bg-[#2A2A2A] text-xs font-medium text-white transition-colors cursor-pointer"
                              >
                                + {artist.name}
                              </button>
                            ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right 4 Cols: Options & Generate CTA */}
                  <div className="lg:col-span-4 bg-[#121212] p-4 rounded-xl space-y-4">
                    {/* Track Count Slider */}
                    <div className="space-y-3 bg-[#181818] p-3 rounded-lg border border-[#282828]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#1ED760]" />
                          Jumlah Lagu
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#1ED760]/15 text-[#1ED760] border border-[#1ED760]/30 shadow-sm">
                          {trackCount} Lagu
                        </span>
                      </div>

                      {/* Slider with exact ruler ticks */}
                      <div className="space-y-1.5 px-0.5">
                        <input
                          type="range"
                          min={10}
                          max={50}
                          step={5}
                          value={trackCount}
                          onChange={(e) => setTrackCount(Number(e.target.value))}
                          className="w-full accent-[#1ED760] cursor-pointer h-1.5 bg-[#2A2A2A] rounded-lg appearance-none"
                        />
                        <div className="relative w-full h-3.5 text-[10px] font-mono text-[#777777] select-none">
                          <button
                            type="button"
                            onClick={() => setTrackCount(10)}
                            className={`absolute left-0 cursor-pointer hover:text-white transition-colors ${
                              trackCount === 10 ? 'text-[#1ED760] font-bold' : ''
                            }`}
                          >
                            10
                          </button>
                          <button
                            type="button"
                            onClick={() => setTrackCount(20)}
                            className={`absolute left-[25%] -translate-x-1/2 cursor-pointer hover:text-white transition-colors ${
                              trackCount === 20 ? 'text-[#1ED760] font-bold' : ''
                            }`}
                          >
                            20
                          </button>
                          <button
                            type="button"
                            onClick={() => setTrackCount(30)}
                            className={`absolute left-[50%] -translate-x-1/2 cursor-pointer hover:text-white transition-colors ${
                              trackCount === 30 ? 'text-[#1ED760] font-bold' : ''
                            }`}
                          >
                            30
                          </button>
                          <button
                            type="button"
                            onClick={() => setTrackCount(40)}
                            className={`absolute left-[75%] -translate-x-1/2 cursor-pointer hover:text-white transition-colors ${
                              trackCount === 40 ? 'text-[#1ED760] font-bold' : ''
                            }`}
                          >
                            40
                          </button>
                          <button
                            type="button"
                            onClick={() => setTrackCount(50)}
                            className={`absolute right-0 cursor-pointer hover:text-white transition-colors ${
                              trackCount === 50 ? 'text-[#1ED760] font-bold' : ''
                            }`}
                          >
                            50
                          </button>
                        </div>
                      </div>

                      {/* Preset Pills */}
                      <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                        {[
                          { count: 15, label: '15 EP' },
                          { count: 25, label: '25 Std' },
                          { count: 40, label: '40 Long' },
                          { count: 50, label: '50 Max' },
                        ].map((preset) => (
                          <button
                            key={preset.count}
                            type="button"
                            onClick={() => setTrackCount(preset.count)}
                            className={`py-1 rounded text-[11px] font-mono transition-all text-center ${
                              trackCount === preset.count
                                ? 'bg-[#1ED760] text-black font-bold shadow-sm'
                                : 'bg-[#242424] text-[#A7A7A7] hover:text-white hover:bg-[#2C2C2C]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Taste & Library Context Blending */}
                    <div className="space-y-2.5 bg-[#181818] p-3 rounded-lg border border-[#282828]">
                      <label className="flex items-start justify-between gap-2 cursor-pointer select-none">
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-[#1ED760] fill-[#1ED760]" />
                            <span>Konteks Library & Selera</span>
                          </div>
                          <p className="text-[11px] text-[#A7A7A7] leading-tight">
                            AI membaca Liked Songs, artis favorit, &amp; playlist-mu sebagai acuan selera.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={useListeningTaste}
                          onChange={(e) => setUseListeningTaste(e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-[#1ED760] rounded cursor-pointer shrink-0"
                        />
                      </label>

                      {useListeningTaste && (
                        <div className="space-y-1.5 pt-2 border-t border-[#282828]">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#727272]">
                            Strategi Kurasi:
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setTasteBlendMode('balanced')}
                              className={`p-2 rounded-md text-xs font-medium text-left transition-all ${
                                tasteBlendMode === 'balanced'
                                  ? 'bg-[#1ED760] text-black font-bold shadow-sm'
                                  : 'bg-[#242424] text-[#B3B3B3] hover:text-white hover:bg-[#2A2A2A]'
                              }`}
                            >
                              <div className="leading-tight">Campur Seimbang</div>
                              <div
                                className={`text-[9px] mt-0.5 ${
                                  tasteBlendMode === 'balanced'
                                    ? 'text-black/80 font-medium'
                                    : 'text-[#727272]'
                                }`}
                              >
                                Favorit + Baru
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTasteBlendMode('discovery')}
                              className={`p-2 rounded-md text-xs font-medium text-left transition-all ${
                                tasteBlendMode === 'discovery'
                                  ? 'bg-[#1ED760] text-black font-bold shadow-sm'
                                  : 'bg-[#242424] text-[#B3B3B3] hover:text-white hover:bg-[#2A2A2A]'
                              }`}
                            >
                              <div className="leading-tight">Eksplorasi Baru</div>
                              <div
                                className={`text-[9px] mt-0.5 ${
                                  tasteBlendMode === 'discovery'
                                    ? 'text-black/80 font-medium'
                                    : 'text-[#727272]'
                                }`}
                              >
                                100% Track Baru
                              </div>
                            </button>
                          </div>
                          {listeningData && (
                            <div className="flex items-center gap-1.5 text-[10px] text-[#A7A7A7] pt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1ED760]"></span>
                              <span>
                                {listeningData.playlists?.length || 0} playlist &amp; {listeningData.topArtists?.short_term?.length || 0} artis terhubung
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => runPlaylistGenerator()}
                      className="w-full py-3.5 px-5 rounded-full bg-[#1ED760] hover:bg-[#3BE477] disabled:opacity-60 text-black font-black text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#1ED760]/10"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sedang Meracik Mix...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          <span>Generate AI Mix ({trackCount} Lagu)</span>
                        </>
                      )}
                    </button>

                    {/* Live Progress Bar inside Composer */}
                    {isGenerating && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs text-[#1ED760] font-medium">
                          <span className="truncate">{pipelineStage}</span>
                          {searchProgress.total > 0 && (
                            <span className="font-mono shrink-0">
                              {searchProgress.done}/{searchProgress.total}
                            </span>
                          )}
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#242424] overflow-hidden">
                          <div
                            className="h-full bg-[#1ED760] transition-all duration-300"
                            style={{
                              width:
                                searchProgress.total > 0
                                  ? `${Math.round(
                                      (searchProgress.done /
                                        searchProgress.total) *
                                        100
                                    )}%`
                                  : '40%',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Fallback / Warning Notice */}
              {curationNotice && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-3">
                  <span>{curationNotice}</span>
                  <button
                    type="button"
                    onClick={() => setCurationNotice(null)}
                    className="text-amber-200/70 hover:text-amber-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Created Playlist Success Card */}
              {createdResultBanner}

              {/* GENERATED PLAYLIST STUDIO & TRACKLIST */}
              <section className="rounded-2xl bg-[#181818] overflow-hidden shadow-2xl">
                {/* Playlist Header */}
                <div className="p-6 bg-gradient-to-b from-[#242424] to-[#181818] flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0 w-full">
                    <img
                      src={playlistCoverUrl}
                      alt={draft.name}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover shadow-2xl shrink-0"
                    />
                    <div className="flex-1 min-w-0 w-full space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1ED760] uppercase">
                        <ListMusic className="w-3.5 h-3.5" />
                        <span>
                          {draft.curationSource === 'gemini'
                            ? 'Hasil Kurasi Gemini AI'
                            : draft.curationSource === 'custom-list'
                            ? 'Input Manual'
                            : 'Hasil Kurasi Smart Rule'}{' '}
                          • {draft.items.length} Lagu (
                          {Math.max(1, Math.round(totalDraftDurationMs / 60000))}{' '}
                          mnt)
                        </span>
                      </div>

                      <input
                        type="text"
                        value={draft.name}
                        onChange={(e) =>
                          setDraft({ ...draft, name: e.target.value })
                        }
                        aria-label="Judul Playlist"
                        className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white border-b border-transparent hover:border-white/20 focus:border-[#1ED760] focus:outline-none pb-0.5"
                      />

                      <input
                        type="text"
                        value={draft.description}
                        onChange={(e) =>
                          setDraft({ ...draft, description: e.target.value })
                        }
                        aria-label="Deskripsi Playlist"
                        className="w-full bg-transparent text-xs sm:text-sm text-[#B3B3B3] border-b border-transparent hover:border-white/20 focus:border-[#1ED760] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Save & Privacy Actions */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({ ...draft, isPublic: !draft.isPublic })
                      }
                      className="px-4 py-2.5 rounded-full bg-[#121212] hover:bg-[#282828] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {draft.isPublic ? (
                        <>
                          <Globe className="w-3.5 h-3.5 text-[#1ED760]" />
                          <span>Publik</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-[#B3B3B3]" />
                          <span>Privat</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSavingPlaylist || !draft.items.length}
                      onClick={handleSaveToSpotify}
                      className="px-6 py-2.5 rounded-full bg-white hover:bg-[#1ED760] disabled:opacity-50 text-black font-black text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      {isSavingPlaylist ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Simpan ke Koleksi Spotify</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Energy Arc Filter Bar & AI Arrangement Actions */}
                <div className="px-6 py-3 bg-[#141414] border-y border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-[#B3B3B3] mr-2">
                      Filter Alur Energi:
                    </span>
                    {(
                      ['ALL', 'Warmup', 'Groove', 'Peak', 'Cooldown'] as const
                    ).map((phase) => (
                      <button
                        key={phase}
                        type="button"
                        onClick={() => setPhaseFilter(phase)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          phaseFilter === phase
                            ? 'bg-[#1ED760] text-black'
                            : 'bg-[#242424] text-[#B3B3B3] hover:text-white'
                        }`}
                      >
                        {phase === 'ALL'
                          ? `Semua (${draft.items.length})`
                          : phase}
                      </button>
                    ))}
                  </div>

                  {/* AI Flow Arrange & Remix Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAiArrangeFlow}
                      title="Susun ulang alur urutan lagu berdasarkan 4 fase energi"
                      className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333333] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#1ED760]" />
                      <span>Susun Alur Energi (AI Flow)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemixWithPrompt}
                      title="Racik ulang playlist ini dengan prompt baru"
                      className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#333333] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Remix dengan AI</span>
                    </button>
                  </div>
                </div>

                {/* Inline Quick Search & Add Songs */}
                <div className="px-6 py-3.5 bg-[#161616] border-b border-white/5 space-y-2.5">
                  <form
                    onSubmit={handleLiveSearch}
                    className="flex items-center gap-2.5"
                  >
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#B3B3B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={liveSearchQuery}
                        onChange={(e) => setLiveSearchQuery(e.target.value)}
                        placeholder="Cari lagu atau artis di Spotify untuk ditambahkan ke playlist ini..."
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#121212] text-xs sm:text-sm text-white placeholder:text-[#727272] border border-white/10 focus:border-[#1ED760] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={searchingLive}
                      className="px-5 py-2 rounded-full bg-[#1ED760] hover:bg-[#3BE477] disabled:opacity-50 text-black font-bold text-xs transition-colors cursor-pointer shrink-0"
                    >
                      {searchingLive ? 'Mencari...' : 'Cari Lagu'}
                    </button>
                  </form>

                  {/* Live Search Results */}
                  {liveSearchResults.length > 0 && (
                    <div className="rounded-xl bg-[#121212] border border-white/10 p-2 space-y-1 max-h-60 overflow-y-auto shadow-2xl">
                      <div className="text-[11px] font-bold text-[#B3B3B3] px-2 py-1 flex items-center justify-between">
                        <span>Hasil Pencarian ({liveSearchResults.length} lagu ditemukan):</span>
                        <button
                          type="button"
                          onClick={() => setLiveSearchResults([])}
                          className="text-[#B3B3B3] hover:text-white cursor-pointer"
                        >
                          Tutup
                        </button>
                      </div>
                      {liveSearchResults.map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-[#202020] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={track.album.images?.[0]?.url || playlistCoverUrl}
                              alt={track.name}
                              className="w-9 h-9 rounded object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                {track.name}
                              </div>
                              <div className="text-[11px] text-[#B3B3B3] truncate">
                                {track.artists.map((a) => a.name).join(', ')}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddTrackToDraft(track)}
                            className="px-3 py-1 rounded-full bg-[#1ED760]/20 hover:bg-[#1ED760] text-[#1ED760] hover:text-black text-xs font-bold transition-all cursor-pointer shrink-0"
                          >
                            + Tambah
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tracklist Table */}
                <div className="p-4 sm:p-6">
                  {isGenerating ? (
                    <div className="space-y-2.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div
                          key={n}
                          className="h-14 rounded-xl skeleton-shimmer w-full"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Table Header */}
                      <div className="grid grid-cols-[32px_1fr_108px] sm:grid-cols-[36px_1.5fr_1fr_108px] gap-4 px-3 py-2 border-b border-white/10 text-xs font-bold text-[#B3B3B3] uppercase tracking-wider mb-2">
                        <div className="text-center">#</div>
                        <div>Lagu & Artis</div>
                        <div className="hidden sm:block">
                          Tahap Energi & Alasan Kurasi
                        </div>
                        <div className="flex justify-end pr-2">
                          <Clock className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        {filteredItems.map(({ candidate, track }, index) => {
                          const isCurrent = activeTrack?.id === track.id;
                          return (
                            <div
                              key={`${track.id}-${index}`}
                              onClick={() => handlePlayTrack(track)}
                              className={`grid grid-cols-[32px_1fr_108px] sm:grid-cols-[36px_1.5fr_1fr_108px] gap-4 px-3 py-2.5 rounded-xl items-center group transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#242424]'
                                  : 'hover:bg-[#242424]/70'
                              }`}
                            >
                              <div className="flex items-center justify-center text-sm text-[#B3B3B3]">
                                <span
                                  className={`group-hover:hidden ${
                                    isCurrent ? 'text-[#1ED760] font-bold' : ''
                                  }`}
                                >
                                  {index + 1}
                                </span>
                                <Play className="w-4 h-4 fill-white text-white hidden group-hover:block" />
                              </div>

                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={
                                    track.album.images?.[0]?.url ||
                                    playlistCoverUrl
                                  }
                                  alt={track.name}
                                  className="w-10 h-10 rounded-md object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                  <div
                                    className={`text-sm font-bold truncate ${
                                      isCurrent
                                        ? 'text-[#1ED760]'
                                        : 'text-white'
                                    }`}
                                  >
                                    {track.name}
                                  </div>
                                  <div className="text-xs text-[#B3B3B3] truncate">
                                    {track.artists.map((a) => a.name).join(', ')}
                                  </div>
                                </div>
                              </div>

                              <div className="hidden sm:block text-xs text-[#B3B3B3] truncate">
                                <span className="px-2 py-0.5 rounded bg-[#121212] text-white font-bold mr-2">
                                  {candidate.phase}
                                </span>
                                <span>{candidate.reason}</span>
                              </div>

                              {renderTrackRowActions(track, index)}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* CONSISTENT BOTTOM PLAYER BAR (DOCKED - NO DUPLICATE FLOATING CARD) */}
      <SpotifyPlayerBar
        activeTrack={activeTrack}
        playTriggerCount={playTriggerCount}
        fallbackCover={playlistCoverUrl}
        onPrev={() => {
          const idx = draft.items.findIndex(
            (i) => i.track.id === activeTrack?.id
          );
          if (idx > 0) handlePlayTrack(draft.items[idx - 1].track);
        }}
        onNext={() => {
          const idx = draft.items.findIndex(
            (i) => i.track.id === activeTrack?.id
          );
          if (idx >= 0 && idx < draft.items.length - 1) {
            handlePlayTrack(draft.items[idx + 1].track);
          }
        }}
      />

      {/* SETTINGS & MULTI-USER ACCESS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#181818] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-[#1ED760]" />
                <h3 className="text-lg font-bold text-white">
                  Pengaturan Koneksi & Akses Multi-User
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="text-[#B3B3B3] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Multi-User Info Box */}
            <div className="p-4 rounded-xl bg-[#121212] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1ED760] uppercase">
                <Users className="w-4 h-4" />
                <span>Cara Mengizinkan Orang Lain Ikut Login</span>
              </div>
              <p className="text-xs text-[#B3B3B3] leading-relaxed">
                1. <strong className="text-white">Lewat User Management:</strong>{' '}
                Buka Spotify Developer Dashboard → menu{' '}
                <strong className="text-white">User Management</strong> →
                tambahkan Nama & Email Spotify temanmu (maks 5 user di mode
                Development).
                <br />
                2. <strong className="text-white">Pakai Client ID Sendiri:</strong>{' '}
                Teman di luar daftar 5 user juga bisa login dengan menempelkan{' '}
                <code className="text-white">Client ID</code> mereka sendiri di
                kolom bawah ini!
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#B3B3B3] mb-1.5">
                  Redirect URI Aktif (Tambahkan di Spotify Dashboard saat Deploy):
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2.5 rounded-xl bg-[#121212] text-xs font-mono text-[#1ED760] select-all">
                    {getRedirectUri()}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyRedirectUri}
                    className="px-3.5 py-2.5 rounded-full bg-white text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedUri ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#B3B3B3] mb-1.5">
                  Spotify Client ID:
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => {
                    setClientId(e.target.value);
                    saveClientId(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1ED760]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#B3B3B3] mb-1.5">
                  Opsional — Gemini API Key (Untuk Mode Gemini AI DJ):
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => {
                    setGeminiKey(e.target.value);
                    saveGeminiKey(e.target.value);
                  }}
                  placeholder="Kosongkan jika memakai mode Smart DNA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1ED760]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSettings(false);
                  handleConnectSpotify();
                }}
                className="px-6 py-2.5 rounded-full bg-[#1ED760] hover:bg-[#3BE477] text-black font-bold text-xs cursor-pointer"
              >
                Simpan & Log in Spotify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
