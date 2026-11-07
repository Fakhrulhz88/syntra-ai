import { readString, STORAGE_KEYS, writeString } from '../lib/storage'

let audioContext: AudioContext | null = null
let soundEnabled = readString(STORAGE_KEYS.sound, 'on') !== 'off'

function getContext(): AudioContext | null {
  if (!soundEnabled || typeof window === 'undefined') return null
  if (!audioContext) {
    const AudioCtor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtor) return null
    audioContext = new AudioCtor()
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }
  return audioContext
}

function tone(
  frequency: number,
  duration: number,
  options: {
    type?: OscillatorType
    gain?: number
    delay?: number
    slideTo?: number
  } = {},
): void {
  const context = getContext()
  if (!context) return
  const { type = 'sine', gain = 0.06, delay = 0, slideTo } = options
  const start = context.currentTime + delay
  const oscillator = context.createOscillator()
  const volume = context.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  if (slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(30, slideTo),
      start + duration,
    )
  }
  volume.gain.setValueAtTime(0.0001, start)
  volume.gain.exponentialRampToValueAtTime(gain, start + 0.012)
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(volume)
  volume.connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.03)
}

export function isSoundEnabled(): boolean {
  return soundEnabled
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled
  writeString(STORAGE_KEYS.sound, enabled ? 'on' : 'off')
}

export function playClick(): void {
  tone(520, 0.06, { type: 'sine', gain: 0.035 })
}

export function playCorrect(): void {
  tone(660, 0.12, { type: 'triangle', gain: 0.06 })
  tone(880, 0.16, { type: 'triangle', gain: 0.05, delay: 0.09 })
}

export function playWrong(): void {
  tone(220, 0.18, { type: 'sawtooth', gain: 0.045, slideTo: 130 })
}

export function playLevelUp(): void {
  const notes = [523, 659, 784, 1047]
  notes.forEach((note, index) => {
    tone(note, 0.22, { type: 'triangle', gain: 0.05, delay: index * 0.1 })
  })
}

export function playVictory(): void {
  const notes = [523, 659, 784, 1047, 1319]
  notes.forEach((note, index) => {
    tone(note, 0.3, { type: 'triangle', gain: 0.05, delay: index * 0.11 })
    tone(note / 2, 0.3, { type: 'sine', gain: 0.025, delay: index * 0.11 })
  })
}
