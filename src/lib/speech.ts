import type { Language } from '../types'
import { readString, STORAGE_KEYS, writeString } from './storage'

let voiceEnabled = readString(STORAGE_KEYS.voice, 'on') !== 'off'

export function isVoiceEnabled(): boolean {
  return voiceEnabled
}

export function setVoiceEnabled(enabled: boolean): void {
  voiceEnabled = enabled
  writeString(STORAGE_KEYS.voice, enabled ? 'on' : 'off')
  if (!enabled) stopSpeaking()
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function stopSpeaking(): void {
  if (!speechSupported()) return
  window.speechSynthesis.cancel()
}

export function speak(
  text: string,
  lang: Language,
  onEnd?: () => void,
): boolean {
  if (!voiceEnabled || !speechSupported() || !text.trim()) return false
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === 'bm' ? 'ms-MY' : 'en-US'
  utterance.rate = 0.96
  utterance.pitch = 1.02
  utterance.volume = 1
  if (onEnd) {
    utterance.onend = () => onEnd()
    utterance.onerror = () => onEnd()
  }

  const prefix = lang === 'bm' ? 'ms' : 'en'
  const voices = window.speechSynthesis.getVoices()
  const match = voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix))
  if (match) utterance.voice = match

  window.speechSynthesis.speak(utterance)
  return true
}
