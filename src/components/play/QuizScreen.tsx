import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  CircleHelp,
  Keyboard,
  Lightbulb,
  Mic,
  Sparkles,
  Square,
  Trophy,
  X,
} from 'lucide-react'
import type { GameLevel, Question } from '../../types'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'

export interface QuizFeedback {
  correct: boolean
  explanation: string
  correctAnswer: string
}

interface QuizScreenProps {
  level: GameLevel
  question: Question
  questionIndex: number
  totalQuestions: number
  selected: string | null
  answerText: string
  submitting: boolean
  feedback: QuizFeedback | null
  pointsPerCorrect: number
  speaking: boolean
  voiceSupported: boolean
  onSelect: (value: string) => void
  onAnswerText: (value: string) => void
  onSubmit: () => void
  onNext: () => void
  onRead: () => void
  isLast: boolean
}

export function QuizScreen({
  level,
  question,
  questionIndex,
  totalQuestions,
  selected,
  answerText,
  submitting,
  feedback,
  pointsPerCorrect,
  speaking,
  voiceSupported,
  onSelect,
  onAnswerText,
  onSubmit,
  onNext,
  onRead,
  isLast,
}: QuizScreenProps) {
  const { t } = useI18n()
  const options = useMemo(() => question.options ?? [], [question.options])
  const isMcq = question.type === 'mcq' && options.length > 0
  const correctOptions = question.answer.split('|')
  const progress = ((questionIndex + (feedback ? 1 : 0)) / totalQuestions) * 100

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const typing =
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement

      if (typing) {
        if (event.key === 'Enter' && feedback && !event.shiftKey) {
          event.preventDefault()
          onNext()
        }
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        if (feedback) onNext()
        else onSubmit()
        return
      }

      if (!feedback && isMcq && !submitting) {
        const index = Number(event.key) - 1
        const option = options[index]
        if (Number.isInteger(index) && index >= 0 && option) {
          onSelect(option)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [feedback, isMcq, onNext, onSelect, onSubmit, options, submitting])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <motion.section
        key={question.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="card-glow overflow-hidden"
      >
        <div className="border-b border-line/60 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="neon">
                {t('play.questionCounter', {
                  current: questionIndex + 1,
                  total: totalQuestions,
                })}
              </Badge>
              <Badge tone={isMcq ? 'violet' : 'gold'}>
                {isMcq ? t('play.questionMcq') : t('play.questionPuzzle')}
              </Badge>
              <Badge tone="outline">{level.name}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRead}
              disabled={!voiceSupported}
              icon={
                speaking ? (
                  <Square className="h-3.5 w-3.5" />
                ) : (
                  <Mic className="h-3.5 w-3.5" />
                )
              }
              aria-label={speaking ? t('play.introStop') : t('play.introRead')}
            >
              <span className="hidden sm:inline">
                {speaking ? t('play.introStop') : t('play.introRead')}
              </span>
            </Button>
          </div>
          <Progress value={progress} className="mt-4 h-1.5" />
          <h1 className="mt-5 text-pretty font-display text-lg font-semibold leading-relaxed text-white sm:text-2xl">
            {question.text}
          </h1>
        </div>

        <div className="p-5 sm:p-7">
          {isMcq ? (
            <div className="grid gap-2.5" role="group" aria-label={question.text}>
              {options.map((option, index) => {
                const isSelected = selected === option
                const isCorrect = correctOptions.includes(option)
                const showCorrect = Boolean(feedback) && isCorrect
                const showWrong = Boolean(feedback) && isSelected && !isCorrect

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={Boolean(feedback) || submitting}
                    onClick={() => onSelect(option)}
                    aria-pressed={isSelected}
                    className={cn(
                      'group flex items-center gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition sm:px-4',
                      showCorrect
                        ? 'border-success/50 bg-success/10'
                        : showWrong
                          ? 'border-danger/50 bg-danger/10'
                          : isSelected
                            ? 'border-neon/60 bg-neon/10 shadow-[0_0_30px_-14px_rgba(34,211,238,0.9)]'
                            : 'border-line/80 bg-white/[0.025] hover:border-neon/35 hover:bg-white/[0.05]',
                      feedback && !showCorrect && !showWrong && 'opacity-55',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold transition',
                        showCorrect
                          ? 'border-success/40 bg-success/20 text-success'
                          : showWrong
                            ? 'border-danger/40 bg-danger/20 text-danger'
                            : isSelected
                              ? 'border-neon/50 bg-neon/20 text-neon-soft'
                              : 'border-line bg-deep/60 text-slate-500 group-hover:text-slate-300',
                      )}
                    >
                      {showCorrect ? (
                        <Check className="h-4 w-4" />
                      ) : showWrong ? (
                        <X className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-slate-200">
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                onSubmit()
              }}
            >
              <label
                htmlFor="puzzle-answer"
                className="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
              >
                {t('play.questionPuzzle')}
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="puzzle-answer"
                  value={answerText}
                  onChange={(event) => onAnswerText(event.target.value)}
                  disabled={Boolean(feedback) || submitting}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder={t('play.puzzlePlaceholder')}
                  aria-label={t('a11y.answerInput')}
                  aria-describedby="puzzle-hint"
                  className="input-base h-12 flex-1 text-base font-semibold"
                />
                <Button
                  type="submit"
                  size="lg"
                  loading={submitting}
                  disabled={Boolean(feedback) || !answerText.trim()}
                  icon={<Sparkles className="h-4 w-4" />}
                  className="sm:w-auto"
                >
                  {t('play.submitAnswer')}
                </Button>
              </div>
              <p id="puzzle-hint" className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                <CircleHelp className="h-3 w-3" />
                {t('play.puzzleHint')}
              </p>
            </form>
          )}

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mt-5 rounded-2xl border p-4',
                feedback.correct
                  ? 'border-success/30 bg-success/[0.07]'
                  : 'border-danger/30 bg-danger/[0.07]',
              )}
              role="status"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    feedback.correct
                      ? 'bg-success/15 text-success'
                      : 'bg-danger/15 text-danger',
                  )}
                >
                  {feedback.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </span>
                <p
                  className={cn(
                    'font-display text-sm font-bold',
                    feedback.correct ? 'text-success' : 'text-danger',
                  )}
                >
                  {feedback.correct ? t('play.correct') : t('play.wrong')}
                </p>
                {feedback.correct ? (
                  <Badge tone="gold" className="ml-auto">
                    <Trophy className="h-3 w-3" />
                    {t('play.score')} +{pointsPerCorrect}
                  </Badge>
                ) : (
                  <Badge tone="danger" className="ml-auto">
                    {t('play.hpLost')}
                  </Badge>
                )}
              </div>
              <div className="mt-3 flex items-start gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {t('play.explanation')}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                    {feedback.explanation}
                  </p>
                  {!feedback.correct && (
                    <p className="mt-2 text-xs font-semibold text-success">
                      {t('play.correctAnswer', { answer: feedback.correctAnswer })}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-line/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="hidden items-center gap-1.5 text-[10px] text-slate-600 sm:flex">
              <Keyboard className="h-3.5 w-3.5" />
              {t('play.keyboardHint')}
            </span>
            <Button
              onClick={feedback ? onNext : onSubmit}
              loading={submitting}
              disabled={!feedback && (isMcq ? !selected : !answerText.trim())}
              icon={feedback ? <ArrowRight className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              {feedback
                ? isLast
                  ? t('play.finishLevel')
                  : t('play.nextQuestion')
                : t('play.submitAnswer')}
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
