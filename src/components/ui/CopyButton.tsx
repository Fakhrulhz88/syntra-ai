import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useI18n } from '../../i18n'
import { toast } from '../../store/toastStore'
import { Button, type ButtonSize, type ButtonVariant } from './Button'

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

interface CopyButtonProps {
  value: string
  label?: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  iconOnly?: boolean
}

export function CopyButton({
  value,
  label,
  variant = 'secondary',
  size = 'md',
  className,
  iconOnly = false,
}: CopyButtonProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await copyText(value)
      setCopied(true)
      toast(t('common.copied'))
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast(t('pipeline.copyError'), 'error')
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? 'icon' : size}
      className={className}
      onClick={handleCopy}
      icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      aria-label={label ?? t('a11y.copy')}
      title={label ?? t('a11y.copy')}
    >
      {iconOnly ? <span className="sr-only">{label ?? t('a11y.copy')}</span> : label ?? t('common.copy')}
    </Button>
  )
}
