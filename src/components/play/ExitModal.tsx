import { DoorOpen, LogOut } from 'lucide-react'
import { useI18n } from '../../i18n'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface ExitModalProps {
  open: boolean
  onStay: () => void
  onLeave: () => void
}

export function ExitModal({ open, onStay, onLeave }: ExitModalProps) {
  const { t } = useI18n()
  return (
    <Modal
      open={open}
      onClose={onStay}
      title={t('play.exitTitle')}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onStay}
            icon={<DoorOpen className="h-4 w-4" />}
          >
            {t('play.exitStay')}
          </Button>
          <Button
            variant="danger"
            onClick={onLeave}
            icon={<LogOut className="h-4 w-4" />}
          >
            {t('play.exitLeave')}
          </Button>
        </>
      }
    >
      <div className="rounded-2xl border border-danger/20 bg-danger/[0.06] px-4 py-3 text-xs leading-relaxed text-danger/90">
        {t('play.exitDesc')}
      </div>
    </Modal>
  )
}
