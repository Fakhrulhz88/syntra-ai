import { useId } from 'react'
import { cn } from '../../lib/cn'

interface SongketPatternProps {
  className?: string
  opacity?: number
}

/** Songket-inspired geometric motif, drawn procedurally (no image assets). */
export function SongketPattern({ className, opacity = 0.18 }: SongketPatternProps) {
  const patternId = useId()
  return (
    <svg
      aria-hidden="true"
      className={cn('h-full w-full text-gold', className)}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={patternId}
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          <path
            d="M24 3 45 24 24 45 3 24Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <path
            d="M24 12 36 24 24 36 12 24Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.55"
            opacity="0.7"
          />
          <circle cx="24" cy="24" r="1.8" fill="currentColor" />
          <path d="M0 24h8M40 24h8M24 0v8M24 40v8" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}

export function SongketBand({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-10 overflow-hidden', className)} aria-hidden="true">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <SongketPattern opacity={0.22} />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </div>
  )
}
