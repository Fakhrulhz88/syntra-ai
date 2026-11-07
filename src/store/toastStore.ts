import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastState {
  toasts: ToastItem[]
  push: (message: string, tone?: ToastTone) => void
  dismiss: (id: number) => void
}

let counter = 0

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (message, tone = 'success') => {
    counter += 1
    const id = counter
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }))
    window.setTimeout(() => get().dismiss(id), 3600)
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }))
  },
}))

export function toast(message: string, tone: ToastTone = 'success'): void {
  useToastStore.getState().push(message, tone)
}
