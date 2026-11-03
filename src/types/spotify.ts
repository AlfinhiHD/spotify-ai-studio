export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email?: string;
  country?: string;
  images?: SpotifyImage[];
  product?: string;
  followers?: { total: number };
  external_urls?: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres?: string[];
  popularity?: number;
  followers?: { total: number };
  images?: SpotifyImage[];
  external_urls?: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  uri: string;
  name: string;
  duration_ms: number;
  popularity?: number;
  preview_url?: string | null;
  explicit?: boolean;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
    release_date?: string;
  };
  external_urls?: { spotify: string };
}

export interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

export interface CurrentlyPlaying {
  is_playing: boolean;
  progress_ms?: number;
  item?: SpotifyTrack | null;
}

export interface SpotifyPlaylistSummary {
  id: string;
  name: string;
  description?: string;
  public?: boolean;
  tracks: { total: number };
  images?: SpotifyImage[];
  external_urls?: { spotify: string };
}

export interface ListeningData {
  profile: SpotifyUserProfile;
  topArtists: Record<TimeRange, SpotifyArtist[]>;
  topTracks: Record<TimeRange, SpotifyTrack[]>;
  recentlyPlayed: RecentlyPlayedItem[];
  currentlyPlaying: CurrentlyPlaying | null;
  playlists: SpotifyPlaylistSummary[];
}

export type EnergyPhase = 'Warmup' | 'Groove' | 'Peak' | 'Cooldown';

export interface CuratedCandidate {
  artist: string;
  title: string;
  phase: EnergyPhase;
  reason?: string;
}

export interface ResolvedPlaylistItem {
  candidate: CuratedCandidate;
  track: SpotifyTrack;
}

export interface PlaylistDraft {
  name: string;
  description: string;
  isPublic: boolean;
  prompt: string;
  items: ResolvedPlaylistItem[];
  skipped: CuratedCandidate[];
  curationSource: 'gemini' | 'smart-spotify' | 'custom-list';
  coverUrl?: string;
  originalPlaylistId?: string;
}

export interface CreatedPlaylistResult {
  id: string;
  name: string;
  url: string;
  trackCount: number;
}

export interface MassiveDnaAnalytics {
  avgPopularity: number;
  mainstreamLabel: string;
  popularityBuckets: { label: string; range: string; count: number; percent: number }[];
  mostUndergroundArtist: SpotifyArtist | null;
  mostMainstreamArtist: SpotifyArtist | null;
  uniqueArtistCount: number;
  avgDurationMs: number;
  shortestTrack: SpotifyTrack | null;
  longestTrack: SpotifyTrack | null;
  explicitPercent: number;
  decadeBreakdown: { decade: string; count: number; percent: number }[];
  oldestTrack: { track: SpotifyTrack; year: number } | null;
  newestTrack: { track: SpotifyTrack; year: number } | null;
  risingArtists: SpotifyArtist[];
  loyalArtists: SpotifyArtist[];
  risingTracks: SpotifyTrack[];
  topAlbums: { id: string; name: string; artist: string; image?: string; count: number }[];
  hourlyActivity: number[];
  periodBreakdown: { label: string; sub: string; count: number; percent: number }[];
  peakPeriodLabel: string;
  personalityBadge: {
    title: string;
    subtitle: string;
    description: string;
    badgeStyle: string;
  };
  sonicRadar: {
    acousticness: number;
    energy: number;
    danceability: number;
    valence: number;
    depthIndex: number;
  };
  tasteDiversityScore: number;
}
