import type {
  AgentEvent,
  CreateGameInput,
  GameRecord,
  GameSession,
  GameSummary,
  PipelineInfo,
  PipelineStart,
  Question,
  SubmitAnswerResult,
  SubmitSessionResult,
  TeacherStats,
  UploadResult,
} from '../types'
import { buildAgentEvents } from '../data/agentEvents'
import { generateMockStats } from '../data/mockStudents'
import { SEEDED_GAMES } from '../data/seeded'
import { resolveVariant } from '../data/variants'
import {
  appendSession,
  readGames,
  readJson,
  readSessions,
  readString,
  STORAGE_KEYS,
  writeGames,
  writeJson,
  writeString,
} from '../lib/storage'
import type { ApiClient, StreamOptions } from './client'

interface MockPipelineConfig {
  id: string
  game_id: string
  input: CreateGameInput
  created_at: string
  feedback?: string
  version: number
}

type PipelineStore = Record<string, MockPipelineConfig>

let gamesCache: GameRecord[] | null = null

function randomId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    function onAbort() {
      window.clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function ensureSeededGames(): GameRecord[] {
  if (gamesCache) return gamesCache
  const marker = readString(STORAGE_KEYS.seed, '')
  if (marker !== 'v3') {
    const existing = readGames()
    const merged = [
      ...SEEDED_GAMES,
      ...existing.filter((game) => !SEEDED_GAMES.some((seed) => seed.id === game.id)),
    ]
    writeGames(merged)
    writeString(STORAGE_KEYS.seed, 'v3')
    gamesCache = merged
  } else {
    const stored = readGames()
    gamesCache = stored.length > 0 ? stored : [...SEEDED_GAMES]
  }
  return gamesCache
}

function persistGames(games: GameRecord[]): void {
  gamesCache = games
  writeGames(games)
}

function findGameOrThrow(gameId: string): GameRecord {
  const game = ensureSeededGames().find((entry) => entry.id === gameId)
  if (!game) throw new Error(`GAME_NOT_FOUND:${gameId}`)
  return game
}

function updateGame(gameId: string, updater: (game: GameRecord) => GameRecord): GameRecord {
  const games = ensureSeededGames()
  const index = games.findIndex((entry) => entry.id === gameId)
  if (index < 0) throw new Error(`GAME_NOT_FOUND:${gameId}`)
  const current = games[index]
  if (!current) throw new Error(`GAME_NOT_FOUND:${gameId}`)
  const updated = updater(current)
  const next = [...games]
  next[index] = updated
  persistGames(next)
  return updated
}

function readPipelines(): PipelineStore {
  return readJson<PipelineStore>(STORAGE_KEYS.pipelines, {})
}

function writePipelines(pipelines: PipelineStore): void {
  writeJson(STORAGE_KEYS.pipelines, pipelines)
}

function buildGameRecord(input: CreateGameInput): GameRecord {
  const variant = resolveVariant(input.category, input.language)
  const requestedLevels = Math.min(
    Math.max(Math.round(input.levels), 2),
    variant.blueprint.levels.length,
  )
  const difficultyLabel =
    input.difficulty === 'easy'
      ? input.language === 'bm'
        ? 'Mudah'
        : 'Easy'
      : input.difficulty === 'hard'
        ? input.language === 'bm'
          ? 'Cabar'
          : 'Challenging'
        : input.language === 'bm'
          ? 'Sederhana'
          : 'Medium'

  return {
    id: randomId('game'),
    blueprint: {
      ...variant.blueprint,
      levels: variant.blueprint.levels.slice(0, requestedLevels),
    },
    analysis: {
      ...variant.analysis,
      difficulty: difficultyLabel,
    },
    status: 'generating',
    created_at: nowIso(),
    category: input.category,
    language: input.language,
    subject: variant.analysis.subject,
    level: variant.analysis.level,
    players: 20,
    version: 1,
  }
}

function ensureDemoPipeline(): MockPipelineConfig {
  const pipelines = readPipelines()
  const existing = pipelines.demo
  if (existing) {
    const game = ensureSeededGames().find((entry) => entry.id === existing.game_id)
    if (game) return existing
  }
  const game = buildGameRecord({
    sample: true,
    category: 'school',
    subject: 'sejarah',
    language: 'bm',
    difficulty: 'medium',
    levels: 3,
  })
  persistGames([game, ...ensureSeededGames()])
  const config: MockPipelineConfig = {
    id: 'demo',
    game_id: game.id,
    input: {
      sample: true,
      category: 'school',
      subject: 'sejarah',
      language: 'bm',
      difficulty: 'medium',
      levels: 3,
    },
    created_at: nowIso(),
    version: 1,
  }
  writePipelines({ ...pipelines, demo: config })
  return config
}

function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function findQuestion(game: GameRecord, questionId: string): Question | undefined {
  for (const level of game.blueprint.levels) {
    const question = level.questions.find((entry) => entry.id === questionId)
    if (question) return question
  }
  return undefined
}

function isCorrect(question: Question, answer: string): boolean {
  const normalized = normalizeAnswer(answer)
  return question.answer
    .split('|')
    .map((entry) => normalizeAnswer(entry))
    .some((entry) => entry.length > 0 && entry === normalized)
}

function localSessionCount(gameId: string): number {
  return readSessions().filter((entry) => entry.session.game_id === gameId).length
}

export const mockApi: ApiClient = {
  async uploadPdf(
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    for (const percent of [12, 34, 58, 76, 91, 100]) {
      await sleep(130)
      onProgress?.(percent)
    }
    return {
      file_id: randomId('file'),
      filename: file.name,
      size: file.size,
    }
  },

  async startPipeline(input: CreateGameInput): Promise<PipelineStart> {
    await sleep(650)
    const game = buildGameRecord(input)
    persistGames([game, ...ensureSeededGames()])

    const pipelineId = randomId('pipe')
    const config: MockPipelineConfig = {
      id: pipelineId,
      game_id: game.id,
      input,
      created_at: nowIso(),
      version: 1,
    }
    writePipelines({ ...readPipelines(), [pipelineId]: config })
    return { pipeline_id: pipelineId, game_id: game.id }
  },

  async getPipeline(pipelineId: string): Promise<PipelineInfo> {
    await sleep(180)
    const config =
      pipelineId === 'demo' ? ensureDemoPipeline() : readPipelines()[pipelineId]
    if (!config) throw new Error(`PIPELINE_NOT_FOUND:${pipelineId}`)
    return {
      pipeline_id: config.id,
      game_id: config.game_id,
      input: config.input,
      created_at: config.created_at,
      version: config.version,
      feedback: config.feedback,
    }
  },

  async *streamPipeline(
    pipelineId: string,
    options?: StreamOptions,
  ): AsyncGenerator<AgentEvent, void, unknown> {
    const config =
      pipelineId === 'demo' ? ensureDemoPipeline() : readPipelines()[pipelineId]

    if (!config) throw new Error(`PIPELINE_NOT_FOUND:${pipelineId}`)
    const game = findGameOrThrow(config.game_id)
    const events = buildAgentEvents(
      game.analysis,
      game.blueprint,
      game.language,
      game.id,
      config.feedback,
    )

    await sleep(450, options?.signal)

    for (const event of events) {
      if (options?.signal?.aborted) return
      const delay =
        event.status === 'done' ? 550 + Math.random() * 250 : 780 + Math.random() * 620
      await sleep(delay, options?.signal)
      yield { ...event, timestamp: nowIso() }
    }

    updateGame(config.game_id, (current) =>
      current.status === 'generating' ? { ...current, status: 'ready' } : current,
    )
  },

  async getGame(gameId: string): Promise<GameRecord> {
    await sleep(260)
    return findGameOrThrow(gameId)
  },

  async listGames(): Promise<GameSummary[]> {
    await sleep(420)
    return ensureSeededGames()
      .map((game) => ({
        id: game.id,
        title: game.blueprint.title,
        subject: game.subject,
        level: game.level,
        category: game.category,
        language: game.language,
        status: game.status,
        created_at: game.created_at,
        players: game.players + localSessionCount(game.id),
        levels: game.blueprint.levels.length,
        theme: game.blueprint.theme,
      }))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
  },

  async submitAnswer(
    gameId: string,
    questionId: string,
    answer: string,
    _timeMs: number,
  ): Promise<SubmitAnswerResult> {
    await sleep(120)
    const game = findGameOrThrow(gameId)
    const question = findQuestion(game, questionId)
    if (!question) throw new Error(`QUESTION_NOT_FOUND:${questionId}`)
    const correct = isCorrect(question, answer)
    return {
      correct,
      explanation: question.explanation,
      points_awarded: correct ? game.blueprint.mechanics.points_per_correct : 0,
    }
  },

  async submitSession(session: GameSession): Promise<SubmitSessionResult> {
    await sleep(380)
    appendSession({ session, completed_at: nowIso() })
    return { ok: true, session_id: randomId('session') }
  },

  async getTeacherStats(gameId: string): Promise<TeacherStats> {
    await sleep(520)
    const game = findGameOrThrow(gameId)
    return generateMockStats(game)
  },

  async regenerateGame(
    gameId: string,
    input: { feedback?: string },
  ): Promise<GameRecord> {
    await sleep(700)
    const updated = updateGame(gameId, (game) => ({
      ...game,
      version: game.version + 1,
      feedback: input.feedback?.trim() || game.feedback,
      status: 'ready',
    }))
    const pipelines = readPipelines()
    const next: PipelineStore = {}
    for (const [key, config] of Object.entries(pipelines)) {
      next[key] =
        config.game_id === gameId
          ? { ...config, feedback: input.feedback?.trim() || config.feedback, version: updated.version }
          : config
    }
    writePipelines(next)
    return updated
  },

  async approveGame(gameId: string): Promise<GameRecord> {
    await sleep(420)
    return updateGame(gameId, (game) => ({ ...game, status: 'published' }))
  },
}
