import {
  CreatedPlaylistResult,
  CuratedCandidate,
  CurrentlyPlaying,
  ListeningData,
  PlaylistDraft,
  RecentlyPlayedItem,
  ResolvedPlaylistItem,
  SpotifyArtist,
  SpotifyPlaylistSummary,
  SpotifyTrack,
  SpotifyUserProfile,
} from '../types/spotify';
import { matchTrackArtist } from './playlistCurator';
import { getValidAccessToken } from './spotifyAuth';
import { getDemoPlaylistTracks } from './demoData';

const API_BASE = 'https://api.spotify.com/v1';

async function spotifyFetch<T>(
  token: string,
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && !isRetry) {
    const refreshed = await getValidAccessToken();
    if (refreshed) {
      return spotifyFetch<T>(refreshed, endpoint, options, true);
    }
  }

  if (res.status === 204) {
    return null as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.error_description ||
      `Spotify API Error (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

export async function fetchAllListeningData(token: string): Promise<ListeningData> {
  const [
    profile,
    artistsShort,
    artistsMed,
    artistsLong,
    tracksShort,
    tracksMed,
    tracksLong,
    recentRes,
    currentlyPlaying,
    playlistsRes,
    savedTracksRes,
  ] = await Promise.all([
    spotifyFetch<SpotifyUserProfile>(token, '/me'),
    spotifyFetch<{ items: SpotifyArtist[] }>(
      token,
      '/me/top/artists?time_range=short_term&limit=25'
    ).catch(() => ({ items: [] })),
    spotifyFetch<{ items: SpotifyArtist[] }>(
      token,
      '/me/top/artists?time_range=medium_term&limit=25'
    ).catch(() => ({ items: [] })),
    spotifyFetch<{ items: SpotifyArtist[] }>(
      token,
      '/me/top/artists?time_range=long_term&limit=25'
    ).catch(() => ({ items: [] })),
    spotifyFetch<{ items: SpotifyTrack[] }>(
      token,
      '/me/top/tracks?time_range=short_term&limit=25'
    ).catch(() => ({ items: [] })),
    spotifyFetch<{ items: SpotifyTrack[] }>(
      token,
      '/me/top/tracks?time_range=medium_term&limit=25'
    ).catch(() => ({ items: [] })),
    spotifyFetch<{ items: SpotifyTrack[] }>(
      token,
      '/me/top/tracks?time_range=long_term&limit=25'
    ).catch(() => ({ items: [] })),
    spotifyFetch<{ items: RecentlyPlayedItem[] }>(
      token,
      '/me/player/recently-played?limit=50'
    ).catch(() => ({ items: [] })),
    spotifyFetch<CurrentlyPlaying | null>(
      token,
      '/me/player/currently-playing'
    ).catch(() => null),
    spotifyFetch<{ items: SpotifyPlaylistSummary[] }>(
      token,
      '/me/playlists?limit=50'
    ).catch(() => ({ items: [] })),
    spotifyFetch<{ items: { track: SpotifyTrack }[]; total: number }>(
      token,
      '/me/tracks?limit=50'
    ).catch(() => ({ items: [], total: 0 })),
  ]);

  const shortArtists = artistsShort.items || [];
  const medArtists = artistsMed.items || [];
  const longArtists = artistsLong.items || [];

  // Identify artists from top tracks that might have rich genres/images
  const knownArtistMap = new Map<string, SpotifyArtist>();
  for (const a of [...shortArtists, ...medArtists, ...longArtists]) {
    if (a?.id) knownArtistMap.set(a.id, a);
  }

  const candidateArtistIds = new Set<string>();
  for (const t of [
    ...(tracksShort.items || []),
    ...(tracksMed.items || []),
    ...(tracksLong.items || []),
    ...(recentRes.items || []).map((r) => r.track),
  ]) {
    for (const a of t.artists || []) {
      if (a.id && (!knownArtistMap.has(a.id) || !knownArtistMap.get(a.id)?.genres?.length)) {
        candidateArtistIds.add(a.id);
      }
    }
  }

  const idsToFetch = Array.from(candidateArtistIds).slice(0, 50);
  if (idsToFetch.length > 0) {
    try {
      const batchRes = await spotifyFetch<{ artists: SpotifyArtist[] }>(
        token,
        `/artists?ids=${idsToFetch.join(',')}`
      );
      for (const a of batchRes?.artists || []) {
        if (a?.id) knownArtistMap.set(a.id, a);
      }
    } catch {
      // Non-fatal if batch artist enrichment is skipped
    }
  }

  // Merge enriched artists into short_term if short_term was sparse
  const enrichedList = Array.from(knownArtistMap.values());
  const finalShortArtists =
    shortArtists.length >= 10
      ? shortArtists.map((a) => knownArtistMap.get(a.id) || a)
      : enrichedList.slice(0, 25);

  // Deduplicate recently played tracks so repeat plays of the same song appear only once
  const seenRecentTrackIds = new Set<string>();
  const deduplicatedRecent: RecentlyPlayedItem[] = [];
  for (const item of recentRes.items || []) {
    if (item.track?.id && !seenRecentTrackIds.has(item.track.id)) {
      seenRecentTrackIds.add(item.track.id);
      deduplicatedRecent.push(item);
    }
  }

  const playlists: SpotifyPlaylistSummary[] = [...(playlistsRes.items || [])];
  if (
    savedTracksRes.total > 0 ||
    (savedTracksRes.items && savedTracksRes.items.length > 0)
  ) {
    playlists.unshift({
      id: 'liked-songs',
      name: 'Lagu yang Disukai (Liked Songs)',
      description: 'Semua lagu favorit yang kamu simpan di koleksi Spotify kamu',
      public: false,
      tracks: { total: savedTracksRes.total || savedTracksRes.items.length },
      images: [
        {
          url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
        },
      ],
      external_urls: { spotify: 'https://open.spotify.com/collection/tracks' },
    });
  }

  return {
    profile,
    topArtists: {
      short_term: finalShortArtists,
      medium_term: medArtists.length ? medArtists : finalShortArtists,
      long_term: longArtists.length ? longArtists : finalShortArtists,
    },
    topTracks: {
      short_term: tracksShort.items || [],
      medium_term: tracksMed.items || [],
      long_term: tracksLong.items || [],
    },
    recentlyPlayed: deduplicatedRecent,
    currentlyPlaying,
    playlists,
  };
}

export async function resolveCandidatesInParallel(
  token: string,
  candidates: CuratedCandidate[],
  onProgress?: (completed: number, total: number) => void
): Promise<{ items: ResolvedPlaylistItem[]; skipped: CuratedCandidate[] }> {
  const BATCH_SIZE = 5;
  const items: ResolvedPlaylistItem[] = [];
  const skipped: CuratedCandidate[] = [];
  const seenTrackIds = new Set<string>();

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (candidate) => {
        try {
          const cleanTitle = candidate.title
            .replace(/\s*\(feat\..*?\)/i, '')
            .replace(/\s*\[feat\..*?\]/i, '')
            .replace(/[^\w\s\u00C0-\u024F]/gi, ' ')
            .trim();
          const cleanArtist = candidate.artist
            .replace(/[^\w\s\u00C0-\u024F]/gi, ' ')
            .trim();

          const query = `${cleanArtist} ${cleanTitle}`.trim();
          const res = await spotifyFetch<{ tracks?: { items: SpotifyTrack[] } }>(
            token,
            `/search?q=${encodeURIComponent(query)}&type=track&limit=5`
          );
          const foundTracks = res?.tracks?.items || [];
          let bestMatch = matchTrackArtist(foundTracks, candidate.artist);

          // Fallback matching if exact artist match missed
          if (!bestMatch && foundTracks.length > 0) {
            const normCandidateTitle = candidate.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            const matchedByTitle = foundTracks.find((t) => {
              const normTrackTitle = t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              return (
                normTrackTitle === normCandidateTitle ||
                normTrackTitle.includes(normCandidateTitle) ||
                normCandidateTitle.includes(normTrackTitle)
              );
            });
            bestMatch = matchedByTitle || foundTracks[0];
          }

          return { candidate, track: bestMatch };
        } catch {
          return { candidate, track: null };
        }
      })
    );

    for (const res of batchResults) {
      if (res.track && !seenTrackIds.has(res.track.id)) {
        seenTrackIds.add(res.track.id);
        items.push({ candidate: res.candidate, track: res.track });
      } else {
        skipped.push(res.candidate);
      }
    }

    onProgress?.(Math.min(i + BATCH_SIZE, candidates.length), candidates.length);
  }

  return { items, skipped };
}

export async function searchTracksLive(
  token: string,
  query: string
): Promise<SpotifyTrack[]> {
  if (!query.trim()) return [];
  try {
    const res = await spotifyFetch<{ tracks?: { items: SpotifyTrack[] } }>(
      token,
      `/search?q=${encodeURIComponent(query.trim())}&type=track&limit=10`
    );
    return res?.tracks?.items || [];
  } catch {
    return [];
  }
}

export async function fetchPlaylistTracks(
  token: string,
  playlistId: string
): Promise<SpotifyTrack[]> {
  try {
    if (playlistId.startsWith('demo-') || playlistId === 'pl1' || playlistId === 'pl2') {
      return getDemoPlaylistTracks(playlistId);
    }

    if (playlistId === 'liked-songs') {
      const res = await spotifyFetch<{
        items: { track: SpotifyTrack | null }[];
      }>(token, '/me/tracks?limit=50');
      return (res?.items || [])
        .map((item) => item.track)
        .filter((t): t is SpotifyTrack => Boolean(t && t.id && t.name));
    }

    const res = await spotifyFetch<{
      items: { track: SpotifyTrack | null }[];
    }>(token, `/playlists/${playlistId}/tracks?limit=50`);
    return (res?.items || [])
      .map((item) => item.track)
      .filter((t): t is SpotifyTrack => Boolean(t && t.id && t.name));
  } catch {
    return [];
  }
}

export async function createSpotifyPlaylist(
  token: string,
  draft: PlaylistDraft
): Promise<CreatedPlaylistResult> {
  const created = await spotifyFetch<{
    id: string;
    name: string;
    external_urls?: { spotify: string };
  }>(token, '/me/playlists', {
    method: 'POST',
    body: JSON.stringify({
      name: draft.name.trim() || 'AI Curated Playlist',
      description: draft.description.trim(),
      public: draft.isPublic,
    }),
  });

  const uris = draft.items.map((item) => item.track.uri);
  const BATCH_SIZE = 50;

  for (let i = 0; i < uris.length; i += BATCH_SIZE) {
    const batchUris = uris.slice(i, i + BATCH_SIZE);
    try {
      await spotifyFetch(token, `/playlists/${created.id}/tracks`, {
        method: 'POST',
        body: JSON.stringify({ uris: batchUris }),
      });
    } catch {
      await spotifyFetch(token, `/playlists/${created.id}/items`, {
        method: 'POST',
        body: JSON.stringify({ uris: batchUris }),
      });
    }
  }

  return {
    id: created.id,
    name: created.name,
    url:
      created.external_urls?.spotify ||
      `https://open.spotify.com/playlist/${created.id}`,
    trackCount: uris.length,
  };
}
