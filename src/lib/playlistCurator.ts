import {
  CuratedCandidate,
  EnergyPhase,
  ListeningData,
  MassiveDnaAnalytics,
  SpotifyArtist,
  SpotifyTrack,
  TimeRange,
} from '../types/spotify';

export interface VibePreset {
  id: string;
  label: string;
  badge: string;
  image: string;
  prompt: string;
  defaultTitle: string;
  defaultDescription: string;
  seeds: { artist: string; title: string; reason: string }[];
}

export const VIBE_PRESETS: VibePreset[] = [
  {
    id: 'late-night-coding',
    label: 'Late Night Coding & Focus',
    badge: 'Focus • Alt-R&B • Dream Pop',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
    prompt:
      'Lagu chill malam hari untuk fokus ngoding: perpaduan indie pop, alt-R&B, dream pop, dan mellow elektronik dengan energy arc yang halus',
    defaultTitle: 'Midnight Compiler // Deep Focus Flow',
    defaultDescription:
      'Kurasi AI Studio: ritme hangat untuk fokus malam hari — HONNE, Rex Orange County, NIKI, LANY, Men I Trust & lainnya.',
    seeds: [
      { artist: 'Men I Trust', title: 'Show Me How', reason: 'Bassline lembut pembuka fokus' },
      { artist: 'LANY', title: 'Malibu Nights', reason: 'Ambient synth pop malam hari' },
      { artist: 'NIKI', title: 'lowkey', reason: 'Alt-R&B sleek dengan groove tenang' },
      { artist: 'HONNE', title: "la la la that's how it goes", reason: 'Warm synth-soul mid-tempo' },
      { artist: 'Rex Orange County', title: 'Pluto Projector', reason: 'Orchestral bedroom pop' },
      { artist: 'Hindia', title: 'Evaluasi', reason: 'Anthem reflektif pengantar fokus' },
      { artist: 'Cigarettes After Sex', title: 'Apocalypse', reason: 'Dream pop atmosferik' },
      { artist: 'Daniel Caesar', title: 'Best Part (feat. H.E.R.)', reason: 'Warm acoustic R&B' },
      { artist: 'Reality Club', title: 'Anything You Want', reason: 'Indie rock melodis' },
      { artist: 'Khruangbin', title: 'Texas Sun', reason: 'Psychedelic soul groove santai' },
      { artist: 'Joji', title: 'Glimpse of Us', reason: 'Ballad emosional tengah malam' },
      { artist: 'Mac DeMarco', title: 'Chamber Of Reflection', reason: 'Synth analog hipnotis' },
      { artist: 'NIKI', title: 'Every Summertime', reason: 'Nostalgic R&B soul' },
      { artist: 'The 1975', title: 'Somebody Else', reason: 'Synthwave 80s mid-tempo' },
      { artist: 'Tame Impala', title: 'The Less I Know The Better', reason: 'Groove puncak fokus' },
      { artist: 'Clairo', title: 'Bags', reason: 'Lo-fi indie gitar hangat' },
      { artist: 'beabadoobee', title: 'Glue Song', reason: 'Acoustic doux penyeimbang ritme' },
      { artist: 'wave to earth', title: 'seasons', reason: 'Korean indie jazz pop lembut' },
      { artist: 'keshi', title: 'LIMBO', reason: 'Lo-fi R&B guitar production' },
      { artist: 'LANY', title: 'ILYSB', reason: 'Hook synth-pop ikonik' },
      { artist: 'Bernadya', title: 'Untungnya, Hidup Harus Tetap Berjalan', reason: 'Pop reflektif penutup' },
      { artist: 'HONNE', title: 'Day 1 ◑', reason: 'Electronic soul cooldown' },
    ],
  },
  {
    id: 'indo-indie-senja',
    label: 'Indie & Alt-Pop Indonesia',
    badge: 'Indo Indie • Storytelling',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    prompt:
      'Kurasi lagu Indie & Pop Alternatif Indonesia terbaik dengan storytelling kuat, dari warmup akustik hingga anthem puncak lalu cooldown menenangkan',
    defaultTitle: 'Ruang Dengar // Indie & Alt-Pop Indonesia',
    defaultDescription:
      'Kurasi AI Studio: Hindia, Bernadya, Reality Club, Tulus, Pamungkas, Barasuara, Sal Priadi & lainnya.',
    seeds: [
      { artist: 'Tulus', title: 'Hati-Hati di Jalan', reason: 'Pembuka chamber pop hangat' },
      { artist: 'Bernadya', title: 'Satu Bulan', reason: 'Storytelling pop melankolis' },
      { artist: 'Reality Club', title: 'Am I Bothering You?', reason: 'Transisi indie rock enerjik' },
      { artist: 'Sal Priadi', title: 'Gala Bunga Matahari', reason: 'Lirik puitis & aransemen megah' },
      { artist: 'Hindia', title: 'Secukupnya', reason: 'Groove indie rock ikonik' },
      { artist: 'Pamungkas', title: 'To the Bone', reason: 'Mid-tempo groove populer' },
      { artist: 'Juicy Luicy', title: 'Lantas', reason: 'Pop R&B catchy' },
      { artist: 'Nadin Amizah', title: 'Bertaut', reason: 'Folk chamber emosional' },
      { artist: 'Hindia', title: 'Cincin', reason: 'Anthem puncak penuh energi' },
      { artist: 'Barasuara', title: 'Bahas Bahasa', reason: 'Peak rock alternatif dinamis' },
      { artist: '.Feast', title: 'Peradaban', reason: 'Energi rock klimaks' },
      { artist: "Maliq & D'Essentials", title: 'Kita Bikin Romantis', reason: 'Soul/funk groove ceria' },
      { artist: 'Reality Club', title: 'Is It The Answer', reason: 'Alt-rock emosional' },
      { artist: 'Payung Teduh', title: 'Akad', reason: 'Keroncong jazz pop hangat' },
      { artist: 'Hindia', title: 'Rumah Ke Rumah', reason: 'Storytelling klasik Hindia' },
      { artist: 'Sore', title: 'No Fruits For Today', reason: 'Deep cut indie Jakarta legendaris' },
      { artist: 'Efek Rumah Kaca', title: 'Desember', reason: 'Cooldown atmosferik hujan' },
      { artist: 'Banda Neira', title: 'Sampai Jadi Debu', reason: 'Penutup akustik hening' },
      { artist: 'Kunto Aji', title: 'Rehat', reason: 'Mantra penutup menenangkan' },
      { artist: 'Danilla', title: 'Senja Di Ambang Pilu', reason: 'Bossa nova gelap malam' },
    ],
  },
  {
    id: 'high-energy-drive',
    label: 'Night Drive & Synth Boost',
    badge: 'Upbeat • Synthwave • Alt-Rock',
    image:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80',
    prompt:
      'Playlist night drive bertenaga tinggi: synthwave, indie sleaze, alt-rock, dan electro-pop dengan beat menghentak',
    defaultTitle: 'Neon Expressway // Night Drive 120 BPM',
    defaultDescription:
      'Kurasi AI Studio: The Weeknd, Daft Punk, Arctic Monkeys, Tame Impala, Justice, Kavinsky & lainnya.',
    seeds: [
      { artist: 'Kavinsky', title: 'Nightcall', reason: 'Intro synthwave sinematik' },
      { artist: 'The Weeknd', title: 'Blinding Lights', reason: '80s synth overdrive' },
      { artist: 'Daft Punk', title: 'Instant Crush (feat. Julian Casablancas)', reason: 'Vocoder rock groove' },
      { artist: 'Arctic Monkeys', title: 'Do I Wanna Know?', reason: 'Riff gitar berat & sensual' },
      { artist: 'Tame Impala', title: 'Borderline', reason: 'Disco-psych bassline' },
      { artist: 'MGMT', title: 'Little Dark Age', reason: 'Dark synth anthem' },
      { artist: 'Empire of the Sun', title: 'Walking On A Dream', reason: 'Euphoric electro-pop' },
      { artist: 'M83', title: 'Midnight City', reason: 'Peak synth saxophone klimaks' },
      { artist: 'The Strokes', title: 'The Adults Are Talking', reason: 'Crisp indie rock groove' },
      { artist: 'Justice', title: 'D.A.N.C.E.', reason: 'French touch electro energy' },
      { artist: 'Phoenix', title: '1901', reason: 'Upbeat indie synth rock' },
      { artist: 'Dua Lipa', title: 'Levitating', reason: 'Nu-disco bassline' },
      { artist: 'Gorillaz', title: 'On Melancholy Hill', reason: 'Melodic synth transisi' },
      { artist: 'Disclosure', title: 'Latch', reason: '2-step electronic soul' },
      { artist: 'Arctic Monkeys', title: '505', reason: 'Slow-burn crescendo ikonik' },
      { artist: 'RÜFÜS DU SOL', title: 'Innerbloom', reason: 'Progressive electronic journey' },
      { artist: 'The xx', title: 'Intro', reason: 'Minimalist cooldown instrumental' },
      { artist: 'ODESZA', title: 'A Moment Apart', reason: 'Cinematic electronic outro' },
      { artist: 'Daft Punk', title: 'Veridis Quo', reason: 'Penutup synth barok malam' },
    ],
  },
  {
    id: 'acoustic-coffeehouse',
    label: 'Warm Acoustic & Coffee',
    badge: 'Acoustic • Folk • Jazz Pop',
    image:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=300&q=80',
    prompt:
      'Playlist akustik folk & jazz pop hangat untuk pagi hari atau santai di kedai kopi, campuran gitar fingerstyle dan vokal lembut',
    defaultTitle: 'Golden Hour Brew // Warm Acoustic Folk',
    defaultDescription:
      'Kurasi AI Studio: Iron & Wine, Novo Amor, John Mayer, Laufey, Bon Iver, Kings of Convenience & lainnya.',
    seeds: [
      { artist: 'Kings of Convenience', title: 'Cayman Islands', reason: 'Harmoni gitar akustik dua suara' },
      { artist: 'Iron & Wine', title: 'Naked As We Came', reason: 'Fingerpicking folk intim' },
      { artist: 'John Mayer', title: 'Stop This Train', reason: 'Gitar akustik perkusif hangat' },
      { artist: 'Novo Amor', title: 'Anchor', reason: 'Falsetto atmosferik lembut' },
      { artist: 'Bon Iver', title: 'Holocene', reason: 'Indie folk berlapis indah' },
      { artist: 'Fleet Foxes', title: 'Mykonos', reason: 'Harmoni vokal folk megah' },
      { artist: 'Sufjan Stevens', title: 'Mystery of Love', reason: 'Akustik sinematik lembut' },
      { artist: 'Jack Johnson', title: 'Banana Pancakes', reason: 'Breezy acoustic pagi hari' },
      { artist: 'Vance Joy', title: 'Riptide', reason: 'Upbeat indie folk puncak' },
      { artist: 'The Lumineers', title: 'Ophelia', reason: 'Stomp-and-holler folk' },
      { artist: 'Hozier', title: 'Cherry Wine - Live', reason: 'Fingerstyle folk murni' },
      { artist: 'Phoebe Bridgers', title: 'Motion Sickness', reason: 'Indie folk modern tajam' },
      { artist: 'Laufey', title: 'From The Start', reason: 'Bossa jazz akustik menawan' },
      { artist: 'Bruno Major', title: 'Easily', reason: 'Guitar soul bedroom pop' },
      { artist: 'Norah Jones', title: 'Sunrise', reason: 'Warm jazz-folk lembut' },
      { artist: 'Nick Drake', title: 'Pink Moon', reason: 'Deep cut folk legendaris' },
      { artist: 'Angus & Julia Stone', title: 'Big Jet Plane', reason: 'Dreamy indie folk groove' },
      { artist: 'Lord Huron', title: 'The Night We Met', reason: 'Waltz akustik bernostalgia' },
      { artist: 'Ben Howard', title: 'Old Pine', reason: 'Penutup akustik bertumbuh' },
    ],
  },
];

export function assignEnergyPhase(index: number, total: number): EnergyPhase {
  if (total <= 1) return 'Warmup';
  const ratio = index / total;
  if (ratio < 0.22) return 'Warmup';
  if (ratio < 0.55) return 'Groove';
  if (ratio < 0.82) return 'Peak';
  return 'Cooldown';
}

export function interleaveByArtist(
  items: { artist: string; title: string; reason?: string }[],
  maxPerArtist = 3,
  maxTotal = 24
): CuratedCandidate[] {
  const buckets = new Map<
    string,
    { artist: string; title: string; reason?: string }[]
  >();
  const seenTrackKeys = new Set<string>();

  for (const item of items) {
    const artistKey = item.artist.trim().toLowerCase();
    const trackKey = `${artistKey}::${item.title.trim().toLowerCase()}`;
    if (!artistKey || !item.title.trim() || seenTrackKeys.has(trackKey)) {
      continue;
    }
    seenTrackKeys.add(trackKey);
    const list = buckets.get(artistKey) || [];
    if (list.length < maxPerArtist) {
      list.push({
        artist: item.artist.trim(),
        title: item.title.trim(),
        reason: item.reason,
      });
      buckets.set(artistKey, list);
    }
  }

  const queues = Array.from(buckets.values());
  const rawResult: { artist: string; title: string; reason?: string }[] = [];

  let added = true;
  while (added && rawResult.length < maxTotal) {
    added = false;
    for (const queue of queues) {
      if (queue.length > 0 && rawResult.length < maxTotal) {
        const nextItem = queue.shift()!;
        rawResult.push(nextItem);
        added = true;
      }
    }
  }

  return rawResult.map((item, idx) => ({
    artist: item.artist,
    title: item.title,
    reason: item.reason,
    phase: assignEnergyPhase(idx, rawResult.length),
  }));
}

export function matchTrackArtist(
  tracks: SpotifyTrack[],
  expectedArtist: string
): SpotifyTrack | null {
  if (!tracks.length) return null;
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

  const target = normalize(expectedArtist);
  if (!target) return tracks[0];

  for (const track of tracks) {
    const matched = track.artists.some((a) => {
      const actual = normalize(a.name);
      return (
        actual === target ||
        actual.includes(target) ||
        target.includes(actual)
      );
    });
    if (matched) return track;
  }

  return null;
}

const KNOWN_ARTIST_GENRES: Record<string, string[]> = {
  hindia: ['indonesian indie', 'indonesian alternative rock', 'indie rock'],
  niki: ['indonesian r&b', 'alternative r&b', 'alt-z', 'chill r&b'],
  honne: ['synth pop', 'indie soul', 'uk contemporary r&b', 'chill electronic'],
  'rex orange county': ['bedroom pop', 'indie pop', 'neo-soul'],
  bernadya: ['indonesian pop', 'indonesian indie', 'sad pop', 'acoustic pop'],
  lany: ['la pop', 'synth pop', 'indie pop', 'dream pop'],
  'men i trust': ['dream pop', 'indie soul', 'bedroom pop', 'chillout'],
  tulus: ['indonesian pop', 'indonesian jazz', 'soul', 'chamber pop'],
  'sal priadi': ['indonesian indie', 'puitis pop', 'chamber pop', 'art pop'],
  'reality club': ['indie rock', 'indonesian indie', 'alternative rock'],
  pamungkas: ['indonesian pop', 'indie folk', 'modern acoustic'],
  'arctic monkeys': ['indie rock', 'garage rock', 'alternative rock'],
  'the weeknd': ['contemporary r&b', 'synthwave', 'pop'],
  'daft punk': ['electro house', 'french touch', 'synthpop', 'disco house'],
  'tame impala': ['psychedelic rock', 'indie psych', 'synth-pop'],
  clairo: ['bedroom pop', 'lo-fi indie', 'indie pop'],
  keshi: ['chill r&b', 'lo-fi beats', 'bedroom pop'],
  'wave to earth': ['korean indie', 'indie jazz pop', 'lo-fi chill'],
  'daniel caesar': ['contemporary r&b', 'neo soul', 'soul'],
  lyorachay: ['indonesian r&b', 'indie soul', 'contemporary pop'],
  brianval: ['indonesian r&b', 'chill pop'],
  mw: ['indonesian hip hop', 'melodic rap'],
  nahmier: ['indonesian r&b', 'alt-pop'],
  'juice luicy': ['indonesian pop', 'indonesian r&b', 'pop melankolis'],
  juicy: ['indonesian pop', 'indonesian r&b'],
  'barasuara': ['indonesian alternative rock', 'math rock', 'art rock'],
  '.feast': ['indonesian rock', 'garage rock', 'indonesian indie'],
};

const DEFAULT_GENRE_PALETTE = [
  'indonesian indie',
  'bedroom pop',
  'indonesian pop',
  'alternative r&b',
  'synth pop',
  'indie soul',
  'dream pop',
  'indie rock',
  'folk pop',
  'lo-fi chill',
  'acoustic pop',
  'neo-soul',
  'contemporary r&b',
  'chillout',
  'city pop',
];

export function computeTopGenres(
  artists: SpotifyArtist[],
  limit = 15
): { genre: string; count: number; percent: number }[] {
  const counts = new Map<string, number>();

  for (const artist of artists) {
    let artistGenres = artist.genres || [];
    if (!artistGenres.length) {
      const lower = artist.name.trim().toLowerCase();
      for (const [key, mapped] of Object.entries(KNOWN_ARTIST_GENRES)) {
        if (lower === key || lower.includes(key) || key.includes(lower)) {
          artistGenres = mapped;
          break;
        }
      }
    }

    for (const genre of artistGenres) {
      const clean = genre.trim().toLowerCase();
      if (clean) {
        counts.set(clean, (counts.get(clean) || 0) + 1);
      }
    }
  }

  // Ensure spectrum has 15 genres even if artists have sparse metadata
  let fallbackIdx = 0;
  while (counts.size < limit && fallbackIdx < DEFAULT_GENRE_PALETTE.length) {
    const candidate = DEFAULT_GENRE_PALETTE[fallbackIdx];
    if (!counts.has(candidate)) {
      counts.set(candidate, Math.max(1, Math.round(5 - (fallbackIdx % 4))));
    }
    fallbackIdx++;
  }

  const sorted = Array.from(counts.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  const maxCount = sorted[0]?.count || 1;
  return sorted.map((item) => ({
    ...item,
    percent: Math.max(15, Math.round((item.count / maxCount) * 100)),
  }));
}

export function computeMassiveDnaAnalytics(
  data: ListeningData,
  timeRange: TimeRange
): MassiveDnaAnalytics {
  const activeArtists =
    data.topArtists[timeRange]?.length > 0
      ? data.topArtists[timeRange]
      : data.topArtists.short_term;
  const activeTracks =
    data.topTracks[timeRange]?.length > 0
      ? data.topTracks[timeRange]
      : data.topTracks.short_term;

  // 1. Popularity & Mainstream vs Underground Index
  const popScores = [
    ...activeArtists.map((a) => a.popularity ?? 65),
    ...activeTracks.map((t) => t.popularity ?? 65),
  ];
  const avgPopularity = popScores.length
    ? Math.round(popScores.reduce((a, b) => a + b, 0) / popScores.length)
    : 65;

  let mainstreamLabel = 'Balanced Taste (Indie & Hits)';
  if (avgPopularity >= 78) mainstreamLabel = 'Global Chart Connoisseur';
  else if (avgPopularity >= 65) mainstreamLabel = 'Modern Mainstream & Indie';
  else if (avgPopularity >= 48) mainstreamLabel = 'Indie & Alternative Explorer';
  else mainstreamLabel = 'Deep Underground Diggers';

  const bucketCounts = [0, 0, 0, 0];
  for (const score of popScores) {
    if (score < 45) bucketCounts[0]++;
    else if (score < 65) bucketCounts[1]++;
    else if (score < 80) bucketCounts[2]++;
    else bucketCounts[3]++;
  }
  const totalPopItems = Math.max(1, popScores.length);
  const popularityBuckets = [
    {
      label: 'Deep Underground',
      range: '0–44%',
      count: bucketCounts[0],
      percent: Math.round((bucketCounts[0] / totalPopItems) * 100),
    },
    {
      label: 'Indie & Cult',
      range: '45–64%',
      count: bucketCounts[1],
      percent: Math.round((bucketCounts[1] / totalPopItems) * 100),
    },
    {
      label: 'Mainstream',
      range: '65–79%',
      count: bucketCounts[2],
      percent: Math.round((bucketCounts[2] / totalPopItems) * 100),
    },
    {
      label: 'Global Megahits',
      range: '80–100%',
      count: bucketCounts[3],
      percent: Math.round((bucketCounts[3] / totalPopItems) * 100),
    },
  ];

  const sortedArtistsByPop = [...activeArtists].sort(
    (a, b) => (a.popularity ?? 50) - (b.popularity ?? 50)
  );
  const mostUndergroundArtist = sortedArtistsByPop[0] || null;
  const mostMainstreamArtist =
    sortedArtistsByPop[sortedArtistsByPop.length - 1] || null;

  // 2. Track & Artist Diversity + Duration + Explicit
  const allSeenTracksMap = new Map<string, SpotifyTrack>();
  for (const t of [
    ...data.topTracks.short_term,
    ...data.topTracks.medium_term,
    ...data.topTracks.long_term,
    ...data.recentlyPlayed.map((r) => r.track),
  ]) {
    if (t?.id) allSeenTracksMap.set(t.id, t);
  }
  const uniqueTracks = Array.from(allSeenTracksMap.values());

  const uniqueArtistIds = new Set<string>();
  for (const t of uniqueTracks) {
    for (const a of t.artists || []) {
      uniqueArtistIds.add(a.id || a.name);
    }
  }
  for (const a of activeArtists) {
    uniqueArtistIds.add(a.id || a.name);
  }

  const avgDurationMs = activeTracks.length
    ? Math.round(
        activeTracks.reduce((acc, t) => acc + t.duration_ms, 0) /
          activeTracks.length
      )
    : 210000;

  const sortedByDuration = [...activeTracks].sort(
    (a, b) => a.duration_ms - b.duration_ms
  );
  const shortestTrack = sortedByDuration[0] || null;
  const longestTrack = sortedByDuration[sortedByDuration.length - 1] || null;

  const explicitCount = activeTracks.filter((t) => t.explicit).length;
  const explicitPercent = activeTracks.length
    ? Math.round((explicitCount / activeTracks.length) * 100)
    : 0;

  // 3. Decade & Release Era Time Machine
  const decadeMap = new Map<string, number>();
  let oldestTrack: { track: SpotifyTrack; year: number } | null = null;
  let newestTrack: { track: SpotifyTrack; year: number } | null = null;

  for (const track of uniqueTracks) {
    const dateStr = track.album?.release_date || '';
    const yearMatch = dateStr.match(/^(\d{4})/);
    if (yearMatch) {
      const year = Number(yearMatch[1]);
      if (year >= 1900 && year <= 2030) {
        const decadeLabel =
          year < 1990 ? '< 1990s' : `${Math.floor(year / 10) * 10}s`;
        decadeMap.set(decadeLabel, (decadeMap.get(decadeLabel) || 0) + 1);

        if (!oldestTrack || year < oldestTrack.year) {
          oldestTrack = { track, year };
        }
        if (!newestTrack || year > newestTrack.year) {
          newestTrack = { track, year };
        }
      }
    }
  }

  const totalDated = Math.max(
    1,
    Array.from(decadeMap.values()).reduce((a, b) => a + b, 0)
  );
  const decadeBreakdown = Array.from(decadeMap.entries())
    .map(([decade, count]) => ({
      decade,
      count,
      percent: Math.round((count / totalDated) * 100),
    }))
    .sort((a, b) => b.decade.localeCompare(a.decade));

  // 4. Cross-Era Evolution (Rising Obsessions vs All-Time Loyals)
  const longArtistIds = new Set(
    data.topArtists.long_term.map((a) => a.id || a.name)
  );
  const medArtistIds = new Set(
    data.topArtists.medium_term.map((a) => a.id || a.name)
  );

  const risingArtists = data.topArtists.short_term
    .filter((a) => !longArtistIds.has(a.id || a.name))
    .slice(0, 6);

  const loyalArtists = data.topArtists.short_term
    .filter(
      (a) =>
        longArtistIds.has(a.id || a.name) && medArtistIds.has(a.id || a.name)
    )
    .slice(0, 6);

  const longTrackIds = new Set(data.topTracks.long_term.map((t) => t.id));
  const risingTracks = data.topTracks.short_term
    .filter((t) => !longTrackIds.has(t.id))
    .slice(0, 6);

  // 5. Top Recurring Albums
  const albumCounter = new Map<
    string,
    { id: string; name: string; artist: string; image?: string; count: number }
  >();
  for (const track of [
    ...activeTracks,
    ...data.recentlyPlayed.map((r) => r.track),
  ]) {
    if (!track.album?.name) continue;
    const key = track.album.id || track.album.name;
    const existing = albumCounter.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      albumCounter.set(key, {
        id: key,
        name: track.album.name,
        artist: track.artists[0]?.name || 'Artist',
        image: track.album.images?.[0]?.url,
        count: 1,
      });
    }
  }
  const topAlbums = Array.from(albumCounter.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // 6. 24-Hour Circadian Listening Clock (from recentlyPlayed + intelligent smoothing)
  const hourlyActivity = new Array(24).fill(0);
  const periods = [
    { label: 'Pagi', sub: '05:00 – 10:59', count: 0 },
    { label: 'Siang', sub: '11:00 – 14:59', count: 0 },
    { label: 'Sore', sub: '15:00 – 18:59', count: 0 },
    { label: 'Malam', sub: '19:00 – 04:59', count: 0 },
  ];

  let rawCount = 0;
  for (const item of data.recentlyPlayed || []) {
    const dt = new Date(item.played_at);
    if (!isNaN(dt.getTime())) {
      const hr = dt.getHours();
      hourlyActivity[hr]++;
      rawCount++;
      if (hr >= 5 && hr <= 10) periods[0].count++;
      else if (hr >= 11 && hr <= 14) periods[1].count++;
      else if (hr >= 15 && hr <= 18) periods[2].count++;
      else periods[3].count++;
    }
  }

  // If rawCount is low (< 15 entries in recentlyPlayed), blend in an organic diurnal music listening curve
  if (rawCount < 15) {
    const naturalCurve = [
      1, 0, 0, 0, 0, 1, 2, 4, 5, 4, 5, 7,
      8, 7, 6, 8, 9, 10, 11, 10, 8, 6, 4, 2
    ];
    for (let h = 0; h < 24; h++) {
      hourlyActivity[h] = hourlyActivity[h] + naturalCurve[h];
      if (h >= 5 && h <= 10) periods[0].count += naturalCurve[h];
      else if (h >= 11 && hr14(h)) periods[1].count += naturalCurve[h];
      else if (h >= 15 && h <= 18) periods[2].count += naturalCurve[h];
      else periods[3].count += naturalCurve[h];
    }
  }

  function hr14(h: number) {
    return h >= 11 && h <= 14;
  }

  const totalWeighted = Math.max(
    1,
    periods.reduce((acc, p) => acc + p.count, 0)
  );
  const periodBreakdown = periods.map((p) => ({
    ...p,
    percent: Math.round((p.count / totalWeighted) * 100),
  }));
  const peakPeriod = [...periodBreakdown].sort((a, b) => b.count - a.count)[0];

  // 7. Personality Badge, Sonic Radar & Taste Diversity
  const topGenresList = computeTopGenres(activeArtists, 15);
  const genreStr = topGenresList.map((g) => g.genre).join(' ').toLowerCase();

  let personalityBadge = {
    title: 'The Melancholic Indie Reverist',
    subtitle: 'Penjelajah Melodi Senja & Bedroom Pop',
    description: 'Selera musikmu didominasi aransemen indie reflektif, lirik puitis, dan petikan gitar hangat yang pas menemani malam kontemplatif.',
    badgeStyle: 'from-emerald-500/20 via-teal-500/10 to-indigo-500/20 border-emerald-500/30 text-emerald-300',
  };

  if (/rock|metal|punk|alternative rock/.test(genreStr)) {
    personalityBadge = {
      title: 'The Sonic Alt-Rock Rebel',
      subtitle: 'Anthem Enerjik & Distorsi Kuat',
      description: 'Kamu menyukai dinamika gitar yang berani, bassline menghentak, dan riff bertenaga tinggi yang memicu adrenalin.',
      badgeStyle: 'from-rose-500/20 via-orange-500/10 to-amber-500/20 border-rose-500/30 text-rose-300',
    };
  } else if (/synth|electro|dance|disco|techno|house/.test(genreStr)) {
    personalityBadge = {
      title: 'The Midnight Cyber Synthesizer',
      subtitle: 'Gelombang Synthwave & Ritme Elektronik',
      description: 'Seleramu lekat dengan neon night drive, arpeggio analog 80s, dan denyut 120 BPM yang hipnotis.',
      badgeStyle: 'from-cyan-500/20 via-blue-500/10 to-purple-500/20 border-cyan-500/30 text-cyan-300',
    };
  } else if (/r&b|soul|neo-soul|funk/.test(genreStr)) {
    personalityBadge = {
      title: 'The Velvet Soul Alchemist',
      subtitle: 'Groove R&B Sleek & Vokal Halus',
      description: 'Koleksimu mengalir dengan bassline sensual, melodi vokal sutra, dan atmosfer soul perkotaan modern.',
      badgeStyle: 'from-amber-500/20 via-yellow-500/10 to-orange-500/20 border-amber-500/30 text-amber-300',
    };
  } else if (/acoustic|folk|singer-songwriter/.test(genreStr)) {
    personalityBadge = {
      title: 'The Organic Storyteller',
      subtitle: 'Akustik Jujur & Kisah Otentik',
      description: 'Harmoni vokal intim, instrumen organik, dan kejujuran lirik adalah inti dari perjalanan mendengarmu.',
      badgeStyle: 'from-lime-500/20 via-emerald-500/10 to-teal-500/20 border-lime-500/30 text-lime-300',
    };
  }

  let acousticScore = 48;
  let energyScore = 52;
  let danceScore = 50;
  let valenceScore = 46;

  if (/acoustic|folk|piano|ballad|chamber/.test(genreStr)) acousticScore += 28;
  if (/rock|drive|electro|dance|synth/.test(genreStr)) energyScore += 26;
  if (/r&b|pop|funk|disco|groove/.test(genreStr)) danceScore += 24;
  if (/sad|melancholy|senja|evaluasi|glimpse|regret/.test(genreStr)) valenceScore -= 18;

  const sonicRadar = {
    acousticness: Math.min(96, Math.max(20, acousticScore)),
    energy: Math.min(94, Math.max(24, energyScore)),
    danceability: Math.min(92, Math.max(25, danceScore)),
    valence: Math.min(90, Math.max(18, valenceScore)),
    depthIndex: Math.min(98, Math.max(30, 100 - avgPopularity)),
  };

  const tasteDiversityScore = Math.min(
    98,
    Math.max(60, Math.round(uniqueArtistIds.size * 2.6 + topGenresList.length * 3.8))
  );

  return {
    avgPopularity,
    mainstreamLabel,
    popularityBuckets,
    mostUndergroundArtist,
    mostMainstreamArtist,
    uniqueArtistCount: uniqueArtistIds.size,
    avgDurationMs,
    shortestTrack,
    longestTrack,
    explicitPercent,
    decadeBreakdown,
    oldestTrack,
    newestTrack,
    risingArtists:
      risingArtists.length > 0 ? risingArtists : activeArtists.slice(0, 4),
    loyalArtists:
      loyalArtists.length > 0 ? loyalArtists : activeArtists.slice(0, 4),
    risingTracks:
      risingTracks.length > 0 ? risingTracks : activeTracks.slice(0, 4),
    topAlbums,
    hourlyActivity,
    periodBreakdown,
    peakPeriodLabel: peakPeriod ? `${peakPeriod.label} (${peakPeriod.sub})` : 'Malam',
    personalityBadge,
    sonicRadar,
    tasteDiversityScore,
  };
}

export function parseCustomTrackLines(text: string): CuratedCandidate[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*\d+[\.\)]\s*/, '').trim())
    .filter(Boolean);

  const parsed: { artist: string; title: string; reason?: string }[] = [];
  for (const line of lines) {
    const parts = line.split(/\s*[-–—]\s*/);
    if (parts.length >= 2) {
      parsed.push({
        artist: parts[0].trim(),
        title: parts.slice(1).join(' - ').trim(),
        reason: 'Input manual pengguna',
      });
    }
  }
  return interleaveByArtist(parsed, 5, 40);
}

export function cleanPromptText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(
      /^(buatkan|tolong buatkan|bikin|buat|create)?\s*(playlist|daftar lagu)?\s*(dengan|ber)?\s*(tema|nuansa|vibe|judul|tentang)?\s*[:\-–]?\s*/i,
      ''
    )
    .replace(/^['"]+|['"]+$/g, '')
    .trim();
}

export function generateAestheticTitle(
  rawPrompt: string,
  featuredArtist?: string
): string {
  const cleaned = cleanPromptText(rawPrompt);
  if (!cleaned) return 'Melancholic Reverie // Sepotifi Mix';

  const words = cleaned.split(/\s+/).filter(Boolean);
  const capitalized = words
    .slice(0, 5)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  if (featuredArtist) {
    return `${capitalized} // feat. ${featuredArtist}`;
  }

  const vibes = [
    'Reflections',
    'Echoes',
    'Chronicles',
    'Sessions',
    'Nocturne',
    'Vibes',
    'Hours',
    'Haze',
  ];
  const hash = Math.abs(cleaned.length) % vibes.length;
  return `${capitalized} // ${vibes[hash]}`;
}

export async function enhancePromptWithGemini(
  apiKey: string,
  rawPrompt: string,
  listeningData?: ListeningData | null
): Promise<{
  refinedPrompt: string;
  suggestedTitle: string;
  vibeKeywords: string[];
}> {
  const clean = cleanPromptText(rawPrompt);
  const effectiveKey = (
    apiKey ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ''
  ).trim();

  if (!effectiveKey) {
    return {
      refinedPrompt: `Playlist bernuansa "${clean}": perpaduan aransemen hangat, vokal reflektif, progresi emosional bertahap dari akustik intim menuju hook dinamis, ditutup dengan pendinginan menenangkan. Menghindari distorsi kasar dan tempo agresif.`,
      suggestedTitle: generateAestheticTitle(clean),
      vibeKeywords: ['Atmospheric', 'Reflective', 'Warm Acoustics', 'Dynamic Arc'],
    };
  }

  let tasteInfo = '';
  if (listeningData) {
    const topA = listeningData.topArtists.short_term
      .slice(0, 5)
      .map((a) => a.name)
      .join(', ');
    if (topA) tasteInfo = `Profil pendengar menyukai artis: ${topA}.`;
  }

  const systemInstruction = `Kamu adalah AI Audio Curator & Prompt Engineer musik profesional untuk Sepotifi AI Studio.
Tugas: Menerima input ide atau prompt singkat pengguna tentang playlist, lalu merapikan dan memperkayanya menjadi prompt kurasi musik yang sangat detail, puitis, dan presisi sonik.
Kembalikan HANYA JSON:
{
  "suggestedTitle": "Judul playlist kreatif & estetik 2-4 kata (misal: 'Bittersweet Regret // Lost Chances')",
  "refinedPrompt": "Prompt detail (2-3 kalimat) yang menyebutkan nuansa instrumen, mood emosional, 3-4 artis referensi yang pas, alur energi dari warmup ke cooldown, serta larangan elemen suara yang tidak cocok.",
  "vibeKeywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4"]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(
        effectiveKey
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Ide awal playlist pengguna: "${clean}". ${tasteInfo}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = JSON.parse(rawText);
    return {
      refinedPrompt: parsed.refinedPrompt || rawPrompt,
      suggestedTitle: parsed.suggestedTitle || generateAestheticTitle(clean),
      vibeKeywords: parsed.vibeKeywords || ['Curated Arc', 'AI Mix'],
    };
  } catch {
    return {
      refinedPrompt: `Playlist kurasi bernuansa "${clean}": alur emosional terarah dari warmup hingga cooldown, menghadirkan soundscape akustik modern dan storytelling yang mendalam.`,
      suggestedTitle: generateAestheticTitle(clean),
      vibeKeywords: ['Atmospheric', 'Reflective', 'Curated Arc'],
    };
  }
}

export function arrangeTracksByEnergyFlow(
  tracks: SpotifyTrack[]
): { candidate: CuratedCandidate; track: SpotifyTrack }[] {
  if (!tracks.length) return [];
  const sorted = [...tracks].sort(
    (a, b) => (a.popularity || 50) - (b.popularity || 50)
  );

  const warmupCount = Math.max(1, Math.floor(tracks.length * 0.22));
  const cooldownCount = Math.max(1, Math.floor(tracks.length * 0.22));
  const middleCount = Math.max(1, tracks.length - warmupCount - cooldownCount);
  const grooveCount = Math.floor(middleCount * 0.55);

  const warmups = sorted.slice(0, warmupCount);
  const cooldowns = sorted.slice(warmupCount, warmupCount + cooldownCount);
  const remaining = sorted.slice(warmupCount + cooldownCount);
  const grooves = remaining.slice(0, grooveCount);
  const peaks = remaining.slice(grooveCount);

  const reordered: { track: SpotifyTrack; phase: EnergyPhase; reason: string }[] =
    [];
  warmups.forEach((t) =>
    reordered.push({
      track: t,
      phase: 'Warmup',
      reason: 'Alur pembuka santai & pengantar mood',
    })
  );
  grooves.forEach((t) =>
    reordered.push({
      track: t,
      phase: 'Groove',
      reason: 'Membangun ritme & intensitas musik',
    })
  );
  peaks.forEach((t) =>
    reordered.push({
      track: t,
      phase: 'Peak',
      reason: 'Klimaks energi & anthem utama',
    })
  );
  cooldowns.forEach((t) =>
    reordered.push({
      track: t,
      phase: 'Cooldown',
      reason: 'Pendinginan ritme reflektif penutup',
    })
  );

  return reordered.map((item) => ({
    candidate: {
      artist: item.track.artists[0]?.name || 'Artist',
      title: item.track.name,
      phase: item.phase,
      reason: item.reason,
    },
    track: item.track,
  }));
}

export function generateSmartCuratedPlan(
  prompt: string,
  listeningData: ListeningData | null,
  useListeningTaste: boolean,
  selectedPresetId?: string
): {
  name: string;
  description: string;
  candidates: CuratedCandidate[];
} {
  const cleanPrompt = cleanPromptText(prompt);
  const lowerPrompt = (cleanPrompt || prompt).toLowerCase();

  let preset = VIBE_PRESETS.find((p) => p.id === selectedPresetId);
  if (!preset) {
    if (
      /indo|hindia|bernadya|tulus|senja|indonesia|reality club/.test(lowerPrompt)
    ) {
      preset = VIBE_PRESETS[1];
    } else if (
      /drive|workout|energi|upbeat|synth|cepat|rock|gym/.test(lowerPrompt)
    ) {
      preset = VIBE_PRESETS[2];
    } else if (
      /acoustic|akustik|folk|pagi|kopi|coffee|warm|tenang/.test(lowerPrompt)
    ) {
      preset = VIBE_PRESETS[3];
    } else {
      preset = VIBE_PRESETS[0];
    }
  }

  const pool: { artist: string; title: string; reason?: string }[] = [];

  if (/punk|pop punk|emo|skate/.test(lowerPrompt)) {
    const popPunkSeeds = [
      { artist: 'All Time Low', title: 'Dear Maria, Count Me In', reason: 'Anthem pop punk sore hari' },
      { artist: 'blink-182', title: 'All The Small Things', reason: 'Klasik pop punk berenergi' },
      { artist: 'Paramore', title: 'Misery Business', reason: 'Riff gitar pop punk ikonis' },
      { artist: 'Neck Deep', title: 'In Bloom', reason: 'Melodi pop punk modern santai' },
      { artist: 'Green Day', title: 'Basket Case', reason: 'Groove 90s punk legendaris' },
      { artist: 'Sum 41', title: 'In Too Deep', reason: 'Sing along pembakar semangat' },
      { artist: 'Simple Plan', title: "I'm Just a Kid", reason: 'Nostalgia pop punk remaja' },
      { artist: 'Fall Out Boy', title: "Sugar, We're Goin Down", reason: 'Vokal bertenaga & hook kuat' },
      { artist: 'The All-American Rejects', title: 'Gives You Hell', reason: 'Irama santai sore hari' },
      { artist: 'State Champs', title: 'Secrets', reason: 'Upbeat modern pop punk' },
      { artist: 'Yellowcard', title: 'Ocean Avenue', reason: 'Nuansa ceria sore pantai' },
      { artist: 'Mayday Parade', title: 'Jamie All Over', reason: 'Nostalgia pop punk emosional' },
    ];
    for (const seed of popPunkSeeds) {
      pool.push(seed);
    }
  }

  const allPresetSeeds = VIBE_PRESETS.flatMap((p) => p.seeds);
  for (const seed of allPresetSeeds) {
    if (lowerPrompt.includes(seed.artist.toLowerCase())) {
      pool.push({
        ...seed,
        reason: `Sesuai artis "${seed.artist}" di prompt kamu`,
      });
    }
  }

  if (useListeningTaste && listeningData) {
    const userTop = listeningData.topTracks.short_term.length
      ? listeningData.topTracks.short_term
      : listeningData.topTracks.medium_term;

    for (const track of userTop) {
      const primaryArtist = track.artists[0]?.name || 'Unknown';
      const artistMatch = lowerPrompt.includes(primaryArtist.toLowerCase());
      const songMatch = lowerPrompt.includes(track.name.toLowerCase());

      // Only add user track if it matches prompt's requested artist/vibe
      if (artistMatch || songMatch) {
        pool.push({
          artist: primaryArtist,
          title: track.name,
          reason: `Sesuai artis ${primaryArtist} di prompt`,
        });
      } else if (!cleanPrompt || selectedPresetId) {
        // For general presets, blend at most 2 complementary favorite tracks
        if (
          pool.filter((p) => p.reason?.includes('selera Spotify')).length < 2
        ) {
          pool.push({
            artist: primaryArtist,
            title: track.name,
            reason: 'Selaras dengan selera Spotify kamu',
          });
        }
      }
    }

    // Only include recent history if user explicitly asks for recent listening
    if (/recent|terakhir|baru diputar|latest/i.test(lowerPrompt)) {
      for (const recent of listeningData.recentlyPlayed.slice(0, 3)) {
        const primaryArtist = recent.track.artists[0]?.name || 'Unknown';
        pool.push({
          artist: primaryArtist,
          title: recent.track.name,
          reason: 'Dari riwayat putar terakhirmu',
        });
      }
    }
  }

  for (const seed of preset.seeds) {
    pool.push(seed);
  }

  const candidates = interleaveByArtist(pool, 3, 22);
  const featuredArtists = Array.from(
    new Set(candidates.slice(0, 5).map((c) => c.artist))
  ).join(', ');

  const title = selectedPresetId
    ? preset.defaultTitle
    : generateAestheticTitle(cleanPrompt || preset.defaultTitle, candidates[0]?.artist);

  return {
    name: title,
    description: `Kurasi Sepotifi AI Studio — alur dinamis menampilkan ${featuredArtists}, dan lainnya.`,
    candidates,
  };
}

export async function generateGeminiCuratedPlan(
  apiKey: string,
  prompt: string,
  listeningData: ListeningData | null,
  useListeningTaste: boolean
): Promise<{
  name: string;
  description: string;
  candidates: CuratedCandidate[];
}> {
  const effectiveKey = (
    apiKey ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ''
  ).trim();
  const cleanPrompt = cleanPromptText(prompt);

  let tasteContext = '';
  if (useListeningTaste && listeningData) {
    const topArtists = listeningData.topArtists.short_term
      .slice(0, 8)
      .map((a) => a.name)
      .join(', ');
    const topTracks = listeningData.topTracks.short_term
      .slice(0, 8)
      .map((t) => `${t.artists[0]?.name} - ${t.name}`)
      .join('; ');
    tasteContext = `\nUser's Spotify Listening DNA:\n- Top Artists: ${topArtists}\n- Top Tracks: ${topTracks}\nBlend their taste naturally with the requested theme.`;
  }

  const systemInstruction = `You are an expert Spotify AI DJ and music curator.
Generate a cohesive playlist of 22 real tracks available on Spotify based on the user's request.
Rules:
1. Generate an artistic, concise 2-4 word playlist title (no prefixes like 'AI Mix:').
2. If user names an artist, include 3-4 tracks from that artist plus 8-12 similar artists with 1-2 tracks each.
3. Cycle through artists for variety (never group tracks by the same artist consecutively).
4. Mix well-known tracks with deeper cuts.
5. Design a smooth mood/energy arc across 4 phases: Warmup, Groove, Peak, Cooldown.
6. Respond ONLY with valid JSON matching this schema:
{
  "name": "Creative Artistic Title (e.g. 'Bittersweet Echoes', 'Midnight Solitude')",
  "description": "Short description mentioning 3-4 featured artists",
  "tracks": [
    { "artist": "Exact Artist Name", "title": "Exact Song Title", "phase": "Warmup|Groove|Peak|Cooldown", "reason": "Short 4-6 word reason in Indonesian" }
  ]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(
        effectiveKey
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `User Playlist Request: ${cleanPrompt}${tasteContext}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = JSON.parse(rawText);

    const interleaved = interleaveByArtist(
      (parsed.tracks || []).map(
        (t: { artist: string; title: string; reason?: string }) => ({
          artist: String(t.artist || ''),
          title: String(t.title || ''),
          reason: t.reason ? String(t.reason) : undefined,
        })
      ),
      3,
      24
    );

    const name =
      cleanPromptText(parsed.name || '') ||
      generateAestheticTitle(cleanPrompt);

    return {
      name,
      description: parsed.description || 'Kurasi cerdas Gemini AI DJ',
      candidates: interleaved,
    };
  } catch {
    const fallback = generateSmartCuratedPlan(
      cleanPrompt,
      listeningData,
      useListeningTaste
    );
    return {
      ...fallback,
      name: generateAestheticTitle(cleanPrompt),
    };
  }
}
