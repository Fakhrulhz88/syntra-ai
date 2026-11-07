import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'gold'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const base =
  'inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-neon to-[#38bdf8] text-abyss shadow-[0_10px_35px_-12px_rgba(34,211,238,0.9)] hover:from-neon-soft hover:to-neon hover:shadow-[0_14px_45px_-12px_rgba(34,211,238,1)]',
  secondary:
    'border border-white/10 bg-white/[0.06] text-slate-100 hover:border-white/20 hover:bg-white/[0.1]',
  outline:
    'border border-neon/40 bg-neon/[0.04] text-neon-soft hover:border-neon/70 hover:bg-neon/[0.1]',
  ghost: 'text-mist hover:bg-white/[0.06] hover:text-white',
  danger:
    'border border-danger/30 bg-danger/10 text-danger hover:border-danger/50 hover:bg-danger/20',
  gold:
    'bg-gradient-to-r from-gold to-[#fbbf24] text-[#241a02] shadow-[0_10px_35px_-12px_rgba(245,196,81,0.8)] hover:brightness-110',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
  icon: 'h-10 w-10 p-0',
}

function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={buttonStyles(variant, size, className)} {...props}>
      {icon}
      {children}
    </Link>
  )
}
