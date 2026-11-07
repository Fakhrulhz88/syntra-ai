import type { GameRecord } from '../types'
import { variants } from './variants'

export const SEEDED_GAMES: GameRecord[] = [
  {
    id: 'demo-malacca',
    blueprint: variants['malacca-bm'].blueprint,
    analysis: variants['malacca-bm'].analysis,
    status: 'published',
    created_at: '2026-10-28T09:15:00+08:00',
    category: 'school',
    language: 'bm',
    subject: 'Sejarah',
    level: 'KSSM Tingkatan 1',
    players: 25,
    version: 2,
  },
  {
    id: 'demo-cyber',
    blueprint: variants['cyber-en'].blueprint,
    analysis: variants['cyber-en'].analysis,
    status: 'published',
    created_at: '2026-11-01T14:30:00+08:00',
    category: 'higher-ed',
    language: 'en',
    subject: 'Introduction to Cybersecurity',
    level: 'Undergraduate Year 1',
    players: 18,
    version: 1,
  },
  {
    id: 'demo-malacca-en',
    blueprint: variants['malacca-en'].blueprint,
    analysis: variants['malacca-en'].analysis,
    status: 'ready',
    created_at: '2026-11-03T11:05:00+08:00',
    category: 'school',
    language: 'en',
    subject: 'History',
    level: 'KSSM Form 1',
    players: 12,
    version: 1,
  },
  {
    id: 'demo-cyber-bm',
    blueprint: variants['cyber-bm'].blueprint,
    analysis: variants['cyber-bm'].analysis,
    status: 'ready',
    created_at: '2026-11-05T16:40:00+08:00',
    category: 'higher-ed',
    language: 'bm',
    subject: 'Pengenalan Keselamatan Siber',
    level: 'Ijazah Sarjana Muda Tahun 1',
    players: 7,
    version: 1,
  },
]

export const SAMPLE_FILE = {
  filename: 'Silibus_Sejarah_KSSM_T1.pdf',
  size: 2_480_113,
} as const
