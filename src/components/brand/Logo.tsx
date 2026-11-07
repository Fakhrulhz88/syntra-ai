import { useId } from 'react'
import { cn } from '../../lib/cn'

interface LogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
}

export function Logo({ className, size = 36, showWordmark = true }: LogoProps) {
  const gradientId = useId()
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className="relative inline-flex shrink-0 items-center justify-center rounded-xl border border-neon/25 bg-[#07101f] shadow-[0_0_24px_-8px_rgba(34,211,238,0.8)]"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 64 64"
          width={size * 0.7}
          height={size * 0.7}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path
            d="M18 44 32 15l14 29M23 35h18"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="15" r="4" fill="#22d3ee" />
          <circle cx="18" cy="44" r="4" fill="#a78bfa" />
          <circle cx="46" cy="44" r="4" fill="#a78bfa" />
        </svg>
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-bold tracking-tight text-white">
            Syntra<span className="text-neon">-AI</span>
          </span>
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-mist/70">
            Neural Curriculum
          </span>
        </span>
      )}
    </span>
  )
}
