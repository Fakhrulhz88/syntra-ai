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

export interface StreamOptions {
  signal?: AbortSignal
}

/**
 * The single seam between the React app and the backend.
 * `mockApi` implements this fully; `httpApi` maps it onto the FastAPI routes
 * documented in docs/API_CONTRACT.md.
 */
export interface ApiClient {
  uploadPdf: (
    file: File,
    onProgress?: (percent: number) => void,
  ) => Promise<UploadResult>

  startPipeline: (input: CreateGameInput) => Promise<PipelineStart>

  getPipeline: (pipelineId: string) => Promise<PipelineInfo>

  streamPipeline: (
    pipelineId: string,
    options?: StreamOptions,
  ) => AsyncGenerator<AgentEvent, void, unknown>

  getGame: (gameId: string) => Promise<GameRecord>

  listGames: () => Promise<GameSummary[]>

  submitAnswer: (
    gameId: string,
    questionId: string,
    answer: string,
    timeMs: number,
  ) => Promise<SubmitAnswerResult>

  submitSession: (session: GameSession) => Promise<SubmitSessionResult>

  getTeacherStats: (gameId: string) => Promise<TeacherStats>

  regenerateGame: (
    gameId: string,
    input: { feedback?: string },
  ) => Promise<GameRecord>

  approveGame: (gameId: string) => Promise<GameRecord>
}
