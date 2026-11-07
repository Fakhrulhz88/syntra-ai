import type { Language } from '../types'

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (minutes === 0) return `${rest}s`
  return `${minutes}m ${String(rest).padStart(2, '0')}s`
}

export function formatTimer(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

export function formatDate(iso: string, lang: Language): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(lang === 'bm' ? 'ms-MY' : 'en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatTime(iso: string, lang: Language): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(lang === 'bm' ? 'ms-MY' : 'en-MY', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export function relativeTime(iso: string, lang: Language): string {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  if (Number.isNaN(date.getTime())) return ''
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return lang === 'bm' ? 'Baru sahaja' : 'Just now'
  if (minutes < 60) return lang === 'bm' ? `${minutes} min lalu` : `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return lang === 'bm' ? `${hours} jam lalu` : `${hours} h ago`
  const days = Math.floor(hours / 24)
  return lang === 'bm' ? `${days} hari lalu` : `${days} d ago`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatClockTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export function padNumber(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

export function shareUrl(path: string): string {
  return `${window.location.origin}${path}`
}
