import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { AlertTriangle, ArrowLeft, RefreshCw, SearchX, Sparkles } from 'lucide-react'
import type { AnswerRecord, GameRecord, GameSession } from '../types'
import { useI18n } from '../i18n'
import { api } from '../api'
import { readString, STORAGE_KEYS, writeString } from '../lib/storage'
import { shareUrl } from '../lib/format'
import { toast } from '../store/toastStore'
import {
  isSoundEnabled,
  playClick,
  playCorrect,
  playLevelUp,
  playVictory,
  playWrong,
  setSoundEnabled,
} from '../game/audio'
import {
  isVoiceEnabled,
  setVoiceEnabled,
  speak,
  speechSupported,
  stopSpeaking,
} from '../lib/speech'
import { GameStage } from '../game/GameStage'
import { Button, LinkButton } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { NicknameGate } from '../components/play/NicknameGate'
import { StoryIntro } from '../components/play/StoryIntro'
import { LevelMap } from '../components/play/LevelMap'
import { Briefing } from '../components/play/Briefing'
import { QuizScreen, type QuizFeedback } from '../components/play/QuizScreen'
import { LevelResult } from '../components/play/LevelResult'
import { FinalResult, type SessionSaveState } from '../components/play/FinalResult'
import { Hud } from '../components/play/Hud'
import { ExitModal } from '../components/play/ExitModal'

type Phase =
  | 'loading'
  | 'error'
  | 'notFound'
  | 'nickname'
  | 'intro'
  | 'map'
  | 'briefing'
  | 'quiz'
  | 'levelResult'
  | 'final'

const CONFETTI_COLORS = ['#22d3ee', '#a78bfa', '#f5c451', '#34d399']

export function PlayPage() {
  const { t } = useI18n()
  const { gameId = '' } = useParams()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('loading')
  const [game, setGame] = useState<GameRecord | null>(null)
  const [nickname, setNickname] = useState(() =>
    readString(STORAGE_KEYS.nickname, ''),
  )
  const [levelIndex, setLevelIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [badges, setBadges] = useState<string[]>([])
  const [streak, setStreak] = useState(0)
  const [maxLevelStarted, setMaxLevelStarted] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [saveState, setSaveState] = useState<SessionSaveState>('idle')
  const [exitOpen, setExitOpen] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled())
  const [voiceOn, setVoiceOn] = useState(() => isVoiceEnabled())
  const [retryKey, setRetryKey] = useState(0)

  const questionStartRef = useRef(0)
  const submittedRef = useRef(false)
  const finalCelebratedRef = useRef(false)

  const voiceSupported = speechSupported()

  useEffect(() => {
    let active = true
    setPhase('loading')
    setGame(null)
    setAnswers([])
    setCompletedLevels([])
    setBadges([])
    setStreak(0)
    setMaxLevelStarted(1)
    setLevelIndex(0)
    setQuestionIndex(0)
    setSelected(null)
    setAnswerText('')
    setFeedback(null)
    setSubmitting(false)
    setSaveState('idle')
    setExitOpen(false)
    setSpeaking(false)
    submittedRef.current = false
    finalCelebratedRef.current = false

    api
      .getGame(gameId)
      .then((loaded) => {
        if (!active) return
        setGame(loaded)
        setPhase('nickname')
        questionStartRef.current = Date.now()
      })
      .catch((error: unknown) => {
        if (!active) return
        const message = error instanceof Error ? error.message : String(error)
        setPhase(message.includes('GAME_NOT_FOUND') ? 'notFound' : 'error')
      })

    return () => {
      active = false
      stopSpeaking()
    }
  }, [gameId, retryKey])

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  const totalLevels = game?.blueprint.levels.length ?? 0
  const maxHp = game?.blueprint.mechanics.hp ?? 5
  const pointsPerCorrect = game?.blueprint.mechanics.points_per_correct ?? 100
  const totalCorrect = answers.filter((answer) => answer.correct).length
  const totalWrong = answers.length - totalCorrect
  const hp = Math.max(0, maxHp - totalWrong)
  const score = totalCorrect * pointsPerCorrect

  const currentLevel = game?.blueprint.levels[levelIndex]
  const currentQuestion = currentLevel?.questions[questionIndex]
  const totalQuestions = game
    ? game.blueprint.levels.reduce((sum, level) => sum + level.questions.length, 0)
    : 0

  const levelQuestionIds = useMemo(
    () => new Set(currentLevel?.questions.map((question) => question.id) ?? []),
    [currentLevel],
  )
  const levelCorrect = answers.filter(
    (answer) => levelQuestionIds.has(answer.question_id) && answer.correct,
  ).length

  const activeLevelIndex = useMemo(() => {
    if (!game) return 0
    const index = game.blueprint.levels.findIndex(
      (_, level) =>
        !completedLevels.includes(level) &&
        (level === 0 || completedLevels.includes(level - 1)),
    )
    return index === -1 ? game.blueprint.levels.length - 1 : index
  }, [game, completedLevels])

  const won =
    game !== null &&
    hp > 0 &&
    completedLevels.length === game.blueprint.levels.length

  const showHud =
    Boolean(game) && phase !== 'nickname' && phase !== 'loading' && phase !== 'notFound' && phase !== 'error'

  const sceneKey = useMemo(() => {
    if (!game) return 'map'
    if (phase === 'map' || phase === 'final') return 'map'
    const index = phase === 'intro' ? 0 : levelIndex
    return game.blueprint.levels[index]?.scene ?? 'map'
  }, [game, phase, levelIndex])

  const hudProgress = useMemo(() => {
    if (!game) return undefined
    if (phase === 'map') {
      return (completedLevels.length / game.blueprint.levels.length) * 100
    }
    if (phase === 'quiz' && currentLevel) {
      return (
        ((questionIndex + (feedback ? 1 : 0)) / currentLevel.questions.length) * 100
      )
    }
    return undefined
  }, [game, phase, completedLevels.length, currentLevel, questionIndex, feedback])

  const hudLevelIndex =
    phase === 'map' || phase === 'intro' || phase === 'final' ? -1 : levelIndex

  /* Persist the score exactly once when the run ends. */
  useEffect(() => {
    if (phase !== 'final' || !game || submittedRef.current) return
    submittedRef.current = true
    const session: GameSession = {
      game_id: game.id,
      nickname,
      score,
      hp,
      level_reached: Math.max(1, maxLevelStarted),
      answers,
    }
    setSaveState('saving')
    api
      .submitSession(session)
      .then(() => setSaveState('saved'))
      .catch(() => {
        setSaveState('error')
        toast(t('play.sessionError'), 'error')
      })
  }, [phase, game, nickname, score, hp, maxLevelStarted, answers, t])

  useEffect(() => {
    if (phase !== 'final' || !game || finalCelebratedRef.current) return
    finalCelebratedRef.current = true
    if (!won) return
    playVictory()
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    })
    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
      })
    }, 280)
    return () => window.clearTimeout(timer)
  }, [phase, game, won])

  const stopRead = () => {
    stopSpeaking()
    setSpeaking(false)
  }

  const toggleRead = (text: string) => {
    if (!game || !text.trim()) return
    if (speaking) {
      stopRead()
      return
    }
    if (!voiceOn) {
      setVoiceOn(true)
      setVoiceEnabled(true)
    }
    const started = speak(text, game.language, () => setSpeaking(false))
    setSpeaking(started)
    if (!started) toast(t('play.voiceUnsupported'), 'info')
  }

  const handleNickname = (value: string) => {
    setNickname(value)
    writeString(STORAGE_KEYS.nickname, value)
    playClick()
    setPhase('intro')
  }

  const openBriefing = (index: number) => {
    stopRead()
    setLevelIndex(index)
    setQuestionIndex(0)
    setSelected(null)
    setAnswerText('')
    setFeedback(null)
    setPhase('briefing')
    playClick()
  }

  const beginLevel = (index: number) => {
    if (!game) return
    const level = game.blueprint.levels[index]
    if (!level) return
    const ids = new Set(level.questions.map((question) => question.id))
    setAnswers((previous) => previous.filter((answer) => !ids.has(answer.question_id)))
    stopRead()
    setLevelIndex(index)
    setQuestionIndex(0)
    setSelected(null)
    setAnswerText('')
    setFeedback(null)
    setSubmitting(false)
    setStreak(0)
    setMaxLevelStarted((previous) => Math.max(previous, index + 1))
    questionStartRef.current = Date.now()
    setPhase('quiz')
    playClick()
  }

  const handleSelect = (value: string) => {
    if (feedback || submitting) return
    setSelected(value)
    playClick()
  }

  const handleSubmit = async () => {
    if (!game || !currentQuestion || feedback || submitting) return
    const value =
      currentQuestion.type === 'mcq' ? (selected ?? '') : answerText.trim()
    if (!value) return

    const timeMs = Math.max(0, Date.now() - questionStartRef.current)
    setSubmitting(true)
    try {
      const result = await api.submitAnswer(
        game.id,
        currentQuestion.id,
        value,
        timeMs,
      )
      setAnswers((previous) => [
        ...previous.filter((answer) => answer.question_id !== currentQuestion.id),
        { question_id: currentQuestion.id, correct: result.correct, time_ms: timeMs },
      ])
      setFeedback({
        correct: result.correct,
        explanation: result.explanation,
        correctAnswer: currentQuestion.answer.split('|')[0] ?? currentQuestion.answer,
      })
      if (result.correct) {
        setStreak((previous) => previous + 1)
        playCorrect()
      } else {
        setStreak(0)
        playWrong()
      }
    } catch {
      toast(t('errors.generic'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const completeLevel = () => {
    if (!game || !currentLevel) return
    const alreadyCompleted = completedLevels.includes(levelIndex)
    if (!alreadyCompleted) {
      setCompletedLevels((previous) => [...previous, levelIndex])
      const badge =
        game.blueprint.mechanics.badges[levelIndex] ?? `#${levelIndex + 1}`
      setBadges((previous) =>
        previous.includes(badge) ? previous : [...previous, badge],
      )
    }
    stopRead()
    setFeedback(null)
    setPhase('levelResult')
    playLevelUp()
    confetti({
      particleCount: 80,
      spread: 74,
      origin: { y: 0.7 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    })
  }

  const handleNext = () => {
    if (!currentLevel || !feedback) return
    if (hp <= 0) {
      stopRead()
      setPhase('final')
      return
    }
    const isLast = questionIndex >= currentLevel.questions.length - 1
    if (isLast) {
      completeLevel()
      return
    }
    setQuestionIndex((previous) => previous + 1)
    setSelected(null)
    setAnswerText('')
    setFeedback(null)
    questionStartRef.current = Date.now()
  }

  const handleNextLevel = () => {
    if (!game) return
    if (levelIndex + 1 < game.blueprint.levels.length) {
      openBriefing(levelIndex + 1)
    } else {
      stopRead()
      setPhase('final')
    }
  }

  const handlePlayAgain = () => {
    stopRead()
    setAnswers([])
    setCompletedLevels([])
    setBadges([])
    setStreak(0)
    setMaxLevelStarted(1)
    setLevelIndex(0)
    setQuestionIndex(0)
    setSelected(null)
    setAnswerText('')
    setFeedback(null)
    setSubmitting(false)
    setSaveState('idle')
    submittedRef.current = false
    finalCelebratedRef.current = false
    questionStartRef.current = Date.now()
    setPhase('map')
    playClick()
  }

  const handleLeave = () => {
    stopRead()
    navigate('/games')
  }

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
    if (next) playClick()
  }

  const toggleVoice = () => {
    const next = !voiceOn
    setVoiceOn(next)
    setVoiceEnabled(next)
    if (!next) stopRead()
  }

  if (phase === 'loading') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-abyss px-4 text-mist">
        <Spinner className="h-8 w-8" />
        <p className="text-sm">{t('play.loading')}</p>
        <p className="font-mono text-[10px] text-slate-600">{gameId}</p>
      </div>
    )
  }

  if (phase === 'notFound' || phase === 'error' || !game) {
    const notFound = phase === 'notFound'
    return (
      <div className="flex min-h-dvh items-center justify-center bg-abyss px-4">
        <div className="card w-full max-w-md p-8 text-center">
          <span
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
              notFound
                ? 'border-neon/20 bg-neon/10 text-neon-soft'
                : 'border-danger/25 bg-danger/10 text-danger'
            }`}
          >
            {notFound ? (
              <SearchX className="h-6 w-6" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
          </span>
          <h1 className="mt-5 font-display text-xl font-semibold text-white">
            {notFound ? t('play.notFoundTitle') : t('errors.gameNotFound')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            {notFound ? t('play.notFoundDesc') : t('play.sessionError')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {!notFound && (
              <Button
                onClick={() => setRetryKey((value) => value + 1)}
                icon={<RefreshCw className="h-4 w-4" />}
              >
                {t('common.retry')}
              </Button>
            )}
            <LinkButton
              to="/"
              variant={notFound ? 'primary' : 'secondary'}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              {t('play.backHome')}
            </LinkButton>
            <LinkButton to="/games" variant="ghost">
              {t('play.backToGames')}
            </LinkButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-abyss">
      <div className="fixed inset-0 z-0">
        <GameStage sceneKey={sceneKey} />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/80 via-abyss/60 to-abyss/95" />
        <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-grid opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_18%,#04060f_88%)]" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        {showHud && (
          <Hud
            game={game}
            nickname={nickname}
            hp={hp}
            score={score}
            streak={streak}
            levelIndex={hudLevelIndex}
            progress={hudProgress}
            soundOn={soundOn}
            voiceOn={voiceOn}
            voiceSupported={voiceSupported}
            onToggleSound={toggleSound}
            onToggleVoice={toggleVoice}
            onExit={() => setExitOpen(true)}
          />
        )}

        <main className="flex-1">
          {phase === 'nickname' && (
            <NicknameGate
              game={game}
              initialNickname={nickname}
              onStart={handleNickname}
            />
          )}

          {phase === 'intro' && (
            <StoryIntro
              game={game}
              nickname={nickname}
              speaking={speaking}
              voiceSupported={voiceSupported}
              onRead={() => toggleRead(game.blueprint.story_intro)}
              onStart={() => {
                stopRead()
                setPhase('map')
                playClick()
              }}
            />
          )}

          {phase === 'map' && (
            <LevelMap
              game={game}
              nickname={nickname}
              score={score}
              completed={completedLevels}
              activeLevelIndex={activeLevelIndex}
              onSelect={openBriefing}
            />
          )}

          {phase === 'briefing' && currentLevel && (
            <Briefing
              game={game}
              level={currentLevel}
              levelIndex={levelIndex}
              totalLevels={totalLevels}
              speaking={speaking}
              voiceSupported={voiceSupported}
              onRead={() =>
                toggleRead(`${currentLevel.name}. ${currentLevel.narrative}`)
              }
              onStart={() => beginLevel(levelIndex)}
              onBack={() => {
                stopRead()
                setPhase('map')
              }}
            />
          )}

          {phase === 'quiz' && currentLevel && currentQuestion && (
            <QuizScreen
              level={currentLevel}
              question={currentQuestion}
              questionIndex={questionIndex}
              totalQuestions={currentLevel.questions.length}
              selected={selected}
              answerText={answerText}
              submitting={submitting}
              feedback={feedback}
              pointsPerCorrect={pointsPerCorrect}
              speaking={speaking}
              voiceSupported={voiceSupported}
              onSelect={handleSelect}
              onAnswerText={setAnswerText}
              onSubmit={() => {
                void handleSubmit()
              }}
              onNext={handleNext}
              onRead={() =>
                toggleRead(
                  currentQuestion.options
                    ? `${currentQuestion.text}. ${currentQuestion.options.join('. ')}`
                    : currentQuestion.text,
                )
              }
              isLast={questionIndex >= currentLevel.questions.length - 1}
            />
          )}

          {phase === 'levelResult' && currentLevel && (
            <LevelResult
              level={currentLevel}
              levelIndex={levelIndex}
              totalLevels={totalLevels}
              correct={levelCorrect}
              totalQuestions={currentLevel.questions.length}
              score={score}
              hp={hp}
              maxHp={maxHp}
              badge={game.blueprint.mechanics.badges[levelIndex] ?? `#${levelIndex + 1}`}
              completedCount={completedLevels.length}
              hasNext={levelIndex + 1 < totalLevels}
              onNext={handleNextLevel}
              onMap={() => {
                stopRead()
                setPhase('map')
              }}
            />
          )}

          {phase === 'final' && (
            <FinalResult
              game={game}
              nickname={nickname}
              won={won}
              score={score}
              hp={hp}
              maxHp={maxHp}
              correct={totalCorrect}
              totalQuestions={totalQuestions}
              levelReached={Math.max(1, maxLevelStarted)}
              badges={badges}
              saveState={saveState}
              onPlayAgain={handlePlayAgain}
            />
          )}
        </main>

        {phase === 'map' && (
          <p className="relative z-10 pb-4 text-center text-[10px] text-slate-600">
            <Sparkles className="mr-1 inline h-3 w-3" />
            {shareUrl(`/play/${game.id}`)}
          </p>
        )}
      </div>

      <ExitModal
        open={exitOpen}
        onStay={() => setExitOpen(false)}
        onLeave={handleLeave}
      />
    </div>
  )
}
