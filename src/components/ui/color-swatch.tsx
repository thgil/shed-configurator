'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ColorSwatchProps {
  color: string
  name: string
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function ColorSwatch({
  color,
  name,
  selected = false,
  onClick,
  size = 'md',
}: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-full border-2 transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
        selected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-300 hover:border-stone-400',
        {
          'h-8 w-8': size === 'sm',
          'h-10 w-10': size === 'md',
          'h-12 w-12': size === 'lg',
        }
      )}
      style={{ backgroundColor: color }}
      title={name}
      aria-label={`Select ${name}`}
      aria-pressed={selected}
    >
      {selected && (
        <Check
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'text-white drop-shadow-md',
            {
              'h-4 w-4': size === 'sm',
              'h-5 w-5': size === 'md',
              'h-6 w-6': size === 'lg',
            }
          )}
        />
      )}
    </button>
  )
}
