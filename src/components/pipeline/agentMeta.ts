import {
  BookOpenCheck,
  Boxes,
  PenLine,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { AgentName } from '../../types'
import type { TranslationKey } from '../../i18n'

export interface AgentMeta {
  step: string
  icon: LucideIcon
  nameKey: TranslationKey
  roleKey: TranslationKey
  shortKey: TranslationKey
  accent: string
  soft: string
  border: string
  bg: string
  glow: string
}

export const AGENT_ORDER: AgentName[] = [
  'analyzer',
  'planner',
  'generator',
  'builder',
]

export const agentMeta: Record<AgentName, AgentMeta> = {
  analyzer: {
    step: '01',
    icon: BookOpenCheck,
    nameKey: 'agent.analyzer.name',
    roleKey: 'agent.analyzer.role',
    shortKey: 'agent.analyzer.short',
    accent: 'text-neon',
    soft: 'text-neon-soft',
    border: 'border-neon/30',
    bg: 'bg-neon/10',
    glow: 'shadow-[0_0_45px_-18px_rgba(34,211,238,0.9)]',
  },
  planner: {
    step: '02',
    icon: Workflow,
    nameKey: 'agent.planner.name',
    roleKey: 'agent.planner.role',
    shortKey: 'agent.planner.short',
    accent: 'text-plum',
    soft: 'text-plum-soft',
    border: 'border-plum/30',
    bg: 'bg-plum/10',
    glow: 'shadow-[0_0_45px_-18px_rgba(167,139,250,0.9)]',
  },
  generator: {
    step: '03',
    icon: PenLine,
    nameKey: 'agent.generator.name',
    roleKey: 'agent.generator.role',
    shortKey: 'agent.generator.short',
    accent: 'text-gold',
    soft: 'text-gold',
    border: 'border-gold/30',
    bg: 'bg-gold/10',
    glow: 'shadow-[0_0_45px_-18px_rgba(245,196,81,0.9)]',
  },
  builder: {
    step: '04',
    icon: Boxes,
    nameKey: 'agent.builder.name',
    roleKey: 'agent.builder.role',
    shortKey: 'agent.builder.short',
    accent: 'text-success',
    soft: 'text-success',
    border: 'border-success/30',
    bg: 'bg-success/10',
    glow: 'shadow-[0_0_45px_-18px_rgba(52,211,153,0.9)]',
  },
}
