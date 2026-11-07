import type {
  AnswerRecord,
  GameRecord,
  GameSession,
  ObjectiveStat,
  TeacherStats,
} from '../types'
import { readSessions } from '../lib/storage'

const STUDENT_NAMES = [
  'Aisyah',
  'Danish',
  'Nurul',
  'Haziq',
  'Mei Ling',
  'Arjun',
  'Siti',
  'Adam',
  'Farah',
  'Irfan',
  'Jia Wei',
  'Aina',
  'Firdaus',
  'Kavitha',
  'Luqman',
  'Hana',
  'Zikri',
  'Priya',
  'Ammar',
  'Syafiqah',
  'Wei Jian',
  'Nadia',
  'Umar',
  'Alia',
  'Ravi',
]

function hashString(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const WEAK_PROFILE_BM = [0.9, 0.78, 0.48, 0.64, 0.72]
const WEAK_PROFILE_CYBER = [0.88, 0.61, 0.55, 0.74, 0.83]

function objectiveBase(game: GameRecord, index: number): number {
  const profile = game.category === 'school' ? WEAK_PROFILE_BM : WEAK_PROFILE_CYBER
  return profile[index % profile.length] ?? 0.7
}

function simulatePlayer(
  game: GameRecord,
  nickname: string,
  random: () => number,
): GameSession {
  const answers: AnswerRecord[] = []
  let hp = game.blueprint.mechanics.hp
  let score = 0
  let levelReached = 1

  for (let levelIndex = 0; levelIndex < game.blueprint.levels.length; levelIndex += 1) {
    const level = game.blueprint.levels[levelIndex]
    if (!level) break
    levelReached = levelIndex + 1
    for (const question of level.questions) {
      if (hp <= 0) break
      const objectiveIndex = game.analysis.objectives.findIndex(
        (objective) => objective.id === question.objective_id,
      )
      const base = objectiveBase(game, Math.max(0, objectiveIndex))
      const probability = Math.min(0.97, Math.max(0.2, base + (random() - 0.5) * 0.24))
      const correct = random() < probability
      const timeMs = Math.round(3800 + random() * 11_000)
      answers.push({ question_id: question.id, correct, time_ms: timeMs })
      if (correct) {
        score += game.blueprint.mechanics.points_per_correct
      } else {
        hp -= 1
      }
    }
    if (hp <= 0) break
  }

  return {
    game_id: game.id,
    nickname,
    score,
    hp: Math.max(0, hp),
    level_reached: levelReached,
    answers,
  }
}

function accuracyFor(
  game: GameRecord,
  sessions: GameSession[],
): ObjectiveStat[] {
  const questionToObjective = new Map<string, string>()
  for (const level of game.blueprint.levels) {
    for (const question of level.questions) {
      questionToObjective.set(question.id, question.objective_id)
    }
  }

  const attempts = new Map<string, { correct: number; total: number }>()
  for (const objective of game.analysis.objectives) {
    attempts.set(objective.id, { correct: 0, total: 0 })
  }

  for (const session of sessions) {
    for (const answer of session.answers) {
      const objectiveId = questionToObjective.get(answer.question_id)
      if (!objectiveId) continue
      const entry = attempts.get(objectiveId)
      if (!entry) continue
      entry.total += 1
      if (answer.correct) entry.correct += 1
    }
  }

  return game.analysis.objectives.map((objective) => {
    const entry = attempts.get(objective.id) ?? { correct: 0, total: 0 }
    return {
      objective_id: objective.id,
      text: objective.text,
      accuracy: entry.total === 0 ? 0 : Math.round((entry.correct / entry.total) * 100),
    }
  })
}

export function generateMockStats(game: GameRecord): TeacherStats {
  const random = mulberry32(hashString(game.id))
  const playerCount = Math.max(game.players, 0)
  const sessions: GameSession[] = []

  for (let index = 0; index < playerCount; index += 1) {
    const name = STUDENT_NAMES[index % STUDENT_NAMES.length] ?? `Pelajar ${index + 1}`
    const nickname = index >= STUDENT_NAMES.length ? `${name} ${Math.floor(index / STUDENT_NAMES.length) + 1}` : name
    sessions.push(simulatePlayer(game, nickname, random))
  }

  const localSessions = readSessions()
    .filter((entry) => entry.session.game_id === game.id)
    .map((entry) => entry.session)

  const allSessions = [...localSessions, ...sessions]
  const localCount = localSessions.length

  const baseAvg =
    sessions.length === 0
      ? 0
      : Math.round(
          sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length,
        )
  const localAvg =
    localCount === 0
      ? 0
      : Math.round(
          localSessions.reduce((sum, session) => sum + session.score, 0) / localCount,
        )
  const totalPlayers = sessions.length + localCount
  const avgScore =
    totalPlayers === 0
      ? 0
      : Math.round(
          (baseAvg * sessions.length + localAvg * localCount) / totalPlayers,
        )

  const baseStats = accuracyFor(game, sessions)
  const localStats = accuracyFor(game, localSessions)
  const perObjective = baseStats.map((stat, index) => {
    const local = localStats[index]
    if (!local || localCount === 0 || sessions.length === 0) return stat
    return {
      ...stat,
      accuracy: Math.round(
        (stat.accuracy * sessions.length + local.accuracy * localCount) / totalPlayers,
      ),
    }
  })

  const leaderboard = [...allSessions]
    .sort((a, b) => b.score - a.score || a.answers.length - b.answers.length)
    .slice(0, 10)
    .map((session) => ({
      nickname: session.nickname,
      score: session.score,
      level_reached: session.level_reached,
    }))

  return {
    game_id: game.id,
    total_players: totalPlayers,
    avg_score: avgScore,
    per_objective: perObjective,
    leaderboard,
    recent_sessions: allSessions.slice(0, 25),
  }
}
