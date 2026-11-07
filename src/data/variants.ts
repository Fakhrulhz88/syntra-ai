import type {
  CurriculumAnalysis,
  GameBlueprint,
  GameCategory,
  Language,
} from '../types'
import { cyberBm, cyberEn } from './cyber'
import { malaccaBm, malaccaEn } from './malacca'

export type VariantKey = 'malacca-bm' | 'malacca-en' | 'cyber-en' | 'cyber-bm'

export interface BlueprintVariant {
  key: VariantKey
  blueprint: GameBlueprint
  analysis: CurriculumAnalysis
  category: GameCategory
  language: Language
  subject: string
  level: string
}

const malaccaObjectivesBm = [
  {
    id: 'obj-1',
    text: 'Menjelaskan latar belakang pengasasan Kesultanan Melayu Melaka.',
  },
  {
    id: 'obj-2',
    text: 'Menganalisis faktor kegemilangan Melaka sebagai pusat perdagangan.',
  },
  {
    id: 'obj-3',
    text: 'Membandingkan sistem pentadbiran dan undang-undang Melaka.',
  },
  {
    id: 'obj-4',
    text: 'Menilai peranan Islam dan budaya dalam pembentukan identiti Melaka.',
  },
  {
    id: 'obj-5',
    text: 'Menghubungkait faktor kemerosotan dan kejatuhan Melaka pada 1511.',
  },
]

const malaccaObjectivesEn = [
  {
    id: 'obj-1',
    text: 'Explain the origins and founding of the Malacca Sultanate.',
  },
  {
    id: 'obj-2',
    text: 'Analyse why Malacca flourished as a trading centre.',
  },
  {
    id: 'obj-3',
    text: 'Compare the administrative and legal systems of Malacca.',
  },
  {
    id: 'obj-4',
    text: 'Evaluate the role of Islam and culture in shaping Malacca’s identity.',
  },
  {
    id: 'obj-5',
    text: 'Connect the internal and external factors behind Malacca’s fall in 1511.',
  },
]

const cyberObjectivesEn = [
  {
    id: 'cy-obj-1',
    text: 'Explain the CIA triad and how it guides security decisions.',
  },
  {
    id: 'cy-obj-2',
    text: 'Distinguish authentication from authorization and apply multi-factor authentication.',
  },
  {
    id: 'cy-obj-3',
    text: 'Identify common cyber threats and social-engineering techniques.',
  },
  {
    id: 'cy-obj-4',
    text: 'Describe symmetric encryption, asymmetric encryption and cryptographic hashing.',
  },
  {
    id: 'cy-obj-5',
    text: 'Apply defence-in-depth and incident-response principles to a network scenario.',
  },
]

const cyberObjectivesBm = [
  {
    id: 'cy-obj-1',
    text: 'Menjelaskan triad CIA dan cara ia membimbing keputusan keselamatan.',
  },
  {
    id: 'cy-obj-2',
    text: 'Membezakan pengesahan daripada kebenaran serta menggunakan pengesahan berbilang faktor.',
  },
  {
    id: 'cy-obj-3',
    text: 'Mengenal pasti ancaman siber lazim dan teknik kejuruteraan sosial.',
  },
  {
    id: 'cy-obj-4',
    text: 'Menghuraikan penyulitan simetri, penyulitan asimetri dan hash kriptografi.',
  },
  {
    id: 'cy-obj-5',
    text: 'Mengaplikasikan prinsip pertahanan berlapis dan tindak balas insiden dalam senario rangkaian.',
  },
]

export const variants: Record<VariantKey, BlueprintVariant> = {
  'malacca-bm': {
    key: 'malacca-bm',
    blueprint: malaccaBm,
    analysis: {
      subject: 'Sejarah',
      level: 'KSSM Tingkatan 1',
      objectives: malaccaObjectivesBm,
      concepts: [
        'Pengasasan Kesultanan Melayu Melaka',
        'Perdagangan maritim',
        'Sistem pentadbiran',
        'Islam dan budaya',
        'Kemerosotan kerajaan',
      ],
      keywords: [
        'Parameswara',
        'Selat Melaka',
        'Syahbandar',
        'Bendahara',
        'Hukum Kanun Melaka',
        '1511',
      ],
      difficulty: 'Sederhana',
    },
    category: 'school',
    language: 'bm',
    subject: 'Sejarah',
    level: 'KSSM Tingkatan 1',
  },
  'malacca-en': {
    key: 'malacca-en',
    blueprint: malaccaEn,
    analysis: {
      subject: 'History',
      level: 'KSSM Form 1',
      objectives: malaccaObjectivesEn,
      concepts: [
        'Founding of the Malacca Sultanate',
        'Maritime trade',
        'Administration',
        'Islam and culture',
        'Decline of the kingdom',
      ],
      keywords: [
        'Parameswara',
        'Strait of Malacca',
        'Syahbandar',
        'Bendahara',
        'Hukum Kanun Melaka',
        '1511',
      ],
      difficulty: 'Medium',
    },
    category: 'school',
    language: 'en',
    subject: 'History',
    level: 'KSSM Form 1',
  },
  'cyber-en': {
    key: 'cyber-en',
    blueprint: cyberEn,
    analysis: {
      subject: 'Introduction to Cybersecurity',
      level: 'Undergraduate Year 1',
      objectives: cyberObjectivesEn,
      concepts: [
        'CIA triad',
        'Authentication and authorization',
        'Threat landscape',
        'Cryptography',
        'Defence in depth',
      ],
      keywords: [
        'confidentiality',
        'integrity',
        'availability',
        'phishing',
        'MFA',
        'hashing',
        'zero trust',
        'incident response',
      ],
      difficulty: 'Medium',
    },
    category: 'higher-ed',
    language: 'en',
    subject: 'Introduction to Cybersecurity',
    level: 'Undergraduate Year 1',
  },
  'cyber-bm': {
    key: 'cyber-bm',
    blueprint: cyberBm,
    analysis: {
      subject: 'Pengenalan Keselamatan Siber',
      level: 'Ijazah Sarjana Muda Tahun 1',
      objectives: cyberObjectivesBm,
      concepts: [
        'Triad CIA',
        'Pengesahan dan kebenaran',
        'Landskap ancaman',
        'Kriptografi',
        'Pertahanan berlapis',
      ],
      keywords: [
        'kerahsiaan',
        'integriti',
        'ketersediaan',
        'phishing',
        'MFA',
        'hash',
        'zero trust',
        'tindak balas insiden',
      ],
      difficulty: 'Sederhana',
    },
    category: 'higher-ed',
    language: 'bm',
    subject: 'Pengenalan Keselamatan Siber',
    level: 'Ijazah Sarjana Muda Tahun 1',
  },
}

export function resolveVariant(
  category: GameCategory,
  language: Language,
): BlueprintVariant {
  if (category === 'school') {
    return language === 'en' ? variants['malacca-en'] : variants['malacca-bm']
  }
  return language === 'en' ? variants['cyber-en'] : variants['cyber-bm']
}

export function findVariantByKey(key: VariantKey): BlueprintVariant {
  return variants[key]
}
