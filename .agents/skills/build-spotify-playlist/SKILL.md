---
name: build-spotify-playlist
description: "Generates Spotify playlists using Spotify Web API and AI curation. Use when user wants to create a playlist based on mood, genre, similar artists, or any theme. Handles auth, track discovery, playlist creation, and adding tracks."
---

# Build Spotify Playlist

## Workflow
1. **Authenticate** via Spotify OAuth 2.0 PKCE (`https://accounts.spotify.com/authorize`, redirect `/callback`).
2. **Generate Track List (AI as Recommender)**:
   - Do NOT use deprecated `/v1/recommendations`.
   - Generate ~20-25 artist/track pairs based on user request and optional Spotify Listening DNA (`/me/top/artists`, `/me/top/tracks`).
   - Cycle through artists (`interleaveByArtist`) so tracks by the same artist are never grouped consecutively.
   - Mix well-known tracks with deeper cuts across an energy arc (`Warmup` -> `Groove` -> `Peak` -> `Cooldown`).
3. **Search for Tracks in Parallel**:
   - Query `GET /v1/search?q=Artist+Track&type=track&limit=3` in parallel batches of 5.
   - Pick the first result matching the target artist (`matchTrackArtist`).
4. **Create & Populate Playlist**:
   - `POST /v1/me/playlists` (`public: false` by default).
   - `POST /v1/playlists/{id}/tracks` (with fallback to `POST /v1/playlists/{id}/items`) in batches of up to 50 tracks.
