/**
 * Backend schema types — kept 1:1 with the FastAPI contract in docs/API_CONTRACT.md.
 * Do not rename fields without updating the contract and both API clients.
 */

export type AgentName = 'analyzer' | 'planner' | 'generator' | 'builder'
export type AgentStatus = 'pending' | 'running' | 'done' | 'error'

export interface AgentEvent {
  agent: AgentName
  status: AgentStatus
  message: string
  timestamp: string
  output_preview?: string
}

export interface LearningObjective {
  id: string
  text: string
}

export interface CurriculumAnalysis {
  subject: string
  level: string
  objectives: LearningObjective[]
  concepts: string[]
  keywords: string[]
  difficulty: string
}

export type QuestionType = 'mcq' | 'puzzle'

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  answer: string
  explanation: string
  objective_id: string
}

export interface GameLevel {
  id: string
  name: string
  scene: string
  difficulty: string
  objective_ids: string[]
  narrative: string
  image_prompt: string
  questions: Question[]
}

export interface GameMechanics {
  hp: number
  points_per_correct: number
  badges: string[]
}

export interface GameBlueprint {
  title: string
  theme: string
  story_intro: string
  mechanics: GameMechanics
  levels: GameLevel[]
}

export interface AnswerRecord {
  question_id: string
  correct: boolean
  time_ms: number
}

export interface GameSession {
  game_id: string
  nickname: string
  score: number
  hp: number
  level_reached: number
  answers: AnswerRecord[]
}

export interface LeaderboardEntry {
  nickname: string
  score: number
  level_reached: number
}

export interface ObjectiveStat {
  objective_id: string
  text: string
  accuracy: number
}

export interface TeacherStats {
  game_id: string
  total_players: number
  avg_score: number
  per_objective: ObjectiveStat[]
  leaderboard: LeaderboardEntry[]
  recent_sessions: GameSession[]
}

/* ------------------------------------------------------------------ */
/* Frontend application types (not part of the agent pipeline schema)  */
/* ------------------------------------------------------------------ */

export type Language = 'bm' | 'en'
export type GameCategory = 'school' | 'higher-ed'
export type GameStatus = 'generating' | 'ready' | 'published'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface GameRecord {
  id: string
  blueprint: GameBlueprint
  analysis: CurriculumAnalysis
  status: GameStatus
  created_at: string
  category: GameCategory
  language: Language
  subject: string
  level: string
  players: number
  version: number
  feedback?: string
}

export interface GameSummary {
  id: string
  title: string
  subject: string
  level: string
  category: GameCategory
  language: Language
  status: GameStatus
  created_at: string
  players: number
  levels: number
  theme: string
}

export interface UploadResult {
  file_id: string
  filename: string
  size: number
}

export interface CreateGameInput {
  file_id?: string
  sample?: boolean
  category: GameCategory
  subject: string
  language: Language
  difficulty: Difficulty
  levels: number
}

export interface PipelineStart {
  pipeline_id: string
  game_id: string
}

export interface PipelineInfo extends PipelineStart {
  input: CreateGameInput
  created_at: string
  version: number
  feedback?: string
}

export interface SubmitAnswerResult {
  correct: boolean
  explanation: string
  points_awarded: number
}

export interface SubmitSessionResult {
  ok: boolean
  session_id: string
}

export interface LocalSession {
  session: GameSession
  completed_at: string
}
