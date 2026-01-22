'use client'

import Image from 'next/image'
import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// High-quality shed images from Unsplash
const SHED_IMAGES = {
  GABLE: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  BARN: 'https://images.unsplash.com/photo-1568977953494-8244e64a40a2?w=800&q=80',
  LEAN_TO: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&q=80',
} as const

type ViewType = 'front' | 'side' | 'interior'

export function ShedPreview() {
  const { selectedModel, selectedSize, selectedSidingColor } = useConfiguratorStore()
  const [activeView, setActiveView] = useState<ViewType>('front')
  const [imageLoaded, setImageLoaded] = useState(false)

  const roofStyle = selectedModel?.roofStyle ?? 'GABLE'
  const imageUrl = SHED_IMAGES[roofStyle]

  // Calculate hue rotation based on selected color
  const getColorFilter = () => {
    if (!selectedSidingColor) return ''

    // Convert hex to hue rotation (simplified approach)
    const hex = selectedSidingColor.hexCode
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    // Calculate approximate hue
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0

    if (max !== min) {
      const d = max - min
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
      else if (max === g) h = ((b - r) / d + 2) * 60
      else h = ((r - g) / d + 4) * 60
    }

    return `hue-rotate(${h}deg) saturate(1.2)`
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Main Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-sky-100 to-sky-50">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse" />
        )}

        {/* Shed Image */}
        <div
          className="relative w-full h-full transition-all duration-500"
          style={{ filter: getColorFilter() }}
        >
          <Image
            src={imageUrl}
            alt={`${selectedModel?.name ?? 'Classic'} shed`}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            priority
            unoptimized // For external URLs
          />
        </div>

        {/* Size Badge */}
        {selectedSize && (
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <span className="text-sm font-semibold text-stone-800">
              {selectedSize.displayName}
            </span>
          </div>
        )}

        {/* Style Badge */}
        {selectedModel && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full shadow-md">
            <span className="text-sm font-medium">
              {selectedModel.name}
            </span>
          </div>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-2 p-4 bg-stone-50 border-t border-stone-100">
        {(['front', 'side', 'interior'] as ViewType[]).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full transition-all",
              activeView === view
                ? "bg-stone-900 text-white shadow-md"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            )}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}
