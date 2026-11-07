import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  School,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { useI18n } from '../i18n'
import { api } from '../api'
import type { Difficulty, GameCategory, Language } from '../types'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { SegmentedControl, type SegmentOption } from '../components/create/SegmentedControl'
import { UploadDropzone } from '../components/create/UploadDropzone'
import { CreateSidebar } from '../components/create/CreateSidebar'
import { toast } from '../store/toastStore'

export function CreatePage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [category, setCategory] = useState<GameCategory>('school')
  const [subject, setSubject] = useState('sejarah')
  const [language, setLanguage] = useState<Language>('bm')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [levels, setLevels] = useState('3')

  const [fileName, setFileName] = useState<string>()
  const [fileSize, setFileSize] = useState<number>()
  const [fileId, setFileId] = useState<string>()
  const [sampleSelected, setSampleSelected] = useState(
    () => searchParams.get('sample') === '1',
  )
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string>()

  const uploadToken = useRef(0)

  const resetSource = () => {
    uploadToken.current += 1
    setFileName(undefined)
    setFileSize(undefined)
    setFileId(undefined)
    setSampleSelected(false)
    setUploading(false)
    setProgress(0)
  }

  const handleSelectSample = () => {
    resetSource()
    setSampleSelected(true)
    setError(undefined)
  }

  const handleSelectFile = async (file: File) => {
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      toast(t('create.pdfOnly'), 'error')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      toast(t('create.tooLarge'), 'error')
      return
    }

    const token = uploadToken.current + 1
    uploadToken.current = token
    setSampleSelected(false)
    setFileName(file.name)
    setFileSize(file.size)
    setFileId(undefined)
    setUploading(true)
    setProgress(0)
    setError(undefined)

    try {
      const result = await api.uploadPdf(file, (percent) => {
        if (uploadToken.current === token) setProgress(percent)
      })
      if (uploadToken.current === token) {
        setFileId(result.file_id)
        setProgress(100)
      }
    } catch {
      if (uploadToken.current === token) {
        setUploading(false)
        setFileName(undefined)
        setFileSize(undefined)
        setError(t('create.uploadError'))
        toast(t('create.uploadError'), 'error')
      }
      return
    }
    if (uploadToken.current === token) setUploading(false)
  }

  const handleCategory = (next: GameCategory) => {
    setCategory(next)
    setSubject(next === 'school' ? 'sejarah' : 'cybersecurity')
  }

  const handleGenerate = async () => {
    if (!sampleSelected && !fileId) {
      setError(t('create.needSource'))
      toast(t('create.needSource'), 'error')
      return
    }
    if (uploading) {
      toast(t('create.uploading'), 'info')
      return
    }
    setStarting(true)
    setError(undefined)
    try {
      const start = await api.startPipeline({
        sample: sampleSelected,
        file_id: fileId,
        category,
        subject,
        language,
        difficulty,
        levels: Number(levels),
      })
      navigate(`/pipeline/${start.pipeline_id}`)
    } catch {
      setStarting(false)
      setError(t('create.errorTitle'))
      toast(t('create.errorTitle'), 'error')
    }
  }

  const categoryOptions: SegmentOption<GameCategory>[] = [
    {
      value: 'school',
      label: t('create.categorySchool'),
      hint: t('create.categorySchoolDesc'),
      icon: <School className="h-3.5 w-3.5" />,
    },
    {
      value: 'higher-ed',
      label: t('create.categoryIpt'),
      hint: t('create.categoryIptDesc'),
      icon: <GraduationCap className="h-3.5 w-3.5" />,
    },
  ]

  const languageOptions: SegmentOption<Language>[] = [
    { value: 'bm', label: t('common.bm'), hint: t('common.bmShort') },
    { value: 'en', label: t('common.en'), hint: t('common.enShort') },
  ]

  const difficultyOptions: SegmentOption<Difficulty>[] = [
    { value: 'easy', label: t('common.easy') },
    { value: 'medium', label: t('common.medium') },
    { value: 'hard', label: t('common.hard') },
  ]

  const levelOptions: SegmentOption<string>[] = [
    { value: '2', label: `2 ${t('common.levels')}`, hint: t('common.questionsCount', { count: 10 }) },
    { value: '3', label: `3 ${t('common.levels')}`, hint: t('common.questionsCount', { count: 15 }) },
  ]

  return (
    <section className="container-page py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
      >
        <div>
          <span className="eyebrow">
            <Sparkles className="h-3 w-3" />
            {t('create.eyebrow')}
          </span>
          <h1 className="mt-4 max-w-2xl text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            {t('create.title')}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
            {t('create.subtitle')}
          </p>
        </div>
        <Badge tone="outline" className="w-fit px-3 py-2">
          {t('create.stepLabel', { current: 1 })}
        </Badge>
      </motion.div>

      <div className="grid items-start gap-5 lg:grid-cols-[1.45fr_0.75fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="card card-glow p-5 sm:p-7"
        >
          <UploadDropzone
            fileName={fileName}
            fileSize={fileSize}
            sampleSelected={sampleSelected}
            uploading={uploading}
            progress={progress}
            onSelectFile={(file) => {
              void handleSelectFile(file)
            }}
            onSelectSample={handleSelectSample}
            onClear={resetSource}
          />

          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              {t('create.formTitle')}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t('create.category')}
              </p>
              <SegmentedControl
                label={t('create.category')}
                value={category}
                options={categoryOptions}
                onChange={handleCategory}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  {t('create.subject')}
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="input-base appearance-none pr-10"
                  >
                    <option value={category === 'school' ? 'sejarah' : 'cybersecurity'}>
                      {category === 'school'
                        ? t('create.subjectSejarah')
                        : t('create.subjectCyber')}
                    </option>
                    <option value="other" disabled>
                      {t('create.subjectOther')} · {t('create.subjectSoon')}
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('create.language')}
                </p>
                <SegmentedControl
                  label={t('create.language')}
                  value={language}
                  options={languageOptions}
                  onChange={setLanguage}
                />
                <p className="mt-1.5 text-[10px] text-slate-500">{t('create.languageHint')}</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('create.difficulty')}
                </p>
                <SegmentedControl
                  label={t('create.difficulty')}
                  value={difficulty}
                  options={difficultyOptions}
                  onChange={setDifficulty}
                  columns={3}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('create.levels')}
                </p>
                <SegmentedControl
                  label={t('create.levels')}
                  value={levels}
                  options={levelOptions}
                  onChange={setLevels}
                />
                <p className="mt-1.5 text-[10px] text-slate-500">{t('create.levelsHint')}</p>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger/[0.07] px-3.5 py-3 text-xs text-danger"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-7 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-[10px] leading-relaxed text-slate-500">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
              <p className="max-w-xs">{t('create.disclaimer')}</p>
            </div>
            <Button
              size="lg"
              onClick={() => {
                void handleGenerate()
              }}
              loading={starting}
              disabled={starting || uploading}
              icon={<Wand2 className="h-4 w-4" />}
              className="shrink-0"
            >
              {starting ? t('create.starting') : t('create.generate')}
              {!starting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <CreateSidebar />
        </motion.div>
      </div>
    </section>
  )
}
