import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'
import { cn } from '../../lib/cn'

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const tones = {
  success: 'border-success/30 bg-[#071c18]/95 text-success',
  error: 'border-danger/30 bg-[#1f0b12]/95 text-danger',
  info: 'border-neon/30 bg-[#071622]/95 text-neon-soft',
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-2 sm:bottom-6">
      <AnimatePresence initial={false}>
        {toasts.map((item) => {
          const Icon = icons[item.tone]
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl',
                tones[item.tone],
              )}
              role="status"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-slate-100">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-md p-0.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
