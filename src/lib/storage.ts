import type { GameRecord, LocalSession } from '../types'

const PREFIX = 'syntra:v1'
export const STORAGE_KEYS = {
  games: `${PREFIX}:games`,
  sessions: `${PREFIX}:sessions`,
  pipelines: `${PREFIX}:pipelines`,
  seeded: `${PREFIX}:seeded`,
  seed: `${PREFIX}:seed`,
  nickname: `${PREFIX}:nickname`,
  voice: `${PREFIX}:voice`,
  sound: `${PREFIX}:sound`,
} as const

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — demo continues in memory */
  }
}

export function readString(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export function readGames(): GameRecord[] {
  return readJson<GameRecord[]>(STORAGE_KEYS.games, [])
}

export function writeGames(games: GameRecord[]): void {
  writeJson(STORAGE_KEYS.games, games)
}

export function readSessions(): LocalSession[] {
  return readJson<LocalSession[]>(STORAGE_KEYS.sessions, [])
}

export function appendSession(entry: LocalSession): void {
  const sessions = readSessions()
  sessions.unshift(entry)
  writeJson(STORAGE_KEYS.sessions, sessions.slice(0, 200))
}

export function readPipelineConfigs(): Record<string, unknown> {
  return readJson<Record<string, unknown>>(STORAGE_KEYS.pipelines, {})
}

export function writePipelineConfigs(configs: Record<string, unknown>): void {
  writeJson(STORAGE_KEYS.pipelines, configs)
}
