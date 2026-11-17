import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createSpotifyPlaylist,
  fetchAllUserPlaylists,
  fetchPlaylistTracks,
  updateSpotifyPlaylist,
} from '../spotifyApi';
import { PlaylistDraft, SpotifyTrack } from '../../types/spotify';

const SAMPLE_TRACK: SpotifyTrack = {
  id: '3xKsf9qdS1CyvXSMEid6g8',
  uri: 'spotify:track:3xKsf9qdS1CyvXSMEid6g8',
  name: 'Evaluasi',
  duration_ms: 194000,
  artists: [{ id: 'a1', name: 'Hindia' }],
  album: { id: 'al1', name: 'Menari Dengan Bayangan', images: [] },
};

const SAMPLE_DRAFT: PlaylistDraft = {
  name: 'Updated Mix',
  description: 'Mix updated from studio',
  isPublic: true,
  prompt: 'test',
  curationSource: 'smart-spotify',
  skipped: [],
  items: [
    {
      candidate: { artist: 'Hindia', title: 'Evaluasi', phase: 'Peak', reason: 'Test' },
      track: SAMPLE_TRACK,
    },
  ],
};

describe('spotifyApi playlists & saving', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back to /users/{userId}/playlists when /me/playlists fails and propagates errors if both fail', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: 'Forbidden' } }), { status: 403 })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [
              {
                id: 'pl_real_1',
                name: 'My Real Playlist',
                owner: { id: 'user_123' },
                items: { total: 12 },
              },
            ],
            next: null,
          }),
          { status: 200 }
        )
      );

    const playlists = await fetchAllUserPlaylists('tok', 'user_123');
    expect(playlists).toHaveLength(1);
    expect(playlists[0]).toMatchObject({
      id: 'pl_real_1',
      name: 'My Real Playlist',
      owner: { id: 'user_123' },
      tracks: { total: 12 },
    });
    expect(String(fetchMock.mock.calls[1][0])).toContain('/users/user_123/playlists');

    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: { message: 'Forbidden' } }), { status: 403 })
      )
    );
    await expect(fetchAllUserPlaylists('tok', 'user_123')).rejects.toThrow('Forbidden');
  });

  it('reads Feb 2026 /items format, returns [] for genuinely empty playlists without fake search, and throws on 403', async () => {
    const fetchOk = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          items: [{ item: SAMPLE_TRACK }],
          next: null,
        }),
        { status: 200 }
      )
    );

    const tracks = await fetchPlaylistTracks('tok', 'playlist_abc');
    expect(tracks).toHaveLength(1);
    expect(tracks[0].id).toBe(SAMPLE_TRACK.id);
    expect(String(fetchOk.mock.calls[0][0])).toContain('/playlists/playlist_abc/items');

    // Empty playlist across /items, /tracks, and /playlists/{id} must return [] and NEVER call /search
    const fetchEmpty = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'empty1', items: { items: [] } }), { status: 200 }));

    const emptyTracks = await fetchPlaylistTracks('tok', 'empty1', 'My Playlist Name');
    expect(emptyTracks).toEqual([]);
    expect(fetchEmpty.mock.calls.some((c) => String(c[0]).includes('/search'))).toBe(false);

    // 403 across all playlist endpoints throws error instead of returning fake tracks
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: { message: 'Insufficient client scope' } }), {
          status: 403,
        })
      )
    );
    await expect(fetchPlaylistTracks('tok', 'blocked1', 'Secret Mix')).rejects.toThrow(
      'Insufficient client scope'
    );
  });

  it('updates existing Spotify playlist metadata and replaces tracks', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 200 })) // PUT /playlists/{id}
      .mockResolvedValueOnce(new Response(null, { status: 200 })); // PUT /playlists/{id}/items

    const res = await updateSpotifyPlaylist('tok', '37i9dQZF1DXcBWIGoYBM5M', SAMPLE_DRAFT);
    expect(res).toEqual({
      id: '37i9dQZF1DXcBWIGoYBM5M',
      name: 'Updated Mix',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
      trackCount: 1,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M',
      expect.objectContaining({ method: 'PUT' })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/items',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ uris: [SAMPLE_TRACK.uri] }),
      })
    );

    await expect(updateSpotifyPlaylist('tok', 'liked-songs', SAMPLE_DRAFT)).rejects.toThrow(
      /tidak bisa ditimpa/i
    );
  });

  it('falls back to /users/{userId}/playlists when creating playlist if /me/playlists fails', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: 'Not Found' } }), { status: 404 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'new_pl_1', name: 'Updated Mix' }), { status: 201 })
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ snapshot_id: 'snap1' }), { status: 201 }));

    const created = await createSpotifyPlaylist('tok', SAMPLE_DRAFT, 'user_123');
    expect(created.id).toBe('new_pl_1');
    expect(created.trackCount).toBe(1);
    expect(String(fetchMock.mock.calls[1][0])).toContain('/users/user_123/playlists');
  });
});
