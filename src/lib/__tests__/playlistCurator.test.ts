import { describe, expect, it } from 'vitest';
import {
  arrangeTracksByEnergyFlow,
  assignEnergyPhase,
  cleanPromptText,
  computeMassiveDnaAnalytics,
  computeTopGenres,
  generateAestheticTitle,
  generateSmartCuratedPlan,
  interleaveByArtist,
  matchTrackArtist,
  parseCustomTrackLines,
} from '../playlistCurator';
import { DEMO_LISTENING_DATA } from '../demoData';
import { SpotifyTrack } from '../../types/spotify';

describe('playlistCurator & MassiveDnaAnalytics', () => {
  it('cleans boilerplate prefixes and generates aesthetic titles', () => {
    const raw = 'buatkan playlist dengan tema : kinda miss someone but its okay';
    const cleaned = cleanPromptText(raw);
    expect(cleaned).toBe('kinda miss someone but its okay');

    const title = generateAestheticTitle(raw);
    expect(title).not.toContain('AI Mix: buatkan playlist');
    expect(title).toContain('Kinda Miss Someone');
  });

  it('arranges tracks into a 4-phase energy flow (Warmup -> Groove -> Peak -> Cooldown)', () => {
    const tracks: SpotifyTrack[] = [
      { id: '1', name: 'Song 1', popularity: 20, duration_ms: 180000, artists: [{ id: 'a1', name: 'A1' }], album: { id: 'al1', name: 'Al1', images: [] }, uri: 'spotify:track:1' },
      { id: '2', name: 'Song 2', popularity: 40, duration_ms: 200000, artists: [{ id: 'a2', name: 'A2' }], album: { id: 'al2', name: 'Al2', images: [] }, uri: 'spotify:track:2' },
      { id: '3', name: 'Song 3', popularity: 60, duration_ms: 210000, artists: [{ id: 'a3', name: 'A3' }], album: { id: 'al3', name: 'Al3', images: [] }, uri: 'spotify:track:3' },
      { id: '4', name: 'Song 4', popularity: 80, duration_ms: 240000, artists: [{ id: 'a4', name: 'A4' }], album: { id: 'al4', name: 'Al4', images: [] }, uri: 'spotify:track:4' },
      { id: '5', name: 'Song 5', popularity: 95, duration_ms: 190000, artists: [{ id: 'a5', name: 'A5' }], album: { id: 'al5', name: 'Al5', images: [] }, uri: 'spotify:track:5' },
    ];

    const arranged = arrangeTracksByEnergyFlow(tracks);
    expect(arranged).toHaveLength(5);
    const phases = arranged.map((i) => i.candidate.phase);
    expect(phases).toContain('Warmup');
    expect(phases).toContain('Peak');
    expect(phases).toContain('Cooldown');
  });

  it('interleaves tracks by artist and caps max per artist', () => {
    const raw = [
      { artist: 'Hindia', title: 'Evaluasi' },
      { artist: 'Hindia', title: 'Secukupnya' },
      { artist: 'Hindia', title: 'Cincin' },
      { artist: 'Hindia', title: 'Rumah Ke Rumah' },
      { artist: 'NIKI', title: 'lowkey' },
      { artist: 'NIKI', title: 'Every Summertime' },
      { artist: 'LANY', title: 'Malibu Nights' },
    ];

    const result = interleaveByArtist(raw, 3, 20);
    const hindiaCount = result.filter((r) => r.artist === 'Hindia').length;
    expect(hindiaCount).toBe(3);
    expect(result[0].artist).toBe('Hindia');
    expect(result[1].artist).toBe('NIKI');
    expect(result[2].artist).toBe('LANY');
  });

  it('assigns progressive energy phases across playlist length', () => {
    expect(assignEnergyPhase(0, 20)).toBe('Warmup');
    expect(assignEnergyPhase(6, 20)).toBe('Groove');
    expect(assignEnergyPhase(14, 20)).toBe('Peak');
    expect(assignEnergyPhase(19, 20)).toBe('Cooldown');
  });

  it('matches search results against expected artist name accurately', () => {
    const mockTracks: SpotifyTrack[] = [
      {
        id: 't1',
        uri: 'spotify:track:t1',
        name: 'Evaluasi (Karaoke Version)',
        duration_ms: 180000,
        artists: [{ id: 'k1', name: 'Karaoke Backing Star' }],
        album: { id: 'a1', name: 'Karaoke Hits', images: [] },
      },
      {
        id: 't2',
        uri: 'spotify:track:t2',
        name: 'Evaluasi',
        duration_ms: 194000,
        artists: [{ id: 'h1', name: 'Hindia' }],
        album: { id: 'a2', name: 'Menari Dengan Bayangan', images: [] },
      },
    ];

    const matched = matchTrackArtist(mockTracks, 'Hindia');
    expect(matched?.id).toBe('t2');
  });

  it('parses custom track lines in Artist - Title format', () => {
    const input = `1. Hindia - Evaluasi\n2. NIKI - lowkey\nHONNE - la la la that's how it goes`;
    const parsed = parseCustomTrackLines(input);
    expect(parsed).toHaveLength(3);
    expect(parsed[0]).toMatchObject({ artist: 'Hindia', title: 'Evaluasi' });
  });

  it('computes top genres with percentages', () => {
    const genres = computeTopGenres(DEMO_LISTENING_DATA.topArtists.short_term, 5);
    expect(genres.length).toBeGreaterThan(0);
    expect(genres[0].percent).toBe(100);
  });

  it('computes massive DNA analytics across eras, decades, and circadian hours', () => {
    const dna = computeMassiveDnaAnalytics(DEMO_LISTENING_DATA, 'short_term');
    expect(dna.avgPopularity).toBeGreaterThan(0);
    expect(dna.uniqueArtistCount).toBeGreaterThanOrEqual(8);
    expect(dna.decadeBreakdown.length).toBeGreaterThan(0);
    expect(dna.hourlyActivity).toHaveLength(24);
    expect(dna.periodBreakdown).toHaveLength(4);
    expect(dna.topAlbums.length).toBeGreaterThan(0);
    expect(dna.personalityBadge.title).toBeTruthy();
    expect(dna.personalityBadge.subtitle).toBeTruthy();
    expect(dna.sonicRadar.acousticness).toBeGreaterThan(0);
    expect(dna.sonicRadar.energy).toBeGreaterThan(0);
    expect(dna.tasteDiversityScore).toBeGreaterThanOrEqual(50);
  });

  it('generates smart curated plan blending user listening DNA', () => {
    const plan = generateSmartCuratedPlan(
      'Lagu indie santai buat fokus ngoding bersama Hindia',
      DEMO_LISTENING_DATA,
      true
    );
    expect(plan.candidates.length).toBeGreaterThanOrEqual(15);
    expect(plan.description).toContain('Hindia');
  });
});
