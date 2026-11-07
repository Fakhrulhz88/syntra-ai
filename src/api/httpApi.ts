import type {
  AgentEvent,
  CreateGameInput,
  GameRecord,
  GameSession,
  GameSummary,
  PipelineInfo,
  PipelineStart,
  SubmitAnswerResult,
  SubmitSessionResult,
  TeacherStats,
  UploadResult,
} from '../types'
import type { ApiClient, StreamOptions } from './client'

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  })
  if (!response.ok) {
    throw new Error(`API_ERROR:${response.status}:${response.statusText}`)
  }
  return (await response.json()) as T
}

function isAgentEvent(value: unknown): value is AgentEvent {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.agent === 'string' &&
    typeof record.status === 'string' &&
    typeof record.message === 'string' &&
    typeof record.timestamp === 'string'
  )
}

/**
 * Real-backend implementation. Routes are documented in docs/API_CONTRACT.md.
 * Set VITE_USE_MOCK=false and VITE_API_URL=http://localhost:8000 to use it.
 */
export const httpApi: ApiClient = {
  // POST /api/upload  (multipart/form-data: file)
  // TODO: swap fetch for XHR if byte-level upload progress is required.
  async uploadPdf(file: File): Promise<UploadResult> {
    const body = new FormData()
    body.append('file', file)
    return request<UploadResult>('/api/upload', { method: 'POST', body })
  },

  // POST /api/pipeline/start  { category, subject, language, difficulty, levels, file_id?, sample? }
  async startPipeline(input: CreateGameInput): Promise<PipelineStart> {
    return request<PipelineStart>('/api/pipeline/start', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  // GET /api/pipeline/{id}
  async getPipeline(pipelineId: string): Promise<PipelineInfo> {
    return request<PipelineInfo>(`/api/pipeline/${pipelineId}`)
  },

  /**
   * GET /api/pipeline/{id}/events  (Server-Sent Events)
   * Each `data:` frame is an AgentEvent. The stream closes after a
   * `event: done` frame or the final builder event.
   */
  async *streamPipeline(
    pipelineId: string,
    options?: StreamOptions,
  ): AsyncGenerator<AgentEvent, void, unknown> {
    const source = new EventSource(`${BASE_URL}/api/pipeline/${pipelineId}/events`)
    const queue: AgentEvent[] = []
    let finished = false
    let failure: Error | null = null
    let wake: (() => void) | null = null

    const notify = () => {
      wake?.()
      wake = null
    }

    const onMessage = (event: MessageEvent<string>) => {
      try {
        const parsed: unknown = JSON.parse(event.data)
        if (isAgentEvent(parsed)) {
          queue.push(parsed)
          notify()
        }
      } catch {
        failure = new Error('SSE_PARSE_ERROR')
        finished = true
        source.close()
        notify()
      }
    }

    const onDone = () => {
      finished = true
      source.close()
      notify()
    }

    const onError = () => {
      if (finished) return
      failure = new Error('SSE_CONNECTION_ERROR')
      finished = true
      source.close()
      notify()
    }

    const onAbort = () => {
      finished = true
      source.close()
      notify()
    }

    source.addEventListener('message', onMessage as EventListener)
    source.addEventListener('done', onDone)
    source.addEventListener('error', onError)
    options?.signal?.addEventListener('abort', onAbort, { once: true })

    try {
      while (!finished || queue.length > 0) {
        if (options?.signal?.aborted) return
        const next = queue.shift()
        if (next) {
          yield next
          continue
        }
        if (failure) throw failure
        await new Promise<void>((resolve) => {
          wake = resolve
        })
        if (failure) throw failure
      }
    } finally {
      source.removeEventListener('message', onMessage as EventListener)
      source.removeEventListener('done', onDone)
      source.removeEventListener('error', onError)
      options?.signal?.removeEventListener('abort', onAbort)
      source.close()
    }
  },

  // GET /api/games/{id}
  async getGame(gameId: string): Promise<GameRecord> {
    return request<GameRecord>(`/api/games/${gameId}`)
  },

  // GET /api/games
  async listGames(): Promise<GameSummary[]> {
    return request<GameSummary[]>('/api/games')
  },

  // POST /api/games/{id}/answers  { question_id, answer, time_ms }
  async submitAnswer(
    gameId: string,
    questionId: string,
    answer: string,
    timeMs: number,
  ): Promise<SubmitAnswerResult> {
    return request<SubmitAnswerResult>(`/api/games/${gameId}/answers`, {
      method: 'POST',
      body: JSON.stringify({ question_id: questionId, answer, time_ms: timeMs }),
    })
  },

  // POST /api/sessions  (full GameSession payload)
  async submitSession(session: GameSession): Promise<SubmitSessionResult> {
    return request<SubmitSessionResult>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    })
  },

  // GET /api/teacher/{game_id}/stats
  async getTeacherStats(gameId: string): Promise<TeacherStats> {
    return request<TeacherStats>(`/api/teacher/${gameId}/stats`)
  },

  // POST /api/games/{id}/regenerate  { feedback? }
  async regenerateGame(
    gameId: string,
    input: { feedback?: string },
  ): Promise<GameRecord> {
    return request<GameRecord>(`/api/games/${gameId}/regenerate`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  // POST /api/games/{id}/approve
  async approveGame(gameId: string): Promise<GameRecord> {
    return request<GameRecord>(`/api/games/${gameId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approved: true }),
    })
  },
}
