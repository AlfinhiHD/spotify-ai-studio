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
  expectedArtist: string,
  expectedTitle?: string
): SpotifyTrack | null {
  if (!tracks.length) return null;
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

  const targetFull = normalize(expectedArtist);
  const targetPrimary = normalize(
    expectedArtist.split(/[,&]|feat\.|ft\.|with/i)[0] || expectedArtist
  );
  const normExpectedTitle = expectedTitle ? normalize(expectedTitle) : '';

  if (!targetFull) return tracks[0];

  let bestTrack: SpotifyTrack | null = null;
  let bestScore = -999;

  for (const track of tracks) {
    let score = 0;
    const trackTitleNorm = normalize(track.name);
    const isJunkVersion =
      /karaoke|tribute|made famous|8 bit|lullaby|ringtone|backing track|instrumental version/i.test(
        `${track.name} ${track.artists.map((a) => a.name).join(' ')}`
      );
    if (isJunkVersion) score -= 100;

    const artistMatched = track.artists.some((a) => {
      const actual = normalize(a.name);
      if (!actual) return false;
      if (actual === targetFull || actual === targetPrimary) {
        score += 50;
        return true;
      }
      if (
        actual.includes(targetPrimary) ||
        targetPrimary.includes(actual) ||
        actual.includes(targetFull) ||
        targetFull.includes(actual)
      ) {
        score += 30;
        return true;
      }
      return false;
    });

    if (!artistMatched) continue;

    if (normExpectedTitle) {
      if (trackTitleNorm === normExpectedTitle) {
        score += 40;
      } else if (
        trackTitleNorm.includes(normExpectedTitle) ||
        normExpectedTitle.includes(trackTitleNorm)
      ) {
        score += 20;
      }
    }

    score += Math.min(15, Math.round((track.popularity || 50) / 10));

    if (score > bestScore) {
      bestScore = score;
      bestTrack = track;
    }
  }

  return bestTrack;
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

export const GEMINI_MODEL_CASCADE = [
  'gemini-3-flash-preview',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash',
] as const;

const GEMINI_REQUEST_TIMEOUT_MS = 18000;

async function callGeminiWithFallback(
  apiKey: string,
  systemInstruction: string,
  userText: string,
  temperature = 0.72
): Promise<{ parsed: any; modelUsed: string }> {
  let lastError: Error | null = null;

  for (const model of GEMINI_MODEL_CASCADE) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEMINI_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
          apiKey
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [
              {
                role: 'user',
                parts: [{ text: userText }],
              },
            ],
            generationConfig: {
              temperature,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        let apiMsg = `HTTP ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody?.error?.message) {
            apiMsg = `${response.status}: ${String(errBody.error.message).slice(0, 120)}`;
          }
        } catch {
          // Ignore error body parse failure
        }
        lastError = new Error(`Gemini (${model}) ${apiMsg}`);
        continue;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const textPart =
        parts.find(
          (p: any) =>
            typeof p?.text === 'string' &&
            (p.text.trim().startsWith('{') || p.text.trim().startsWith('['))
        ) ||
        parts.find((p: any) => typeof p?.text === 'string') ||
        {};
      const rawText = String(textPart.text || '')
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      if (!rawText) {
        lastError = new Error(`Gemini (${model}) mengembalikan respons kosong`);
        continue;
      }

      const parsed = JSON.parse(rawText);
      return {
        parsed: Array.isArray(parsed) ? { tracks: parsed } : parsed,
        modelUsed: model,
      };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        lastError = new Error(`Gemini (${model}) timeout setelah ${GEMINI_REQUEST_TIMEOUT_MS / 1000} detik`);
      } else {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('Semua model Gemini gagal merespons.');
}

export function preserveArcAndDecollideArtists(
  rawItems: {
    artist: string;
    title: string;
    phase?: string;
    reason?: string;
  }[],
  maxPerArtist = 3,
  maxTotal = 25
): CuratedCandidate[] {
  const seenTracks = new Set<string>();
  const artistCounts = new Map<string, number>();
  const validPhases: EnergyPhase[] = ['Warmup', 'Groove', 'Peak', 'Cooldown'];

  const filtered: {
    artist: string;
    title: string;
    phase?: EnergyPhase;
    reason?: string;
  }[] = [];

  for (const item of rawItems) {
    const artist = String(item.artist || '').trim();
    const title = String(item.title || '').trim();
    if (!artist || !title) continue;

    const primaryArtistKey = artist
      .split(/[,&]|feat\.|ft\./i)[0]
      .trim()
      .toLowerCase();
    const trackKey = `${primaryArtistKey}::${title.toLowerCase()}`;
    if (seenTracks.has(trackKey)) continue;

    const currentArtistCount = artistCounts.get(primaryArtistKey) || 0;
    if (currentArtistCount >= maxPerArtist) continue;

    seenTracks.add(trackKey);
    artistCounts.set(primaryArtistKey, currentArtistCount + 1);

    const rawPhase = String(item.phase || '').trim().toLowerCase();
    const phaseAliasMap: Record<string, EnergyPhase> = {
      warmup: 'Warmup',
      intro: 'Warmup',
      opening: 'Warmup',
      groove: 'Groove',
      'build-up': 'Groove',
      buildup: 'Groove',
      peak: 'Peak',
      climax: 'Peak',
      cooldown: 'Cooldown',
      outro: 'Cooldown',
      chill: 'Cooldown',
    };
    const normalizedPhase =
      validPhases.find((p) => p.toLowerCase() === rawPhase) ||
      phaseAliasMap[rawPhase];

    filtered.push({
      artist,
      title,
      phase: normalizedPhase,
      reason: item.reason ? String(item.reason).trim() : undefined,
    });

    if (filtered.length >= maxTotal) break;
  }

  // Sort by phase order if model provided phases, preserving relative order inside each phase
  const phaseOrder: Record<EnergyPhase, number> = {
    Warmup: 0,
    Groove: 1,
    Peak: 2,
    Cooldown: 3,
  };
  const hasExplicitPhases = filtered.filter((f) => f.phase).length >= Math.floor(filtered.length * 0.6);
  if (hasExplicitPhases) {
    filtered.sort((a, b) => {
      const pa = a.phase ? phaseOrder[a.phase] : 1;
      const pb = b.phase ? phaseOrder[b.phase] : 1;
      return pa - pb;
    });
  }

  // De-collide consecutive identical artists by swapping with the nearest different artist
  for (let i = 1; i < filtered.length; i++) {
    const prevArtist = filtered[i - 1].artist.split(/[,&]/)[0].trim().toLowerCase();
    const currArtist = filtered[i].artist.split(/[,&]/)[0].trim().toLowerCase();
    if (prevArtist === currArtist) {
      for (let j = i + 1; j < filtered.length; j++) {
        const swapArtist = filtered[j].artist.split(/[,&]/)[0].trim().toLowerCase();
        if (swapArtist !== currArtist) {
          const temp = filtered[i];
          filtered[i] = filtered[j];
          filtered[j] = temp;
          break;
        }
      }
    }
  }

  return filtered.map((item, idx) => ({
    artist: item.artist,
    title: item.title,
    reason: item.reason || 'Kurasi harmonis & transisi energi mulus',
    phase: item.phase || assignEnergyPhase(idx, filtered.length),
  }));
}

export async function enhancePromptWithGemini(
  apiKey: string,
  rawPrompt: string,
  listeningData?: ListeningData | null
): Promise<{
  refinedPrompt: string;
  suggestedTitle: string;
  vibeKeywords: string[];
  usedFallback?: boolean;
  warning?: string;
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
      usedFallback: true,
      warning: 'Gemini API Key belum diisi, memakai template lokal.',
    };
  }

  let tasteInfo = '';
  if (listeningData) {
    const topA = listeningData.topArtists.short_term
      .slice(0, 6)
      .map((a) => a.name)
      .join(', ');
    const topG = computeTopGenres(listeningData.topArtists.short_term, 5)
      .map((g) => g.genre)
      .join(', ');
    if (topA) {
      tasteInfo = `Profil pendengar menyukai artis: ${topA} (Genre dominan: ${topG}).`;
    }
  }

  const systemInstruction = `Kamu adalah Master Musicologist, AI Audio Director & Prompt Engineer untuk Sepotifi AI Studio.
Tugas: Menerima ide/prompt singkat pengguna tentang playlist, lalu memperkayanya menjadi spesifikasi kurasi musik yang sangat cerdas, puitis, dan presisi secara musikologis (mencakup sub-genre, rentang tempo BPM, tekstur instrumen/vokal, kurva 4 fase energi Warmup -> Groove -> Peak -> Cooldown, 3-5 artis referensi yang otentik, serta elemen suara yang harus dihindari).
Kembalikan HANYA JSON:
{
  "suggestedTitle": "Judul playlist kreatif & estetik 2-4 kata (misal: 'Bittersweet Regret // Lost Chances')",
  "refinedPrompt": "Prompt kurasi detail (2-3 kalimat padat) yang mendeskripsikan lanskap suara, progresi BPM & emosi, referensi artis yang relevan, serta batasan sonik.",
  "vibeKeywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4"]
}`;

  try {
    const { parsed } = await callGeminiWithFallback(
      effectiveKey,
      systemInstruction,
      `Ide awal playlist pengguna: "${clean}". ${tasteInfo}`,
      0.7
    );
    return {
      refinedPrompt: parsed.refinedPrompt || rawPrompt,
      suggestedTitle: parsed.suggestedTitle || generateAestheticTitle(clean),
      vibeKeywords: parsed.vibeKeywords || ['Curated Arc', 'AI Mix'],
      usedFallback: false,
    };
  } catch (err) {
    const warning = err instanceof Error ? err.message : 'Gemini gagal merespons.';
    return {
      refinedPrompt: `Playlist kurasi bernuansa "${clean}": alur emosional terarah dari warmup hingga cooldown, menghadirkan soundscape akustik modern dan storytelling yang mendalam.`,
      suggestedTitle: generateAestheticTitle(clean),
      vibeKeywords: ['Atmospheric', 'Reflective', 'Curated Arc'],
      usedFallback: true,
      warning,
    };
  }
}

export function arrangeTracksByEnergyFlow(
  tracks: SpotifyTrack[]
): { candidate: CuratedCandidate; track: SpotifyTrack }[] {
  if (!tracks.length) return [];

  const scoreTrackEnergy = (t: SpotifyTrack): number => {
    let score = t.popularity ?? 55;
    const titleLower = t.name.toLowerCase();
    // Title cues for calm / acoustic / intro / outro
    if (/acoustic|akustik|piano|unplugged|ballad|lullaby|intro|outro|interlude|reprise|slowed|rehat|senja|tidur/i.test(titleLower)) {
      score -= 22;
    }
    // Title cues for high-energy / remix / anthem
    if (/remix|live|vip|edit|radio|anthem|party|dance|rock|punk|overload|hyper|drive|fast/i.test(titleLower)) {
      score += 18;
    }
    if (t.explicit) score += 6;
    // Uptempo pop/rock songs typically sit around 2:30 - 3:45; very long 5m+ tracks are often slow-burn/ambient cooldowns
    if (t.duration_ms > 280000) score -= 10;
    else if (t.duration_ms >= 150000 && t.duration_ms <= 225000) score += 8;
    return score;
  };

  const sorted = [...tracks].sort((a, b) => scoreTrackEnergy(a) - scoreTrackEnergy(b));

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
      reason: 'Alur pembuka santai & pengantar atmosfer',
    })
  );
  grooves.forEach((t) =>
    reordered.push({
      track: t,
      phase: 'Groove',
      reason: 'Membangun ritme & momentum melodi',
    })
  );
  peaks.forEach((t) =>
    reordered.push({
      track: t,
      phase: 'Peak',
      reason: 'Klimaks energi & hook utama playlist',
    })
  );
  cooldowns.forEach((t) =>
    reordered.push({
      track: t,
      phase: 'Cooldown',
      reason: 'Pendinginan ritme reflektif penutup',
    })
  );

  // De-collide adjacent identical primary artists within the same phase
  for (let i = 1; i < reordered.length; i++) {
    const prevArtist = reordered[i - 1].track.artists[0]?.name?.toLowerCase();
    const currArtist = reordered[i].track.artists[0]?.name?.toLowerCase();
    if (prevArtist && prevArtist === currArtist) {
      for (let j = i + 1; j < reordered.length; j++) {
        if (
          reordered[j].phase === reordered[i].phase &&
          reordered[j].track.artists[0]?.name?.toLowerCase() !== currArtist
        ) {
          const tmp = reordered[i];
          reordered[i] = reordered[j];
          reordered[j] = tmp;
          break;
        }
      }
    }
  }

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

const GENRE_THEME_CLUSTERS: {
  pattern: RegExp;
  seeds: { artist: string; title: string; reason: string }[];
}[] = [
  {
    pattern: /punk|pop punk|emo|skate|warped|neck deep|blink|paramore|green day/i,
    seeds: [
      { artist: 'All Time Low', title: 'Dear Maria, Count Me In', reason: 'Anthem pop punk pembuka semangat' },
      { artist: 'blink-182', title: 'All The Small Things', reason: 'Klasik pop punk berenergi tinggi' },
      { artist: 'Paramore', title: 'Misery Business', reason: 'Riff gitar & vokal pop punk ikonis' },
      { artist: 'Neck Deep', title: 'In Bloom', reason: 'Melodi pop punk modern emosional' },
      { artist: 'Green Day', title: 'Basket Case', reason: 'Groove 90s punk legendaris' },
      { artist: 'Sum 41', title: 'In Too Deep', reason: 'Hook sing-along pembakar mood' },
      { artist: 'Simple Plan', title: "I'm Just a Kid", reason: 'Nostalgia pop punk era 2000an' },
      { artist: 'Fall Out Boy', title: "Sugar, We're Goin Down", reason: 'Anthem emo-punk klimaks' },
      { artist: 'The All-American Rejects', title: 'Gives You Hell', reason: 'Groove rock alternatif catchy' },
      { artist: 'State Champs', title: 'Secrets', reason: 'Upbeat modern pop punk' },
      { artist: 'Yellowcard', title: 'Ocean Avenue', reason: 'Violin & distorsi pop punk pantai' },
      { artist: 'Mayday Parade', title: 'Jamie All Over', reason: 'Storytelling pop punk melodis' },
      { artist: 'Pee Wee Gaskins', title: 'Sebuah Rahasia', reason: 'Anthem pop punk lokal ikonik' },
      { artist: 'Rocket Rockers', title: 'Ingin Hilang Ingatan', reason: 'Melodi pop punk nostalgik Indonesia' },
      { artist: 'The Starting Line', title: 'The Best of Me', reason: 'Energi melodic punk klasik' },
      { artist: 'New Found Glory', title: 'My Friends Over You', reason: 'Upbeat singalong energik' },
      { artist: 'Good Charlotte', title: 'The Anthem', reason: 'Anthem pemberontak ceria' },
      { artist: 'Jimmy Eat World', title: 'The Middle', reason: 'Power pop rock pembangkit semangat' },
      { artist: 'Avril Lavigne', title: 'Sk8er Boi', reason: 'Nostalgia pop punk 2000s' },
      { artist: 'Summerlane', title: 'Sweet Escape', reason: 'Pop punk modern Jakarta' },
      { artist: 'Stand Atlantic', title: 'Lavender Bones', reason: 'Alt-rock / modern pop punk segar' },
      { artist: 'The Story So Far', title: 'Roam', reason: 'Energi punk pengisi sore' },
      { artist: 'My Chemical Romance', title: 'Helena', reason: 'Post-hardcore / emo teatrikal' },
      { artist: 'Boys Like Girls', title: 'The Great Escape', reason: 'Euphoric pop-rock anthem' },
    ],
  },
  {
    pattern: /galau|sedih|patah hati|nangis|sad|heartbreak|putus|move on|kangen|rindu|kecewa/i,
    seeds: [
      { artist: 'Bernadya', title: 'Satu Bulan', reason: 'Lirik patah hati sunyi & intim' },
      { artist: 'NIKI', title: 'Oceans & Engines', reason: 'Ballad perpisahan sinematik' },
      { artist: 'Hindia', title: 'Membasuh', reason: 'Refleksi penyembuhan luka batin' },
      { artist: 'Joji', title: 'Glimpse of Us', reason: 'Piano ballad kenangan masa lalu' },
      { artist: 'Olivia Rodrigo', title: 'traitor', reason: 'Emosi patah hati yang jujur' },
      { artist: 'Mahalini', title: 'Sial', reason: 'Klimaks vokal pop balada emosional' },
      { artist: 'Juicy Luicy', title: 'Lantas', reason: 'Melankoli cinta tak terbalas' },
      { artist: 'Tulus', title: 'Hati-Hati di Jalan', reason: 'Perpisahan dewasa yang hangat' },
      { artist: 'Gracie Abrams', title: 'I miss you, I’m sorry', reason: 'Bedroom pop rindu mendalam' },
      { artist: 'Nadin Amizah', title: 'Bertaut', reason: 'Kejujuran lirik folk kamar' },
      { artist: 'LANY', title: 'Malibu Nights', reason: 'Malam panjang memproses perpisahan' },
      { artist: 'Conan Gray', title: 'Heather', reason: 'Akustik melankolis penuh kerinduan' },
      { artist: 'Lyodra', title: 'Pesan Terakhir', reason: 'Power ballad penutup hubungan' },
      { artist: 'Sal Priadi', title: 'Gala Bunga Matahari', reason: 'Rindu puitis yang menghangatkan' },
      { artist: 'Lord Huron', title: 'The Night We Met', reason: 'Waltz nostalgia yang menghantui' },
      { artist: 'Bernadya', title: 'Kata Mereka Ini Berlebihan', reason: 'Cerita kerentanan hati' },
      { artist: 'Billie Eilish', title: 'What Was I Made For?', reason: 'Refleksi minimalis yang menyentuh' },
      { artist: 'Kunto Aji', title: 'Pilu Membiru', reason: 'Katarsis emosional dan pemulihan' },
    ],
  },
  {
    pattern: /90an|2000an|nostalgia indo|band indo|sheila on 7|dewa 19|peterpan|noah|padi|ungu|kerispatih|chrisye/i,
    seeds: [
      { artist: 'Sheila On 7', title: 'Dan...', reason: 'Klasik pop-rock Indonesia abadi' },
      { artist: 'Dewa 19', title: 'Kangen', reason: 'Ballad rock legendaris 90an' },
      { artist: 'Peterpan', title: 'Semua Tentang Kita', reason: 'Petikan gitar akustik nostalgik' },
      { artist: 'Padi', title: 'Kasih Tak Sampai', reason: 'Aransemen megah era 2000an' },
      { artist: 'Sheila On 7', title: 'Seberapa Pantas', reason: 'Groove pop-rock sing-along' },
      { artist: 'Chrisye', title: 'Seperti Yang Kau Minta', reason: 'Vokal legendaris lintas generasi' },
      { artist: 'Dewa 19', title: 'Risalah Hati', reason: 'Harmoni piano & rock romantis' },
      { artist: 'Glenn Fredly', title: 'Januari', reason: 'R&B soul Indonesia paling ikonik' },
      { artist: 'Letto', title: 'Ruang Rindu', reason: 'Melodi pop filosofis menenangkan' },
      { artist: 'Nidji', title: 'Laskar Pelangi', reason: 'Anthem optimisme penuh energi' },
      { artist: 'Samson', title: 'Kenangan Terindah', reason: 'Klimaks pop-rock era keemasan' },
      { artist: 'Kahitna', title: 'Cantik', reason: 'Pop jazz romantis sepanjang masa' },
      { artist: 'Ada Band', title: 'Manusia Bodoh', reason: 'Drama pop balada 2000an' },
      { artist: 'Gigi', title: '11 Januari', reason: 'Energi rock alternatif romantis' },
      { artist: 'Naif', title: 'Benci Untuk Mencinta', reason: 'Retro pop-rock hangat' },
      { artist: 'Kerispatih', title: 'Tapi Bukan Aku', reason: 'Balada orkestra emosional' },
    ],
  },
  {
    pattern: /kpop|k-pop|korea|kdrama|newjeans|ive|aespa|bts|blackpink|seventeen|day6|le sserafim|twice/i,
    seeds: [
      { artist: 'NewJeans', title: 'Ditto', reason: 'Baltimore club & dreamy K-pop hangat' },
      { artist: 'DAY6', title: 'You Were Beautiful', reason: 'K-rock ballad emosional' },
      { artist: 'Jungkook', title: 'Seven (feat. Latto)', reason: 'UK garage pop groove modern' },
      { artist: 'aespa', title: 'Supernova', reason: 'Hyperpop electro-bass futuristik' },
      { artist: 'LE SSERAFIM', title: 'Smart', reason: 'Amapiano groove K-pop sleek' },
      { artist: 'IVE', title: 'LOVE DIVE', reason: 'Dark synth-pop elegan' },
      { artist: 'wave to earth', title: 'seasons', reason: 'K-indie jazz pop romantis' },
      { artist: 'IU', title: 'Love wins all', reason: 'Cinematic K-ballad megah' },
      { artist: 'SEVENTEEN', title: 'Super', reason: 'Anthem koreografi berenergi puncak' },
      { artist: 'NewJeans', title: 'Hype Boy', reason: 'R&B pop menyegarkan' },
      { artist: 'The Black Skirts', title: 'EVERYTHING', reason: 'Dreamy K-indie slow dance' },
      { artist: 'DEAN', title: 'instagram', reason: 'K-R&B lo-fi malam hari' },
      { artist: 'ZICO', title: 'SPOT! (feat. JENNIE)', reason: 'Upbeat hip-hop pop kolaboratif' },
      { artist: 'Red Velvet', title: 'Psycho', reason: 'Velvet R&B pop orkestral' },
      { artist: 'Crush', title: 'Beautiful', reason: 'OST K-Drama ikonik yang hangat' },
      { artist: '10CM', title: 'Spring Snow', reason: 'Akustik K-indie manis' },
    ],
  },
  {
    pattern: /jpop|j-pop|jepang|anime|yoasobi|ado|kenshi|fujii kaze|city pop|radwimps|imase|hikaru utada/i,
    seeds: [
      { artist: 'Fujii Kaze', title: 'Shinunoga E-Wa', reason: 'J-soul piano groove hipnotis' },
      { artist: 'YOASOBI', title: 'Idol', reason: 'J-pop hyper-enerjik berkecepatan tinggi' },
      { artist: 'imase', title: 'NIGHT DANCER', reason: 'Nu-disco J-pop groove malam' },
      { artist: 'Kenshi Yonezu', title: 'KICK BACK', reason: 'Rock elektronik anime eksplosif' },
      { artist: 'RADWIMPS', title: 'Sparkle', reason: 'Post-rock sinematik penuh emosi' },
      { artist: 'Miki Matsubara', title: 'Mayonaka no Door / Stay With Me', reason: 'Klasik Japanese City Pop 80s' },
      { artist: 'Mrs. GREEN APPLE', title: 'Lilac', reason: 'J-rock melodis bertenaga' },
      { artist: 'Vaundy', title: 'odoriko', reason: 'Indie groove Jepang modern' },
      { artist: 'Official HIGE DANdism', title: 'Pretender', reason: 'Anthem piano-pop Jepang ikonik' },
      { artist: 'Hikaru Utada', title: 'First Love', reason: 'R&B ballad Jepang legendaris' },
      { artist: 'King Gnu', title: 'SPECIALZ', reason: 'Alt-rock groove gelap & intens' },
      { artist: 'Creepy Nuts', title: 'Bling-Bang-Bang-Born', reason: 'Jersey club rap Jepang adiktif' },
      { artist: 'Aimyon', title: 'Marigold', reason: 'Folk-pop Jepang hangat sore hari' },
      { artist: 'Anri', title: "I Can't Stop The Loneliness", reason: 'Brass & bassline City Pop mewah' },
    ],
  },
  {
    pattern: /r&b|rnb|soul|neo-soul|chill r&b|groove|sensual|sza|frank ocean|daniel caesar|giveon|brent faiyaz/i,
    seeds: [
      { artist: 'SZA', title: 'Snooze', reason: 'Modern R&B groove hangat & melodis' },
      { artist: 'Daniel Caesar', title: 'Best Part (feat. H.E.R.)', reason: 'Duet neo-soul akustik intim' },
      { artist: 'Frank Ocean', title: 'Pink + White', reason: 'Produksi R&B psychedelic mewah' },
      { artist: 'NIKI', title: 'lowkey', reason: 'Sleek alt-R&B malam hari' },
      { artist: 'Giveon', title: 'Heartbreak Anniversary', reason: 'Bariton soul emosional mendalam' },
      { artist: 'Brent Faiyaz', title: 'Clouded', reason: 'Lo-fi R&B atmosferik' },
      { artist: 'H.E.R.', title: 'Focus', reason: 'Slow-jam R&B sensual' },
      { artist: 'keshi', title: 'LIMBO', reason: 'Gitar R&B alternatif lembut' },
      { artist: 'Steve Lacy', title: 'Bad Habit', reason: 'Indie funk-soul groovy' },
      { artist: 'Jhené Aiko', title: 'Spotless Mind', reason: 'Chill R&B menenangkan pikiran' },
      { artist: 'Kali Uchis', title: 'telepatía', reason: 'Dreamy Latin R&B groove' },
      { artist: 'The Weeknd', title: 'Die For You', reason: 'Klimaks synth-R&B emosional' },
      { artist: 'Summer Walker', title: 'Girls Need Love', reason: 'Late-night R&B klasik modern' },
      { artist: 'Christian Kuria', title: 'Too Good', reason: 'Bassline neo-soul presisi' },
    ],
  },
  {
    pattern: /hip hop|hip-hop|rap|trap|drill|kendrick|drake|travis scott|kanye|tyler|21 savage|eminem/i,
    seeds: [
      { artist: 'Kendrick Lamar', title: 'luther (with sza)', reason: 'Melodic hip-hop soul modern' },
      { artist: 'Travis Scott', title: 'SDP Interlude', reason: 'Psychedelic trap atmosferik' },
      { artist: 'Metro Boomin', title: 'Creepin’ (with The Weeknd & 21 Savage)', reason: 'Dark R&B-trap sinematik' },
      { artist: 'Tyler, The Creator', title: 'See You Again (feat. Kali Uchis)', reason: 'Alternative hip-hop harmonis' },
      { artist: 'Drake', title: 'Passionfruit', reason: 'Tropical house-rap groove halus' },
      { artist: 'Kendrick Lamar', title: 'Money Trees', reason: 'West coast hip-hop klasik modern' },
      { artist: 'J. Cole', title: 'No Role Modelz', reason: 'Storytelling rap berirama kuat' },
      { artist: 'A$AP Rocky', title: 'Sundress', reason: 'Indie-psych rap groove' },
      { artist: 'Post Malone', title: 'Sunflower', reason: 'Melodic trap-pop cerah' },
      { artist: 'Don Toliver', title: 'No Idea', reason: 'Melodic trap malam hari' },
      { artist: 'Baby Keem', title: 'family ties (with Kendrick Lamar)', reason: 'Klimaks beat switch eksplosif' },
      { artist: 'Mac Miller', title: 'Self Care', reason: 'Jazz-rap reflektif & transisi beat' },
    ],
  },
  {
    pattern: /jazz|bossa|lofi|lo-fi|cafe|kafe|belajar|study|baca buku|reading|laufey|norah jones|instrumental/i,
    seeds: [
      { artist: 'Laufey', title: 'From The Start', reason: 'Bossa nova jazz pop modern' },
      { artist: 'Norah Jones', title: "Don't Know Why", reason: 'Vokal jazz-piano hangat' },
      { artist: 'Stan Getz', title: 'The Girl From Ipanema', reason: 'Klasik bossa nova Brasilia' },
      { artist: 'Bruno Major', title: 'Nothing', reason: 'Bedroom jazz-soul intim' },
      { artist: 'Chet Baker', title: 'Almost Blue', reason: 'Terompet cool jazz malam hari' },
      { artist: 'Laufey', title: 'Valentine', reason: 'Harmoni vokal jazz klasik' },
      { artist: 'wave to earth', title: 'bad', reason: 'Indie jazz-pop lo-fi lembut' },
      { artist: 'Tom Misch', title: 'It Runs Through Me', reason: 'Gitar jazz-funk hangat' },
      { artist: 'Bill Evans Trio', title: 'Waltz for Debby', reason: 'Piano jazz instrumental elegan' },
      { artist: 'FKJ', title: 'Ylang Ylang', reason: 'Piano & saksofon elektronik tenang' },
      { artist: 'Eloise', title: 'Subside', reason: 'Jazz-pop kontemporer lembut' },
      { artist: 'Ardhito Pramono', title: 'Bitterlove', reason: 'Swing jazz-pop Indonesia hangat' },
      { artist: "Maliq & D'Essentials", title: 'Untitled', reason: 'Acid jazz & soul romantis' },
    ],
  },
];

export function generateSmartCuratedPlan(
  prompt: string,
  listeningData: ListeningData | null,
  useListeningTaste: boolean,
  selectedPresetId?: string,
  targetCount: number = 20
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
      /indo|hindia|bernadya|tulus|senja|indonesia|reality club|pamungkas|nadin|sal priadi/.test(
        lowerPrompt
      )
    ) {
      preset = VIBE_PRESETS[1];
    } else if (
      /drive|workout|energi|upbeat|synth|cepat|rock|gym|lari|olahraga|party|dance/.test(
        lowerPrompt
      )
    ) {
      preset = VIBE_PRESETS[2];
    } else if (
      /acoustic|akustik|folk|pagi|kopi|coffee|warm|tenang|sore|hujan/.test(
        lowerPrompt
      )
    ) {
      preset = VIBE_PRESETS[3];
    } else {
      preset = VIBE_PRESETS[0];
    }
  }

  const pool: { artist: string; title: string; reason?: string }[] = [];

  // 1. Match specialized genre/mood clusters from prompt
  if (!selectedPresetId) {
    for (const cluster of GENRE_THEME_CLUSTERS) {
      if (cluster.pattern.test(lowerPrompt)) {
        for (const seed of cluster.seeds) {
          pool.push(seed);
        }
      }
    }
  }

  // 2. Match any explicitly mentioned artist in all preset & cluster seeds
  const allKnownSeeds = [
    ...VIBE_PRESETS.flatMap((p) => p.seeds),
    ...GENRE_THEME_CLUSTERS.flatMap((c) => c.seeds),
  ];
  for (const seed of allKnownSeeds) {
    if (seed.artist.toLowerCase() === 'sore') {
      if (!/\bband sore\b|\blagu sore\b/i.test(lowerPrompt)) continue;
    }
    const escaped = seed.artist.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const artistRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (artistRegex.test(lowerPrompt)) {
      pool.push({
        ...seed,
        reason: `Sesuai artis "${seed.artist}" di prompt kamu`,
      });
    }
  }

  // 3. Blend user's personal Spotify Listening DNA across short, medium, and long term
  if (useListeningTaste && listeningData) {
    const allUserTopTracks = [
      ...(listeningData.topTracks.short_term || []),
      ...(listeningData.topTracks.medium_term || []),
      ...(listeningData.topTracks.long_term || []),
    ];

    for (const track of allUserTopTracks) {
      const primaryArtist = track.artists[0]?.name || 'Unknown';
      const artistMatch = lowerPrompt.includes(primaryArtist.toLowerCase());
      const songMatch = lowerPrompt.includes(track.name.toLowerCase());

      if (artistMatch || songMatch) {
        pool.push({
          artist: primaryArtist,
          title: track.name,
          reason: `Favoritmu dari ${primaryArtist}`,
        });
      } else if (!cleanPrompt || selectedPresetId) {
        if (
          pool.filter((p) => p.reason?.includes('selera Spotify')).length < 4
        ) {
          pool.push({
            artist: primaryArtist,
            title: track.name,
            reason: 'Selaras dengan selera Spotify kamu',
          });
        }
      }
    }

    if (/recent|terakhir|baru diputar|latest/i.test(lowerPrompt)) {
      for (const recent of listeningData.recentlyPlayed.slice(0, 5)) {
        const primaryArtist = recent.track.artists[0]?.name || 'Unknown';
        pool.push({
          artist: primaryArtist,
          title: recent.track.name,
          reason: 'Dari riwayat putar terakhirmu',
        });
      }
    }
  }

  // 4. Fill remaining slots from the closest preset
  if (selectedPresetId || pool.length === 0) {
    for (const seed of preset.seeds) {
      pool.push(seed);
    }
  } else if (pool.length < targetCount) {
    for (const seed of preset.seeds) {
      if (pool.length >= targetCount + 6) break;
      if (
        !pool.some((p) => p.title.toLowerCase() === seed.title.toLowerCase())
      ) {
        pool.push(seed);
      }
    }
  }

  const candidates = interleaveByArtist(pool, 3, targetCount);
  const featuredArtists = Array.from(
    new Set(candidates.slice(0, 5).map((c) => c.artist))
  ).join(', ');

  const title = selectedPresetId
    ? preset.defaultTitle
    : generateAestheticTitle(
        cleanPrompt || preset.defaultTitle,
        candidates[0]?.artist
      );

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
  useListeningTaste: boolean,
  targetCount: number = 20,
  tasteBlendMode: 'balanced' | 'discovery' = 'balanced',
  referencedPlaylistContext?: string
): Promise<{
  name: string;
  description: string;
  candidates: CuratedCandidate[];
  usedFallback?: boolean;
  modelUsed?: string;
  warning?: string;
}> {
  const effectiveKey = (
    apiKey ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ''
  ).trim();
  const cleanPrompt = cleanPromptText(prompt);

  let tasteContext = '';
  if (useListeningTaste && listeningData) {
    const shortArtists = listeningData.topArtists.short_term
      .slice(0, 12)
      .map((a) => a.name);
    const medArtists = listeningData.topArtists.medium_term
      .slice(0, 8)
      .map((a) => a.name);
    const longArtists = listeningData.topArtists.long_term
      .slice(0, 8)
      .map((a) => a.name);

    const allTopArtists = Array.from(
      new Set([...shortArtists, ...medArtists, ...longArtists])
    ).join(', ');

    const favoriteTracks = Array.from(
      new Set(
        [
          ...listeningData.topTracks.short_term.slice(0, 12),
          ...listeningData.topTracks.medium_term.slice(0, 8),
        ].map((t) => `"${t.name}" by ${t.artists[0]?.name}`)
      )
    ).join('; ');

    const topGenres = computeTopGenres(listeningData.topArtists.short_term, 10)
      .map((g) => `${g.genre} (${g.percent}%)`)
      .join(', ');

    const dna = computeMassiveDnaAnalytics(listeningData, 'short_term');

    const playlistTitles = (listeningData.playlists || [])
      .slice(0, 20)
      .map((p) => `${p.name} (${p.tracks?.total || 0} tracks)`)
      .filter((n) => !n.startsWith('demo-') && !n.startsWith('Lagu yang Disukai'))
      .join(', ');

    const recentTracks = Array.from(
      new Set(
        (listeningData.recentlyPlayed || [])
          .slice(0, 10)
          .map((r) => `"${r.track.name}" by ${r.track.artists[0]?.name}`)
      )
    ).join('; ');

    tasteContext = `\n\n=== USER'S DEEP SPOTIFY LISTENING DNA ===
- Dominant Genres & Affinity: ${topGenres || 'Indie, Alt-Pop, R&B, Rock'}
- Sonic Radar Profile: ${dna.mainstreamLabel} | Avg Popularity: ${dna.avgPopularity}% | Energy: ${dna.sonicRadar.energy}% | Acousticness: ${dna.sonicRadar.acousticness}% | Danceability: ${dna.sonicRadar.danceability}% | Mood Valence: ${dna.sonicRadar.valence}% | Underground Depth: ${dna.sonicRadar.depthIndex}%
- Musical Personality Archetype: ${dna.personalityBadge.title} (${dna.personalityBadge.subtitle})
- Top Artists (Current & All-Time): ${allTopArtists || 'Eclectic'}
- Frequently Played Tracks: ${favoriteTracks || 'Varied'}
- User's Personal Library Playlists: ${playlistTitles || 'Custom mixes'}
- Recent Listening History: ${recentTracks || 'Active listener'}

=== PERSONALIZATION DIRECTIVE (${tasteBlendMode.toUpperCase()}) ===
${
  tasteBlendMode === 'discovery'
    ? `STRICT DISCOVERY MODE: Do NOT include any track listed in "Frequently Played Tracks" or "Recent Listening History" above. Curate 100% fresh songs (B-sides, adjacent artists, deeper cuts, and sonic cousins) that match the user's request and sonic DNA without repeating tracks they already overplay.`
    : `BALANCED DNA BLEND: Seamlessly weave 20-25% beloved tracks/artists from the user's taste profile (only where they genuinely fit the requested theme/genre!) with 75-80% high-affinity discoveries and iconic tracks that elevate the mix.`
}`;
  }

  if (referencedPlaylistContext) {
    tasteContext += `\n\n=== REFERENCED LIBRARY PLAYLIST CONTEXT ===\n${referencedPlaylistContext}`;
  }

  // Request slightly more candidates (+3 buffer) so if 1-2 tracks aren't resolved on Spotify, we still hit targetCount
  const requestedPoolSize = Math.min(55, targetCount + 3);

  const systemInstruction = `You are a World-Class Musicologist, Executive Spotify AI DJ, and Sonic Architect (combining the curatorial depth of BBC Radio 6 Music, KCRW, Pitchfork, and Spotify's algorithmic audio analysis).

Your mission: Curate a deeply cohesive, emotionally resonant playlist of ${requestedPoolSize} REAL, existing studio tracks available on Spotify that fulfills the user's prompt with extraordinary musical intelligence.

=== DEEP MUSICOLOGICAL CURATION RULES ===
1. INTENT & MICRO-GENRE PRECISION:
   - Decode the exact emotional subtext, activity, time of day, cultural context (e.g., Indonesian Indie/Pop vs Western Alt-R&B vs Japanese City Pop vs 2000s Pop Punk), and sonic texture requested.
   - Never fall back to generic filler if the user asks for a specific genre, era, or mood.
2. HARMONIC, TEMPO (BPM) & TEXTURAL FLOW (4-PHASE ENERGY ARC):
   Order the tracks chronologically through 4 distinct phases:
   - "Warmup" (~22% of tracks): Inviting intro, establishing the sonic palette, gentle tempo & atmospheric immersion.
   - "Groove" (~33% of tracks): Locking into the rhythmic pocket, mid-tempo momentum, deepening melodic hooks.
   - "Peak" (~25% of tracks): The emotional, dynamic, or energetic climax—cathartic choruses, standout anthems, or peak intensity.
   - "Cooldown" (~20% of tracks): Graceful resolution, reflective acoustics, warm outro that leaves a lasting afterglow.
3. ARTIST DIVERSITY & ZERO COLLISIONS:
   - Never place two tracks by the same artist back-to-back.
   - Maximum 2 tracks per artist across the entire playlist (unless the user explicitly asked for a single-artist spotlight).
4. AUTHENTIC CATALOG VERIFICATION:
   - Output ONLY real, officially released song titles and their exact primary artist name on Spotify (do NOT invent song titles or pair an artist with someone else's song).
   - Put only the primary artist name in the "artist" field (e.g., "Daniel Caesar" instead of "Daniel Caesar feat. H.E.R.") so Spotify catalog search resolves with 100% accuracy.
5. SPECIFIC CURATION REASONING:
   - In the "reason" field (5-8 words in Indonesian), explain the specific musical/sonic role of that track (e.g., "Bassline neo-soul hangat pembuka fokus", "Klimaks distorsi gitar & hook anthemic", "Petikan gitar akustik penutup malam").
6. OUTPUT SCHEMA (Strict JSON only):
{
  "name": "Artistic 2-5 Word Playlist Title (e.g., 'Midnight Compiler // Deep Focus')",
  "description": "Poetic, insightful 1-2 sentence Indonesian description highlighting the sonic mood, BPM/energy arc, and 3-4 featured artists.",
  "tracks": [
    {
      "artist": "Exact Primary Artist Name",
      "title": "Exact Official Track Title",
      "phase": "Warmup | Groove | Peak | Cooldown",
      "reason": "Specific musical & emotional reason in Indonesian"
    }
  ]
}`;

  try {
    const { parsed, modelUsed } = await callGeminiWithFallback(
      effectiveKey,
      systemInstruction,
      `User Playlist Request: "${cleanPrompt || prompt}"${tasteContext}`,
      0.72
    );

    const curatedCandidates = preserveArcAndDecollideArtists(
      parsed.tracks || [],
      2,
      requestedPoolSize
    );

    if (curatedCandidates.length === 0) {
      throw new Error('Gemini mengembalikan daftar lagu kosong.');
    }

    const name =
      cleanPromptText(parsed.name || '') ||
      generateAestheticTitle(cleanPrompt, curatedCandidates[0]?.artist);

    return {
      name,
      description:
        parsed.description ||
        `Kurasi cerdas Gemini AI DJ — menampilkan ${curatedCandidates
          .slice(0, 4)
          .map((c) => c.artist)
          .join(', ')}.`,
      candidates: curatedCandidates,
      usedFallback: false,
      modelUsed,
    };
  } catch (err) {
    const warning =
      err instanceof Error ? err.message : 'Gemini gagal merespons.';
    const fallback = generateSmartCuratedPlan(
      cleanPrompt,
      listeningData,
      useListeningTaste,
      undefined,
      targetCount
    );
    return {
      ...fallback,
      name: generateAestheticTitle(cleanPrompt),
      usedFallback: true,
      warning,
    };
  }
}
