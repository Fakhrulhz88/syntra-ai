import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useI18n } from '../../i18n'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface RegenerateModalProps {
  open: boolean
  loading: boolean
  initialFeedback?: string
  onClose: () => void
  onConfirm: (feedback: string) => void
}

export function RegenerateModal({
  open,
  loading,
  initialFeedback = '',
  onClose,
  onConfirm,
}: RegenerateModalProps) {
  const { t } = useI18n()
  const [feedback, setFeedback] = useState(initialFeedback)

  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onClose}
      title={t('dashboard.regenerateTitle')}
      description={t('dashboard.regenerateDesc')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {t('dashboard.regenerateCancel')}
          </Button>
          <Button
            onClick={() => onConfirm(feedback.trim())}
            loading={loading}
            icon={<Sparkles className="h-4 w-4" />}
          >
            {loading ? t('dashboard.regenerating') : t('dashboard.regenerateConfirm')}
          </Button>
        </>
      }
    >
      <div>
        <label
          htmlFor="dashboard-feedback"
          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400"
        >
          {t('dashboard.feedbackLabel')}
        </label>
        <textarea
          id="dashboard-feedback"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          rows={4}
          placeholder={t('dashboard.feedbackPlaceholder')}
          className="input-base resize-none text-sm"
        />
        <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
          {t('dashboard.exportNote')}
        </p>
      </div>
    </Modal>
  )
}
