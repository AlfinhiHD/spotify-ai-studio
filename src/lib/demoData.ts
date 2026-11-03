import {
  CuratedCandidate,
  ListeningData,
  ResolvedPlaylistItem,
  SpotifyTrack,
} from '../types/spotify';

const DEMO_TRACKS: SpotifyTrack[] = [
  {
    id: '3xKsf9qdS1CyvXSMEid6g8',
    uri: 'spotify:track:3xKsf9qdS1CyvXSMEid6g8',
    name: 'Evaluasi',
    duration_ms: 194000,
    popularity: 86,
    explicit: false,
    artists: [{ id: '51kyrUsAVqUBcoDEMFkX12', name: 'Hindia' }],
    album: {
      id: 'alb1',
      name: 'Menari Dengan Bayangan',
      release_date: '2019-11-29',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    external_urls: { spotify: 'https://open.spotify.com/track/3xKsf9qdS1CyvXSMEid6g8' },
  },
  {
    id: '5TTXEcfsYLh6fTarLaevTi',
    uri: 'spotify:track:5TTXEcfsYLh6fTarLaevTi',
    name: 'lowkey',
    duration_ms: 171000,
    popularity: 88,
    explicit: true,
    artists: [{ id: '2kxP07DLgs4xlWz8YHlvfh', name: 'NIKI' }],
    album: {
      id: 'alb2',
      name: 'wanna take this downtown?',
      release_date: '2019-05-17',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    external_urls: { spotify: 'https://open.spotify.com/track/5TTXEcfsYLh6fTarLaevTi' },
  },
  {
    id: '1fbA9N3vK5pL2mX8qR9sTu',
    uri: 'spotify:track:1fbA9N3vK5pL2mX8qR9sTu',
    name: "la la la that's how it goes",
    duration_ms: 219000,
    popularity: 77,
    explicit: false,
    artists: [{ id: '0Vw76uk7P8yVtTClWyOhac', name: 'HONNE' }],
    album: {
      id: 'alb3',
      name: 'no song without you',
      release_date: '2020-07-03',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    external_urls: { spotify: 'https://open.spotify.com/track/1fbA9N3vK5pL2mX8qR9sTu' },
  },
  {
    id: '4mN7bV8cZ1xQ2wE3rT4yUi',
    uri: 'spotify:track:4mN7bV8cZ1xQ2wE3rT4yUi',
    name: 'Untungnya, Hidup Harus Tetap Berjalan',
    duration_ms: 183000,
    popularity: 91,
    explicit: false,
    artists: [{ id: '7n2wHs1TKAczGzO7Dd2rGr', name: 'Bernadya' }],
    album: {
      id: 'alb4',
      name: 'Sialnya, Hidup Harus Tetap Berjalan',
      release_date: '2024-06-24',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    external_urls: { spotify: 'https://open.spotify.com/track/4mN7bV8cZ1xQ2wE3rT4yUi' },
  },
  {
    id: '5pQ8rS9tU0vW1xY2zA3bCd',
    uri: 'spotify:track:5pQ8rS9tU0vW1xY2zA3bCd',
    name: 'Malibu Nights',
    duration_ms: 286000,
    popularity: 84,
    explicit: false,
    artists: [{ id: '49tQo2QULno7gxHutgccqF', name: 'LANY' }],
    album: {
      id: 'alb5',
      name: 'Malibu Nights',
      release_date: '2018-10-05',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    external_urls: { spotify: 'https://open.spotify.com/track/5pQ8rS9tU0vW1xY2zA3bCd' },
  },
  {
    id: '6eF7gH8iJ9kL0mN1oP2qRs',
    uri: 'spotify:track:6eF7gH8iJ9kL0mN1oP2qRs',
    name: 'Show Me How',
    duration_ms: 215000,
    popularity: 79,
    explicit: false,
    artists: [{ id: '3zmfs9cQwzJl575W1ZYXeT', name: 'Men I Trust' }],
    album: {
      id: 'alb6',
      name: 'Oncle Jazz',
      release_date: '2019-09-13',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    external_urls: { spotify: 'https://open.spotify.com/track/6eF7gH8iJ9kL0mN1oP2qRs' },
  },
  {
    id: '7tU8vW9xY0zA1bC2dE3fGh',
    uri: 'spotify:track:7tU8vW9xY0zA1bC2dE3fGh',
    name: 'Hati-Hati di Jalan',
    duration_ms: 242000,
    popularity: 87,
    explicit: false,
    artists: [{ id: '2iDVt6mFbtbDEZG5ax0dTi', name: 'Tulus' }],
    album: {
      id: 'alb7',
      name: 'Manusia',
      release_date: '2022-03-03',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    external_urls: { spotify: 'https://open.spotify.com/track/7tU8vW9xY0zA1bC2dE3fGh' },
  },
  {
    id: '8iJ9kL0mN1oP2qR3sT4uVw',
    uri: 'spotify:track:8iJ9kL0mN1oP2qR3sT4uVw',
    name: 'Pluto Projector',
    duration_ms: 267000,
    popularity: 82,
    explicit: false,
    artists: [{ id: '7pbDxGE6nQSZVfiFdq9lOL', name: 'Rex Orange County' }],
    album: {
      id: 'alb8',
      name: 'Pony',
      release_date: '2019-10-25',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    external_urls: { spotify: 'https://open.spotify.com/track/8iJ9kL0mN1oP2qR3sT4uVw' },
  },
];

export const DEMO_LISTENING_DATA: ListeningData = {
  profile: {
    id: 'demo_spotify_user',
    display_name: 'Pratinjau Studio',
    product: 'premium',
    followers: { total: 142 },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
    ],
  },
  topArtists: {
    short_term: [
      {
        id: 'a1',
        name: 'Hindia',
        genres: ['indonesian indie', 'indonesian pop', 'indonesian alternative rock'],
        popularity: 84,
        images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80' }],
      },
      {
        id: 'a2',
        name: 'NIKI',
        genres: ['indonesian r&b', 'alt z', 'pop'],
        popularity: 86,
        images: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80' }],
      },
      {
        id: 'a3',
        name: 'HONNE',
        genres: ['uk contemporary r&b', 'indie soul', 'synth pop'],
        popularity: 77,
        images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80' }],
      },
      {
        id: 'a4',
        name: 'Rex Orange County',
        genres: ['bedroom pop', 'indie pop'],
        popularity: 81,
        images: [{ url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=200&q=80' }],
      },
      {
        id: 'a5',
        name: 'Bernadya',
        genres: ['indonesian pop', 'indonesian indie'],
        popularity: 89,
        images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=200&q=80' }],
      },
      {
        id: 'a6',
        name: 'LANY',
        genres: ['la pop', 'indie pop', 'synth pop'],
        popularity: 82,
        images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=200&q=80' }],
      },
      {
        id: 'a7',
        name: 'Men I Trust',
        genres: ['indie soul', 'dream pop', 'bedroom pop'],
        popularity: 74,
        images: [{ url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=200&q=80' }],
      },
      {
        id: 'a8',
        name: 'Tulus',
        genres: ['indonesian pop', 'indonesian jazz'],
        popularity: 85,
        images: [{ url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=200&q=80' }],
      },
    ],
    medium_term: [],
    long_term: [],
  },
  topTracks: {
    short_term: DEMO_TRACKS,
    medium_term: DEMO_TRACKS,
    long_term: DEMO_TRACKS.slice(2),
  },
  recentlyPlayed: DEMO_TRACKS.map((track, idx) => ({
    track,
    played_at: new Date(Date.now() - idx * 45 * 60 * 1000).toISOString(),
  })),
  currentlyPlaying: {
    is_playing: false,
    progress_ms: 42000,
    item: DEMO_TRACKS[0],
  },
  playlists: [
    {
      id: 'demo-liked-songs',
      name: 'Lagu yang Disukai (Liked Songs)',
      description: 'Semua lagu favorit yang kamu simpan di koleksi Spotify kamu',
      images: [
        {
          url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
        },
      ],
      tracks: { total: 18 },
    },
    {
      id: 'demo-rex-orange',
      name: 'Melancholic Bedroom Pop & Regret',
      description: 'Nuansa Rex Orange County, Clairo, Wallows & Men I Trust',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80',
        },
      ],
      tracks: { total: 15 },
    },
    {
      id: 'demo-indo-indie',
      name: 'Ruang Dengar // Indie Indonesia',
      description: 'Hindia, Bernadya, Reality Club, Sal Priadi, Tulus',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
        },
      ],
      tracks: { total: 20 },
    },
    {
      id: 'demo-night-drive',
      name: 'Neon Expressway // Night Drive',
      description: 'The Weeknd, Kavinsky, Daft Punk, Arctic Monkeys, 120 BPM',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80',
        },
      ],
      tracks: { total: 16 },
    },
  ],
};

export function getDemoPlaylistTracks(playlistId: string): SpotifyTrack[] {
  if (playlistId === 'demo-rex-orange') {
    return [
      {
        id: 'roc_hannah',
        uri: 'spotify:track:4cOdK2wGLETKBW3PvgPWqT',
        name: 'Hannah Montana',
        duration_ms: 198000,
        popularity: 88,
        explicit: false,
        artists: [{ id: 'roc1', name: 'Rex Orange County' }],
        album: {
          id: 'roc_alb',
          name: 'Dream Fatigue',
          release_date: '2024-07-18',
          images: [{ url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80' }],
        },
      },
      {
        id: 'roc_pluto',
        uri: 'spotify:track:1AhDOtG9vPSOmsWgNW0BEY',
        name: 'Pluto Projector',
        duration_ms: 267000,
        popularity: 91,
        explicit: false,
        artists: [{ id: 'roc1', name: 'Rex Orange County' }],
        album: {
          id: 'roc_alb2',
          name: 'Pony',
          release_date: '2019-10-25',
          images: [{ url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80' }],
        },
      },
      {
        id: 'clairo_bags',
        uri: 'spotify:track:6UFivO2zqqPFPoQYsKioC8',
        name: 'Bags',
        duration_ms: 260000,
        popularity: 85,
        explicit: false,
        artists: [{ id: 'clairo1', name: 'Clairo' }],
        album: {
          id: 'clairo_alb',
          name: 'Immunity',
          release_date: '2019-08-02',
          images: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80' }],
        },
      },
      {
        id: 'mit_showme',
        uri: 'spotify:track:01Iu55ho4vNgPT1Bm9al5S',
        name: 'Show Me How',
        duration_ms: 215000,
        popularity: 87,
        explicit: false,
        artists: [{ id: 'mit1', name: 'Men I Trust' }],
        album: {
          id: 'mit_alb',
          name: 'Oncle Jazz',
          release_date: '2019-09-13',
          images: [{ url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=300&q=80' }],
        },
      },
      {
        id: 'wallows_bored',
        uri: 'spotify:track:57RA3r9mOGF30C0SpbtIM5',
        name: 'Are You Bored Yet? (feat. Clairo)',
        duration_ms: 178000,
        popularity: 89,
        explicit: false,
        artists: [{ id: 'wallows1', name: 'Wallows' }, { id: 'clairo1', name: 'Clairo' }],
        album: {
          id: 'wallows_alb',
          name: 'Nothing Happens',
          release_date: '2019-03-22',
          images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80' }],
        },
      },
    ];
  }

  if (playlistId === 'demo-night-drive') {
    return [
      {
        id: 'kavinsky_nc',
        uri: 'spotify:track:0U0ldCRmgCqhVvD6ksH633',
        name: 'Nightcall',
        duration_ms: 259000,
        popularity: 88,
        explicit: false,
        artists: [{ id: 'kav1', name: 'Kavinsky' }],
        album: {
          id: 'kav_alb',
          name: 'OutRun',
          release_date: '2013-02-22',
          images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80' }],
        },
      },
      {
        id: 'weeknd_bl',
        uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
        name: 'Blinding Lights',
        duration_ms: 200000,
        popularity: 96,
        explicit: false,
        artists: [{ id: 'tw1', name: 'The Weeknd' }],
        album: {
          id: 'tw_alb',
          name: 'After Hours',
          release_date: '2020-03-20',
          images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80' }],
        },
      },
      {
        id: 'daft_instant',
        uri: 'spotify:track:2cGxRwrMygjFyNTv0BDxi0',
        name: 'Instant Crush (feat. Julian Casablancas)',
        duration_ms: 337000,
        popularity: 89,
        explicit: false,
        artists: [{ id: 'dp1', name: 'Daft Punk' }],
        album: {
          id: 'dp_alb',
          name: 'Random Access Memories',
          release_date: '2013-05-17',
          images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80' }],
        },
      },
      {
        id: 'am_505',
        uri: 'spotify:track:0BxE48rsqTy9yJWjQg5mqq',
        name: '505',
        duration_ms: 253000,
        popularity: 92,
        explicit: false,
        artists: [{ id: 'am1', name: 'Arctic Monkeys' }],
        album: {
          id: 'am_alb',
          name: 'Favourite Worst Nightmare',
          release_date: '2007-04-23',
          images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80' }],
        },
      },
    ];
  }

  // Default: Indo Indie & Liked songs
  return DEMO_TRACKS;
}

DEMO_LISTENING_DATA.topArtists.medium_term =
  DEMO_LISTENING_DATA.topArtists.short_term.slice(0, 6);
DEMO_LISTENING_DATA.topArtists.long_term =
  DEMO_LISTENING_DATA.topArtists.short_term.slice(2);

export function resolveCandidatesDemo(
  candidates: CuratedCandidate[]
): { items: ResolvedPlaylistItem[]; skipped: CuratedCandidate[] } {
  const coverPool = DEMO_TRACKS.map((t) => t.album.images[0]?.url);
  const items: ResolvedPlaylistItem[] = candidates.map((candidate, idx) => ({
    candidate,
    track: {
      id: `demo_track_${idx}`,
      uri: `spotify:track:demo_${idx}`,
      name: candidate.title,
      duration_ms: 185000 + (idx % 5) * 19000,
      popularity: 72 + (idx % 22),
      artists: [{ id: `demo_artist_${idx}`, name: candidate.artist }],
      album: {
        id: `demo_album_${idx}`,
        name: `${candidate.title} - Single`,
        release_date: `${2018 + (idx % 7)}-05-12`,
        images: [{ url: coverPool[idx % coverPool.length] }],
      },
      external_urls: {
        spotify: `https://open.spotify.com/search/${encodeURIComponent(
          `${candidate.artist} ${candidate.title}`
        )}`,
      },
    },
  }));
  return { items, skipped: [] };
}
