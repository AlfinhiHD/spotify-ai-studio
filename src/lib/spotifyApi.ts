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
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
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

function extractTrackFromPlaylistEntry(entry: any): SpotifyTrack | null {
  if (!entry || typeof entry !== 'object') return null;
  const raw = entry.item || entry.track || (entry.name && entry.artists ? entry : null);
  if (!raw || typeof raw !== 'object' || !raw.name) return null;
  if (raw.type === 'episode') return null;

  let id = raw.id || '';
  if (!id && typeof raw.uri === 'string' && raw.uri.startsWith('spotify:track:')) {
    id = raw.uri.split(':')[2] || '';
  }
  if (!id) return null;

  return {
    id,
    uri: raw.uri || `spotify:track:${id}`,
    name: raw.name,
    duration_ms: Number(raw.duration_ms) || 200000,
    popularity: typeof raw.popularity === 'number' ? raw.popularity : 60,
    preview_url: raw.preview_url || null,
    explicit: Boolean(raw.explicit),
    artists: Array.isArray(raw.artists) && raw.artists.length > 0
      ? raw.artists.map((a: any) => ({
          id: a?.id || a?.name || 'artist',
          name: a?.name || 'Unknown Artist',
        }))
      : [{ id: 'artist', name: 'Unknown Artist' }],
    album: {
      id: raw.album?.id || id,
      name: raw.album?.name || raw.name,
      images: Array.isArray(raw.album?.images) ? raw.album.images : [],
      release_date: raw.album?.release_date,
    },
    external_urls: raw.external_urls,
  };
}

function normalizePlaylistSummary(raw: any): SpotifyPlaylistSummary | null {
  if (!raw || typeof raw !== 'object' || !raw.id) return null;
  const totalCount =
    raw.items?.total ??
    raw.tracks?.total ??
    (Array.isArray(raw.items?.items) ? raw.items.items.length : undefined) ??
    (Array.isArray(raw.tracks?.items) ? raw.tracks.items.length : undefined) ??
    0;

  return {
    id: String(raw.id),
    name: String(raw.name || 'Untitled Playlist'),
    description: typeof raw.description === 'string' ? raw.description : '',
    public: Boolean(raw.public),
    collaborative: Boolean(raw.collaborative),
    owner: raw.owner?.id
      ? {
          id: String(raw.owner.id),
          display_name: raw.owner.display_name
            ? String(raw.owner.display_name)
            : undefined,
        }
      : undefined,
    tracks: { total: Number(totalCount) || 0 },
    images: Array.isArray(raw.images) ? raw.images.filter(Boolean) : [],
    external_urls: raw.external_urls,
  };
}

async function fetchPlaylistPages(
  token: string,
  initialUrl: string,
  maxPages = 10
): Promise<{ playlists: SpotifyPlaylistSummary[]; error?: Error }> {
  const playlists: SpotifyPlaylistSummary[] = [];
  const seenIds = new Set<string>();
  let nextUrl: string | null = initialUrl;
  let pageCount = 0;

  while (nextUrl && pageCount < maxPages) {
    pageCount++;
    try {
      const res: { items?: any[]; next?: string | null } =
        await spotifyFetch(token, nextUrl);
      if (res?.items && Array.isArray(res.items)) {
        for (const rawItem of res.items) {
          const normalized = normalizePlaylistSummary(rawItem);
          if (normalized && !seenIds.has(normalized.id)) {
            seenIds.add(normalized.id);
            playlists.push(normalized);
          }
        }
      }
      nextUrl = res?.next || null;
    } catch (err) {
      return {
        playlists,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }

  return { playlists };
}

export async function fetchAllUserPlaylists(
  token: string,
  userId?: string
): Promise<SpotifyPlaylistSummary[]> {
  const primary = await fetchPlaylistPages(token, '/me/playlists?limit=50', 10);
  if (primary.playlists.length > 0) {
    return primary.playlists;
  }

  if (userId) {
    const fallback = await fetchPlaylistPages(
      token,
      `/users/${encodeURIComponent(userId)}/playlists?limit=50`,
      10
    );
    if (fallback.playlists.length > 0 || (!fallback.error && !primary.error)) {
      return fallback.playlists;
    }
    if (primary.error) {
      throw primary.error;
    }
    throw fallback.error;
  }

  if (primary.error) {
    throw primary.error;
  }

  return [];
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
    spotifyFetch<{ items: { track: SpotifyTrack }[]; total: number }>(
      token,
      '/me/tracks?limit=50'
    ).catch(() => ({ items: [], total: 0 })),
  ]);

  let rawPlaylists: SpotifyPlaylistSummary[] = [];
  let playlistWarning: string | undefined;
  try {
    rawPlaylists = await fetchAllUserPlaylists(token, profile.id);
  } catch (err) {
    playlistWarning =
      err instanceof Error ? err.message : 'Gagal memuat playlist dari Spotify.';
  }

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

  const playlists: SpotifyPlaylistSummary[] = [...rawPlaylists];
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
    playlistWarning,
  };
}

export async function resolveCandidatesInParallel(
  token: string,
  candidates: CuratedCandidate[],
  onProgress?: (completed: number, total: number) => void,
  targetCount?: number
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
          const primaryArtist = candidate.artist.split(/[,&]|feat\.|ft\./i)[0]?.trim() || candidate.artist;
          const cleanArtist = primaryArtist
            .replace(/[^\w\s\u00C0-\u024F]/gi, ' ')
            .trim();

          const query = `${cleanArtist} ${cleanTitle}`.trim();
          const res = await spotifyFetch<{ tracks?: { items: SpotifyTrack[] } }>(
            token,
            `/search?q=${encodeURIComponent(query)}&type=track&limit=8`
          );
          const foundTracks = res?.tracks?.items || [];
          let bestMatch = matchTrackArtist(foundTracks, candidate.artist, candidate.title);

          // Fallback matching if exact artist match missed
          if (!bestMatch && foundTracks.length > 0) {
            const normCandidateTitle = candidate.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            const matchedByTitle = foundTracks.find((t) => {
              const normTrackTitle = t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              const isCoverOrKaraoke = /karaoke|tribute|8-bit|lullaby|made famous|ringtone/i.test(t.name);
              return (
                !isCoverOrKaraoke &&
                (normTrackTitle === normCandidateTitle ||
                  normTrackTitle.includes(normCandidateTitle) ||
                  normCandidateTitle.includes(normTrackTitle))
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

  // Smart Backfill: If some tracks failed resolution and we are below targetCount,
  // query Spotify catalog for deeper tracks by the seed artists so the playlist reaches targetCount
  const desiredCount = targetCount || candidates.length;
  if (items.length < desiredCount && candidates.length > 0) {
    const uniqueArtists = Array.from(
      new Set(
        candidates
          .map((c) => c.artist.split(/[,&]|feat\./i)[0]?.trim())
          .filter(Boolean)
      )
    ).slice(0, 6);

    for (const artistName of uniqueArtists) {
      if (items.length >= desiredCount) break;
      try {
        const res = await spotifyFetch<{ tracks?: { items: SpotifyTrack[] } }>(
          token,
          `/search?q=${encodeURIComponent(`artist:${artistName}`)}&type=track&limit=6`
        );
        const artistTracks = res?.tracks?.items || [];
        for (const t of artistTracks) {
          if (items.length >= desiredCount) break;
          const isKaraoke = /karaoke|tribute|instrumental|commentary/i.test(t.name);
          if (t?.id && !seenTrackIds.has(t.id) && !isKaraoke) {
            seenTrackIds.add(t.id);
            items.push({
              candidate: {
                artist: t.artists[0]?.name || artistName,
                title: t.name,
                phase: items.length < desiredCount * 0.5 ? 'Groove' : 'Peak',
                reason: `Deep cut ${t.artists[0]?.name || artistName} selaras mood`,
              },
              track: t,
            });
            break; // Max 1 extra track per seed artist per pass
          }
        }
      } catch {
        // Ignore backfill errors
      }
    }
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

function cleanPlaylistId(playlistId: string): string {
  return (playlistId || '')
    .replace(/^spotify:playlist:/, '')
    .replace(/^https?:\/\/open\.spotify\.com\/playlist\//, '')
    .split('?')[0]
    .trim();
}

async function fetchTrackPages(
  token: string,
  initialUrl: string,
  maxPages = 6
): Promise<{ tracks: SpotifyTrack[]; error?: Error }> {
  const tracks: SpotifyTrack[] = [];
  const seenIds = new Set<string>();
  let nextUrl: string | null = initialUrl;
  let pages = 0;

  while (nextUrl && pages < maxPages) {
    pages++;
    try {
      const res: { items?: any[]; next?: string | null } =
        await spotifyFetch(token, nextUrl);
      if (res?.items && Array.isArray(res.items)) {
        for (const entry of res.items) {
          const track = extractTrackFromPlaylistEntry(entry);
          if (track && !seenIds.has(track.id)) {
            seenIds.add(track.id);
            tracks.push(track);
          }
        }
      }
      nextUrl = res?.next || null;
    } catch (err) {
      return {
        tracks,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }

  return { tracks };
}

export async function fetchPlaylistTracks(
  token: string,
  playlistId: string,
  _playlistNameFallback?: string
): Promise<SpotifyTrack[]> {
  const cleanId = cleanPlaylistId(playlistId);
  if (!cleanId) return [];

  if (cleanId.startsWith('demo-') || cleanId === 'pl1' || cleanId === 'pl2') {
    return getDemoPlaylistTracks(cleanId);
  }

  if (cleanId === 'liked-songs') {
    const likedRes = await fetchTrackPages(token, '/me/tracks?limit=50', 6);
    if (likedRes.tracks.length === 0 && likedRes.error) {
      throw likedRes.error;
    }
    return likedRes.tracks;
  }

  // Strategy 1: Modern Spotify Feb 2026 endpoint (/playlists/{id}/items)
  const itemsRes = await fetchTrackPages(
    token,
    `/playlists/${cleanId}/items?limit=50`,
    6
  );
  if (itemsRes.tracks.length > 0) {
    return itemsRes.tracks;
  }

  // Strategy 2: Legacy Spotify endpoint (/playlists/{id}/tracks)
  const tracksRes = await fetchTrackPages(
    token,
    `/playlists/${cleanId}/tracks?limit=50`,
    6
  );
  if (tracksRes.tracks.length > 0) {
    return tracksRes.tracks;
  }

  // Strategy 3: Root playlist object (/playlists/{id}) inspecting .items.items and .tracks.items
  let rootError: Error | undefined;
  try {
    const full: any = await spotifyFetch(token, `/playlists/${cleanId}`);
    const rootEntries =
      full?.items?.items ||
      full?.tracks?.items ||
      (Array.isArray(full?.items) ? full.items : null) ||
      (Array.isArray(full?.tracks) ? full.tracks : null) ||
      [];
    if (Array.isArray(rootEntries) && rootEntries.length > 0) {
      const seenIds = new Set<string>();
      const rootTracks: SpotifyTrack[] = [];
      for (const entry of rootEntries) {
        const track = extractTrackFromPlaylistEntry(entry);
        if (track && !seenIds.has(track.id)) {
          seenIds.add(track.id);
          rootTracks.push(track);
        }
      }
      if (rootTracks.length > 0) {
        return rootTracks;
      }
    }
    return [];
  } catch (err) {
    rootError = err instanceof Error ? err : new Error(String(err));
  }

  const finalError = rootError || itemsRes.error || tracksRes.error;
  if (finalError) {
    throw finalError;
  }

  return [];
}

async function resolveValidSpotifyUris(
  token: string,
  items: ResolvedPlaylistItem[]
): Promise<string[]> {
  const validUris: string[] = [];

  for (const item of items) {
    let uri = item.track?.uri || '';
    if (!uri && item.track?.id && /^[0-9a-zA-Z]{22}$/.test(item.track.id)) {
      uri = `spotify:track:${item.track.id}`;
    }

    // If it's a demo or invalid URI, attempt on-the-fly resolution via Spotify Search
    if (!/^spotify:track:[0-9a-zA-Z]{22}$/.test(uri)) {
      const artist = item.candidate?.artist || item.track?.artists?.[0]?.name || '';
      const title = item.candidate?.title || item.track?.name || '';
      if (artist && title) {
        try {
          const searchRes = await spotifyFetch<{ tracks?: { items: SpotifyTrack[] } }>(
            token,
            `/search?q=${encodeURIComponent(`${artist} ${title}`)}&type=track&limit=1`
          );
          const realTrack = searchRes?.tracks?.items?.[0];
          if (realTrack?.uri && /^spotify:track:[0-9a-zA-Z]{22}$/.test(realTrack.uri)) {
            uri = realTrack.uri;
          }
        } catch {
          // Skip if search fails
        }
      }
    }

    if (/^spotify:track:[0-9a-zA-Z]{22}$/.test(uri)) {
      validUris.push(uri);
    }
  }

  if (validUris.length === 0) {
    throw new Error(
      'Tidak ada lagu Spotify riil yang valid untuk disimpan. Pastikan akun Spotify terhubung & racik playlist baru.'
    );
  }

  return validUris;
}

async function addPlaylistItemsBatched(
  token: string,
  playlistId: string,
  uris: string[]
): Promise<void> {
  const BATCH_SIZE = 50;
  for (let i = 0; i < uris.length; i += BATCH_SIZE) {
    const batchUris = uris.slice(i, i + BATCH_SIZE);
    try {
      await spotifyFetch(token, `/playlists/${playlistId}/items`, {
        method: 'POST',
        body: JSON.stringify({ uris: batchUris }),
      });
    } catch {
      await spotifyFetch(token, `/playlists/${playlistId}/tracks`, {
        method: 'POST',
        body: JSON.stringify({ uris: batchUris }),
      });
    }
  }
}

export async function createSpotifyPlaylist(
  token: string,
  draft: PlaylistDraft,
  userId?: string
): Promise<CreatedPlaylistResult> {
  const validUris = await resolveValidSpotifyUris(token, draft.items);

  const payload = JSON.stringify({
    name: draft.name.trim() || 'AI Curated Playlist',
    description: draft.description.trim(),
    public: draft.isPublic,
  });

  let created: {
    id: string;
    name: string;
    external_urls?: { spotify: string };
  };

  try {
    created = await spotifyFetch(token, '/me/playlists', {
      method: 'POST',
      body: payload,
    });
  } catch (err) {
    if (!userId) throw err;
    created = await spotifyFetch(
      token,
      `/users/${encodeURIComponent(userId)}/playlists`,
      {
        method: 'POST',
        body: payload,
      }
    );
  }

  await addPlaylistItemsBatched(token, created.id, validUris);

  return {
    id: created.id,
    name: created.name,
    url:
      created.external_urls?.spotify ||
      `https://open.spotify.com/playlist/${created.id}`,
    trackCount: validUris.length,
  };
}

export async function updateSpotifyPlaylist(
  token: string,
  playlistId: string,
  draft: PlaylistDraft
): Promise<CreatedPlaylistResult> {
  const cleanId = cleanPlaylistId(playlistId);
  if (!cleanId || cleanId === 'liked-songs' || cleanId.startsWith('demo-')) {
    throw new Error('Playlist ini tidak bisa ditimpa langsung; gunakan Simpan Sebagai Playlist Baru.');
  }

  const validUris = await resolveValidSpotifyUris(token, draft.items);
  const nextName = draft.name.trim() || 'AI Curated Playlist';

  await spotifyFetch(token, `/playlists/${cleanId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: nextName,
      description: draft.description.trim(),
      public: draft.isPublic,
    }),
  });

  // Replace up to first 100 tracks in exact order, then append overflow if any
  const firstBatch = validUris.slice(0, 100);
  try {
    await spotifyFetch(token, `/playlists/${cleanId}/items`, {
      method: 'PUT',
      body: JSON.stringify({ uris: firstBatch }),
    });
  } catch {
    await spotifyFetch(token, `/playlists/${cleanId}/tracks`, {
      method: 'PUT',
      body: JSON.stringify({ uris: firstBatch }),
    });
  }

  if (validUris.length > 100) {
    await addPlaylistItemsBatched(token, cleanId, validUris.slice(100));
  }

  return {
    id: cleanId,
    name: nextName,
    url: `https://open.spotify.com/playlist/${cleanId}`,
    trackCount: validUris.length,
  };
}
