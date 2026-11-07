import { Anchor, Building2, KeyRound, Landmark, Map, Shield, Swords, type LucideIcon } from 'lucide-react'

export interface SceneMeta {
  icon: LucideIcon
  gradient: string
  ring: string
  text: string
  chip: string
}

const SCENES: Record<string, SceneMeta> = {
  pelabuhan: {
    icon: Anchor,
    gradient: 'from-gold/20 via-[#1a2d4d] to-neon/10',
    ring: 'border-gold/30',
    text: 'text-gold',
    chip: 'bg-gold/10 text-gold',
  },
  istana: {
    icon: Landmark,
    gradient: 'from-plum/25 via-[#241444] to-gold/10',
    ring: 'border-plum/30',
    text: 'text-plum-soft',
    chip: 'bg-plum/10 text-plum-soft',
  },
  medan_perang: {
    icon: Swords,
    gradient: 'from-danger/20 via-[#2a1220] to-gold/10',
    ring: 'border-danger/30',
    text: 'text-danger',
    chip: 'bg-danger/10 text-danger',
  },
  firewall: {
    icon: Shield,
    gradient: 'from-neon/20 via-[#071a2c] to-plum/10',
    ring: 'border-neon/30',
    text: 'text-neon-soft',
    chip: 'bg-neon/10 text-neon-soft',
  },
  vault: {
    icon: KeyRound,
    gradient: 'from-plum/25 via-[#150c2e] to-neon/10',
    ring: 'border-plum/30',
    text: 'text-plum-soft',
    chip: 'bg-plum/10 text-plum-soft',
  },
  citadel: {
    icon: Building2,
    gradient: 'from-success/20 via-[#071b2a] to-neon/10',
    ring: 'border-success/30',
    text: 'text-success',
    chip: 'bg-success/10 text-success',
  },
}

const FALLBACK: SceneMeta = {
  icon: Map,
  gradient: 'from-neon/15 via-deep to-plum/10',
  ring: 'border-neon/25',
  text: 'text-neon-soft',
  chip: 'bg-neon/10 text-neon-soft',
}

export function sceneMeta(scene: string): SceneMeta {
  return SCENES[scene] ?? FALLBACK
}
