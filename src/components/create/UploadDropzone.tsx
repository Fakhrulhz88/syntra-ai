import { useRef, useState, type DragEvent } from 'react'
import { FileText, Sparkles, UploadCloud, X } from 'lucide-react'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { formatFileSize } from '../../lib/format'
import { Progress } from '../ui/Progress'
import { SAMPLE_FILE } from '../../data/seeded'

interface UploadDropzoneProps {
  fileName?: string
  fileSize?: number
  sampleSelected: boolean
  uploading: boolean
  progress: number
  onSelectFile: (file: File) => void
  onSelectSample: () => void
  onClear: () => void
}

export function UploadDropzone({
  fileName,
  fileSize,
  sampleSelected,
  uploading,
  progress,
  onSelectFile,
  onSelectSample,
  onClear,
}: UploadDropzoneProps) {
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files.item(0)
    if (file) onSelectFile(file)
  }

  const hasSource = Boolean(fileName) || sampleSelected

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t('create.uploadTitle')}
        </label>
        {hasSource && (
          <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/[0.07] px-2 py-0.5 text-[10px] font-semibold text-success">
            <span className="h-1 w-1 rounded-full bg-success" />
            {t('create.uploaded')}
          </span>
        )}
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative overflow-hidden rounded-2xl border-2 border-dashed p-5 transition sm:p-6',
          dragging
            ? 'border-neon/70 bg-neon/[0.08]'
            : hasSource
              ? 'border-success/25 bg-success/[0.03]'
              : 'border-line bg-deep/40 hover:border-white/20',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.item(0)
            if (file) onSelectFile(file)
            event.target.value = ''
          }}
        />

        {fileName ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-danger/20 bg-danger/[0.07] text-danger">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{fileName}</p>
              <p className="mt-0.5 text-[11px] text-mist">
                {fileSize ? formatFileSize(fileSize) : ''} · PDF
              </p>
              {uploading && (
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={progress} className="h-1.5 flex-1" />
                  <span className="text-[10px] tabular-nums text-neon-soft">{progress}%</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg p-1.5 text-mist transition hover:bg-white/10 hover:text-white"
              aria-label={t('create.uploadRemove')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : sampleSelected ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon-soft">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                {t('create.uploadSampleSelected')}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-mist">
                {t('create.uploadSampleDesc')}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {SAMPLE_FILE.filename} · {formatFileSize(SAMPLE_FILE.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg p-1.5 text-mist transition hover:bg-white/10 hover:text-white"
              aria-label={t('create.uploadRemove')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neon/20 bg-neon/[0.06] text-neon-soft">
              <UploadCloud className="h-6 w-6" />
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-3 text-sm font-semibold text-white transition hover:text-neon-soft"
            >
              {t('create.uploadDrop')}
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-1 text-xs text-neon-soft/80 underline-offset-4 hover:underline"
            >
              {t('create.uploadBrowse')}
            </button>
            <p className="mt-2 text-[10px] text-slate-500">{t('create.uploadAccept')}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onSelectSample}
        className={cn(
          'mt-3 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
          sampleSelected
            ? 'border-neon/40 bg-neon/[0.06]'
            : 'border-white/[0.07] bg-white/[0.02] hover:border-neon/25 hover:bg-white/[0.04]',
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-slate-100">
            {t('create.uploadSample')}
          </span>
          <span className="mt-0.5 block truncate text-[10px] text-slate-500">
            {t('create.uploadSampleDesc')}
          </span>
        </span>
        <span className="text-[10px] font-semibold text-neon-soft">
          {sampleSelected ? t('create.uploadSampleSelected') : t('create.uploadSampleBtn')}
        </span>
      </button>
    </div>
  )
}
