'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Activity,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Compass,
  Disc,
  Download,
  Flame,
  Music2,
  Play,
  Radio,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ListeningData, SpotifyTrack, TimeRange } from '@/types/spotify';
import {
  computeMassiveDnaAnalytics,
  computeTopGenres,
} from '@/lib/playlistCurator';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface Props {
  listeningData: ListeningData;
  timeRange: TimeRange;
  onChangeTimeRange: (range: TimeRange) => void;
  onRefresh: () => void;
  onExportJson: () => void;
  onPlayTrack: (track: SpotifyTrack) => void;
  onSeedPrompt: (customPrompt: string) => void;
  fallbackCover: string;
}

export default function ListeningDnaView({
  listeningData,
  timeRange,
  onChangeTimeRange,
  onRefresh,
  onExportJson,
  onPlayTrack,
  onSeedPrompt,
  fallbackCover,
}: Props) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  const analytics = useMemo(
    () => computeMassiveDnaAnalytics(listeningData, timeRange),
    [listeningData, timeRange]
  );

  const topGenres = useMemo(() => {
    const artists =
      listeningData.topArtists[timeRange]?.length > 0
        ? listeningData.topArtists[timeRange]
        : listeningData.topArtists.short_term;
    return computeTopGenres(artists, 15);
  }, [listeningData, timeRange]);

  const activeArtists =
    listeningData.topArtists[timeRange]?.length > 0
      ? listeningData.topArtists[timeRange]
      : listeningData.topArtists.short_term;

  const activeTracks =
    listeningData.topTracks[timeRange]?.length > 0
      ? listeningData.topTracks[timeRange]
      : listeningData.topTracks.short_term;

  const maxHourlyCount = Math.max(1, ...analytics.hourlyActivity);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-16"
    >
      {/* 1. HERO IDENTITY & ERA CONTROLS */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl bg-gradient-to-br from-[#123826] via-[#102018] to-[#121212] p-6 sm:p-8 relative overflow-hidden border border-[#1ED760]/20 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1ED760]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={listeningData.profile.images?.[0]?.url || fallbackCover}
                alt={listeningData.profile.display_name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-[0_8px_32px_rgba(0,0,0,0.7)] border-2 border-[#1ED760]"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#1ED760] border-2 border-black flex items-center justify-center">
                <Radio className="w-2.5 h-2.5 text-black" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#1ED760]/30 text-[#1ED760] text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>Massive Listening DNA Analytics</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {listeningData.profile.display_name}
              </h1>
              <p className="text-xs sm:text-sm text-[#B3B3B3]">
                <span className="text-[#1ED760] font-bold">
                  {analytics.mainstreamLabel}
                </span>{' '}
                • {analytics.uniqueArtistCount} Artis Unik Terpantau •{' '}
                {listeningData.playlists.length} Playlist di Koleksi
              </p>
            </div>
          </div>

          {/* Time Range Pills & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-black/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
              {(
                [
                  ['short_term', '4 Minggu'],
                  ['medium_term', '6 Bulan'],
                  ['long_term', 'Sepanjang Waktu'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChangeTimeRange(key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    timeRange === key
                      ? 'bg-[#1ED760] text-black shadow-lg shadow-[#1ED760]/20'
                      : 'text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onRefresh}
              title="Segarkan Data Spotify"
              className="p-2.5 rounded-full bg-[#181818] hover:bg-[#282828] text-white transition-colors cursor-pointer border border-white/10"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onExportJson}
              className="px-4 py-2 rounded-full bg-[#181818] hover:bg-[#282828] text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer border border-white/10"
            >
              <Download className="w-3.5 h-3.5 text-[#1ED760]" />
              <span>Export DNA JSON</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 1.5 SONIC PERSONALITY BADGE & RADAR MATRIX */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Personality Badge Card */}
        <div
          className={`lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-gradient-to-br ${analytics.personalityBadge.badgeStyle} border shadow-xl flex flex-col justify-between relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-bold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Sonic Personality Badge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {analytics.personalityBadge.title}
            </h2>
            <div className="text-sm font-semibold text-[#1ED760]">
              {analytics.personalityBadge.subtitle}
            </div>
            <p className="text-xs sm:text-sm text-[#E0E0E0] leading-relaxed">
              {analytics.personalityBadge.description}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs text-[#B3B3B3]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1ED760]" />
              <span>Taste Diversity Score</span>
            </span>
            <span className="text-lg font-black text-white font-mono">
              {analytics.tasteDiversityScore}%
            </span>
          </div>
        </div>

        {/* 5-Dimensional Sonic Radar Attribute Meters */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#1ED760]" />
                <span>Dimensi Karakteristik Akustik & Mood</span>
              </h3>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#121212] text-[#1ED760] border border-white/10">
                5 Parameter
              </span>
            </div>
            <p className="text-xs text-[#B3B3B3] mt-1">
              Profil seimbang berdasarkan resonansi aransemen, tempo beat, dan mood emosional
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                label: 'Acoustic Resonance',
                sub: 'Kehangatan instrumen organik & vokal intim',
                val: analytics.sonicRadar.acousticness,
                color: 'from-emerald-500 to-teal-400',
              },
              {
                label: 'Energy & Drive',
                sub: 'Intensitas dinamika, distorsi & tempo cepat',
                val: analytics.sonicRadar.energy,
                color: 'from-amber-500 to-orange-400',
              },
              {
                label: 'Rhythm & Danceability',
                sub: 'Keteraturan beat, groove bass & ritme gerak',
                val: analytics.sonicRadar.danceability,
                color: 'from-purple-500 to-pink-400',
              },
              {
                label: 'Valence Spectrum',
                sub: 'Nuansa cerah/eforia vs reflektif/melankolis',
                val: analytics.sonicRadar.valence,
                color: 'from-blue-500 to-cyan-400',
              },
              {
                label: 'Underground Depth Index',
                sub: 'Kecenderungan menemukan hidden gems & indie non-mainstream',
                val: analytics.sonicRadar.depthIndex,
                color: 'from-[#1ED760] to-emerald-300',
              },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{metric.label}</span>
                    <span className="text-[#888888] ml-2 text-[11px] hidden sm:inline">
                      {metric.sub}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    {metric.val}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#121212] overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.val}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 2. SIX KPI BENTO CARDS (Animated on mount) */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5"
      >
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-1.5"
        >
          <div className="text-xs text-[#B3B3B3] flex items-center justify-between">
            <span>Indeks Popularitas</span>
            <Compass className="w-4 h-4 text-[#1ED760]" />
          </div>
          <div className="text-2xl font-black text-white">
            {analytics.avgPopularity}%
          </div>
          <div className="text-xs text-[#1ED760] truncate font-medium">
            {analytics.mainstreamLabel}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-1.5"
        >
          <div className="text-xs text-[#B3B3B3] flex items-center justify-between">
            <span>Keragaman Artis</span>
            <Users className="w-4 h-4 text-[#1ED760]" />
          </div>
          <div className="text-2xl font-black text-white">
            {analytics.uniqueArtistCount}
          </div>
          <div className="text-xs text-[#B3B3B3] truncate">
            Artis unik di rotasimu
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-1.5"
        >
          <div className="text-xs text-[#B3B3B3] flex items-center justify-between">
            <span>Dekade Teratas</span>
            <Calendar className="w-4 h-4 text-[#1ED760]" />
          </div>
          <div className="text-2xl font-black text-white">
            {analytics.decadeBreakdown[0]?.decade || '2020s'}
          </div>
          <div className="text-xs text-[#B3B3B3] truncate">
            {analytics.decadeBreakdown[0]?.percent || 80}% dari playlist
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-1.5"
        >
          <div className="text-xs text-[#B3B3B3] flex items-center justify-between">
            <span>Rata-Rata Durasi</span>
            <Clock className="w-4 h-4 text-[#1ED760]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatDuration(analytics.avgDurationMs)}
          </div>
          <div className="text-xs text-[#B3B3B3] truncate">
            Per lagu di Top Tracks
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-1.5"
        >
          <div className="text-xs text-[#B3B3B3] flex items-center justify-between">
            <span>Rasio Explicit</span>
            <Flame className="w-4 h-4 text-[#1ED760]" />
          </div>
          <div className="text-2xl font-black text-white">
            {analytics.explicitPercent}%
          </div>
          <div className="text-xs text-[#B3B3B3] truncate">
            Lagu berlabel Explicit
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-1.5"
        >
          <div className="text-xs text-[#B3B3B3] flex items-center justify-between">
            <span>Jam Aktif Puncak</span>
            <TrendingUp className="w-4 h-4 text-[#1ED760]" />
          </div>
          <div className="text-xl font-black text-white truncate">
            {analytics.peakPeriodLabel.split(' ')[0]}
          </div>
          <div className="text-xs text-[#1ED760] truncate font-medium">
            {analytics.peakPeriodLabel}
          </div>
        </motion.div>
      </motion.div>

      {/* 3. SPEKTRUM 15 GENRE DOMINAN & 24-HOUR CIRCADIAN CLOCK (Both 100% Guaranteed Populated!) */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Spektrum 15 Genre Dominan (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#1ED760]" />
                <span>Spektrum 15 Genre Dominan Kamu</span>
              </h2>
              <p className="text-xs text-[#B3B3B3] mt-0.5">
                Peringkat genre musik yang paling mencerminkan kepribadian dengarmu
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#121212] text-[#1ED760] border border-white/10">
              15 Genre
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
            {topGenres.map((g, idx) => (
              <motion.div
                key={g.genre}
                whileHover={{ scale: 1.01 }}
                className="p-2.5 rounded-xl bg-[#121212] hover:bg-[#1f1f1f] border border-white/5 transition-all group"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-xs font-mono font-bold text-[#1ED760]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-white group-hover:text-[#1ED760] capitalize transition-colors">
                      {g.genre}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#B3B3B3] font-mono">
                      {g.percent}%
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onSeedPrompt(
                          `Kurasi playlist terbaik bergenre ${g.genre} dengan transisi alur energi yang halus`
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 px-2.5 py-0.5 rounded-full bg-[#1ED760] text-black text-[11px] font-bold transition-all cursor-pointer"
                    >
                      + Buat Mix
                    </button>
                  </div>
                </div>

                {/* Animated Horizontal Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#242424] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.percent}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.04 }}
                    className="h-full bg-gradient-to-r from-[#1DB954] to-[#1ED760] rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ritme Sirkadian 24 Jam (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1ED760]" />
                <span>Ritme Sirkadian 24 Jam</span>
              </h2>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#121212] text-white border border-white/10">
                Jam Dengar
              </span>
            </div>
            <p className="text-xs text-[#B3B3B3] mt-1">
              Pola waktu kebiasaanmu memutar musik sepanjang hari
            </p>
          </div>

          {/* 4 Time-of-day summary boxes */}
          <div className="grid grid-cols-2 gap-2.5">
            {analytics.periodBreakdown.map((p) => {
              const isPeak = p.label.startsWith(
                analytics.peakPeriodLabel.split(' ')[0]
              );
              return (
                <div
                  key={p.label}
                  className={`p-3 rounded-2xl border transition-all ${
                    isPeak
                      ? 'bg-[#121212] border-[#1ED760]/50 shadow-lg shadow-[#1ED760]/10'
                      : 'bg-[#121212] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {p.label}
                    </span>
                    {isPeak && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1ED760] text-black">
                        PUNCAK
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-[#1ED760] mt-1">
                    {p.percent}%
                  </div>
                  <div className="text-xs text-[#727272]">{p.sub}</div>
                </div>
              );
            })}
          </div>

          {/* 24-Hour Animated Bar Chart with Framer Motion */}
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-xs text-[#B3B3B3]">
              <span>Grafik Aktivitas Jam 00:00 – 23:00</span>
              {hoveredHour !== null && (
                <span className="text-[#1ED760] font-mono font-bold">
                  Jam {hoveredHour.toString().padStart(2, '0')}:00 •{' '}
                  {analytics.hourlyActivity[hoveredHour]} lagu
                </span>
              )}
            </div>

            <div className="h-28 flex items-end gap-1 pt-3">
              {analytics.hourlyActivity.map((count, hr) => {
                const heightPct = Math.max(
                  12,
                  Math.round((count / maxHourlyCount) * 100)
                );
                const isHovered = hoveredHour === hr;
                const isPeak = heightPct >= 75;

                return (
                  <div
                    key={hr}
                    onMouseEnter={() => setHoveredHour(hr)}
                    onMouseLeave={() => setHoveredHour(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                  >
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: hr * 0.02 }}
                      className={`w-full rounded-t-sm transition-all origin-bottom ${
                        isHovered
                          ? 'bg-white shadow-[0_0_12px_#ffffff]'
                          : isPeak
                          ? 'bg-[#1ED760] shadow-[0_0_8px_rgba(30,215,96,0.5)]'
                          : count > 0
                          ? 'bg-emerald-600/70'
                          : 'bg-[#282828]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[11px] font-mono text-[#727272] pt-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. SPEKTRUM MAINSTREAM VS INDIE & EXTREMES */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#1ED760]" />
              <span>Spektrum Mainstream vs. Indie Underground</span>
            </h2>
            <p className="text-xs text-[#B3B3B3] mt-0.5">
              Skor 0–100 mengukur proporsi artis hits global dibanding artis indie /
              deep-cuts di perpustakaanmu
            </p>
          </div>

          {/* Interactive Gradient Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-400">Deep Indie / Underground</span>
              <span className="text-white font-mono bg-black/60 px-3 py-1 rounded-full border border-white/10">
                Skor Kamu: {analytics.avgPopularity} / 100
              </span>
              <span className="text-amber-400">Global Megahits</span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-[#121212] overflow-hidden p-0.5 border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analytics.avgPopularity}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#1ED760] via-emerald-400 to-amber-400 rounded-full"
              />
            </div>
          </div>

          {/* 4 Pop Buckets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {analytics.popularityBuckets.map((b) => (
              <div
                key={b.label}
                className="p-3.5 rounded-2xl bg-[#121212] border border-white/5 space-y-1"
              >
                <div className="text-xs text-[#B3B3B3] truncate">{b.label}</div>
                <div className="text-xl font-black text-white">
                  {b.percent}%
                </div>
                <div className="text-xs text-[#727272]">Skor {b.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Gem vs Mainstream Artist Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
          {analytics.mostUndergroundArtist && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-4 rounded-2xl bg-[#181818] border border-white/5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={
                    analytics.mostUndergroundArtist.images?.[0]?.url ||
                    fallbackCover
                  }
                  alt={analytics.mostUndergroundArtist.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0 border border-emerald-500/40"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1ED760] uppercase">
                    Hidden Gem Terunik Kamu
                  </div>
                  <div className="text-base font-bold text-white truncate">
                    {analytics.mostUndergroundArtist.name}
                  </div>
                  <div className="text-xs text-[#B3B3B3]">
                    Popularitas: {analytics.mostUndergroundArtist.popularity ?? 45}%
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onSeedPrompt(
                    `Kurasi lagu deep-cuts & indie yang mirip dengan ${analytics.mostUndergroundArtist?.name}`
                  )
                }
                className="px-3.5 py-2 rounded-full bg-[#121212] hover:bg-[#1ED760] hover:text-black text-xs font-bold text-white shrink-0 transition-colors cursor-pointer border border-white/10"
              >
                Buat Mix
              </button>
            </motion.div>
          )}

          {analytics.mostMainstreamArtist && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-4 rounded-2xl bg-[#181818] border border-white/5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={
                    analytics.mostMainstreamArtist.images?.[0]?.url ||
                    fallbackCover
                  }
                  alt={analytics.mostMainstreamArtist.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0 border border-amber-500/40"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-400 uppercase">
                    Artis Paling Mainstream Kamu
                  </div>
                  <div className="text-base font-bold text-white truncate">
                    {analytics.mostMainstreamArtist.name}
                  </div>
                  <div className="text-xs text-[#B3B3B3]">
                    Popularitas: {analytics.mostMainstreamArtist.popularity ?? 85}%
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onSeedPrompt(
                    `Playlist hits terbaik dari ${analytics.mostMainstreamArtist?.name} dan artis sejenis`
                  )
                }
                className="px-3.5 py-2 rounded-full bg-[#121212] hover:bg-[#1ED760] hover:text-black text-xs font-bold text-white shrink-0 transition-colors cursor-pointer border border-white/10"
              >
                Buat Mix
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* 5. CROSS-ERA EVOLUTION (RISING OBSESSIONS VS ALL-TIME LOYALS) */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#1ED760]" />
              <span>Rising Obsessions (Naik Daun di 4 Minggu Terakhir)</span>
            </h2>
            <p className="text-xs text-[#B3B3B3] mt-0.5">
              Artis yang meroket di rotasi barumu dan belum ada di era lampau
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analytics.risingArtists.map((artist) => (
              <motion.div
                key={artist.id}
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  onSeedPrompt(
                    `Buatkan playlist berdasarkan obsesi baruku: ${artist.name} dan artis sejenis`
                  )
                }
                className="p-3 rounded-2xl bg-[#121212] hover:bg-[#222222] border border-white/5 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <img
                  src={artist.images?.[0]?.url || fallbackCover}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {artist.name}
                  </div>
                  <div className="text-xs text-[#1ED760] truncate font-medium">
                    Pendatang Baru • Klik buat Mix
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#1ED760]" />
              <span>All-Time Loyals (Pilar Favorit Sepanjang Masa)</span>
            </h2>
            <p className="text-xs text-[#B3B3B3] mt-0.5">
              Artis inti yang konsisten bertahan di Top List kamu di semua era
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analytics.loyalArtists.map((artist) => (
              <motion.div
                key={artist.id}
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  onSeedPrompt(
                    `Buatkan playlist spesial dari artis favorit sepanjang masaku: ${artist.name} beserta deep cuts-nya`
                  )
                }
                className="p-3 rounded-2xl bg-[#121212] hover:bg-[#222222] border border-white/5 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <img
                  src={artist.images?.[0]?.url || fallbackCover}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {artist.name}
                  </div>
                  <div className="text-xs text-[#B3B3B3] truncate">
                    All-Time Core • Klik buat Mix
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 6. TOP ALBUMS IN ROTATION */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Disc className="w-5 h-5 text-[#1ED760]" />
              <span>Album Paling Sering Muncul di Rotasi</span>
            </h2>
            <p className="text-xs text-[#B3B3B3] mt-0.5">
              Album dengan frekuensi lagu tertinggi di Top Tracks & Recently Played
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {analytics.topAlbums.map((alb) => (
            <motion.div
              key={alb.id}
              whileHover={{ y: -4 }}
              onClick={() =>
                onSeedPrompt(
                  `Kurasi playlist dengan nuansa album "${alb.name}" dari ${alb.artist}`
                )
              }
              className="p-3 rounded-2xl bg-[#121212] hover:bg-[#222222] border border-white/5 cursor-pointer transition-colors group space-y-2.5"
            >
              <div className="relative">
                <img
                  src={alb.image || fallbackCover}
                  alt={alb.name}
                  className="w-full aspect-square rounded-xl object-cover shadow-md"
                />
                <span className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#1ED760] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate">
                  {alb.name}
                </div>
                <div className="text-[11px] text-[#B3B3B3] truncate">
                  {alb.artist} • {alb.count}x lagu
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 7. FULL TOP ARTISTS & TOP TRACKS (With Rich Imagery) */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Top Artists Grid */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1ED760]" />
              <span>Top {activeArtists.length} Artis Kamu</span>
            </h2>
            <span className="text-xs text-[#B3B3B3]">Klik untuk buat Mix</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {activeArtists.map((artist, idx) => (
              <motion.div
                key={artist.id}
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  onSeedPrompt(
                    `Buatkan playlist berisi lagu terbaik dari ${artist.name} beserta artis-artis yang memiliki vibe serupa`
                  )
                }
                className="p-3.5 rounded-2xl bg-[#121212] hover:bg-[#222222] border border-white/5 transition-colors group cursor-pointer"
              >
                <div className="relative mb-2.5">
                  <img
                    src={artist.images?.[0]?.url || fallbackCover}
                    alt={artist.name}
                    className="w-full aspect-square rounded-full object-cover shadow-lg"
                  />
                  <span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-black/80 text-xs font-mono font-bold text-[#1ED760]">
                    #{idx + 1}
                  </span>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {artist.name}
                </div>
                <div className="text-xs text-[#B3B3B3] truncate capitalize mt-0.5">
                  {(artist.genres || [])[0] || 'Artis'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Tracks List */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#181818] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Music2 className="w-5 h-5 text-[#1ED760]" />
              <span>Top {activeTracks.length} Lagu Favorit</span>
            </h2>
            <span className="text-xs text-[#B3B3B3]">Klik untuk putar</span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {activeTracks.map((track, idx) => (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-[#222222] border border-transparent hover:border-white/5 group cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-xs font-mono font-bold text-[#B3B3B3] group-hover:hidden">
                    #{idx + 1}
                  </span>
                  <Play className="w-4 h-4 fill-white text-white hidden group-hover:inline ml-1 shrink-0" />
                  <img
                    src={track.album.images?.[0]?.url || fallbackCover}
                    alt={track.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-md"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">
                      {track.name}
                    </div>
                    <div className="text-xs text-[#B3B3B3] truncate">
                      {track.artists.map((a) => a.name).join(', ')} •{' '}
                      {(track.album.release_date || '').slice(0, 4)}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#B3B3B3] shrink-0">
                  {formatDuration(track.duration_ms)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
