import { QRCodeSVG } from 'qrcode.react'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'

interface QRCardProps {
  value: string
  size?: number
  className?: string
  caption?: string
}

export function QRCard({ value, size = 132, className, caption }: QRCardProps) {
  const { t } = useI18n()
  return (
    <div className={cn('flex flex-col items-center gap-2.5', className)}>
      <div className="rounded-2xl bg-white p-3 shadow-[0_0_30px_-10px_rgba(34,211,238,0.6)]">
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#050714"
          marginSize={1}
          title={t('a11y.qr')}
        />
      </div>
      <p className="text-center text-[11px] text-mist">{caption ?? t('pipeline.shareHint')}</p>
    </div>
  )
}
