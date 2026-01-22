'use client'

import Image from 'next/image'
import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { formatPriceDecimal } from '@/lib/utils'
import { Check, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Thumbnail images for each style
const STYLE_THUMBNAILS = {
  GABLE: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  BARN: 'https://images.unsplash.com/photo-1568977953494-8244e64a40a2?w=600&q=80',
  LEAN_TO: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&q=80',
} as const

const STYLE_DESCRIPTIONS = {
  GABLE: 'Traditional design with excellent headroom and water runoff',
  BARN: 'Classic gambrel roof with extra loft storage space',
  LEAN_TO: 'Modern single-slope design, perfect against structures',
} as const

export function StyleSelector() {
  const { models, selectedModel, selectModel } = useConfiguratorStore()

  return (
    <div className="space-y-4">
      {models.map((model, index) => {
        const isSelected = selectedModel?.id === model.id
        const thumbnail = STYLE_THUMBNAILS[model.roofStyle]
        const description = STYLE_DESCRIPTIONS[model.roofStyle]
        const isPopular = index === 0

        return (
          <button
            key={model.id}
            onClick={() => selectModel(model)}
            className={cn(
              "relative w-full rounded-2xl overflow-hidden transition-all duration-300 text-left",
              "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
              isSelected
                ? "ring-2 ring-amber-500 shadow-xl"
                : "hover:shadow-lg border border-stone-200 hover:border-stone-300"
            )}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
                <Image
                  src={thumbnail}
                  alt={model.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 sm:bg-gradient-to-t sm:from-transparent sm:to-transparent" />

                {/* Popular Badge */}
                {isPopular && (
                  <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-500">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                  </Badge>
                )}

                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={cn(
                "flex-1 p-5 transition-colors",
                isSelected ? "bg-amber-50" : "bg-white"
              )}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      {model.name}
                    </h3>
                    <p className="text-stone-600 text-sm mt-1">
                      {description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-stone-500 uppercase tracking-wide">From</div>
                    <div className="text-xl font-bold text-amber-600">
                      {formatPriceDecimal(model.basePrice)}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                    {model.roofStyle === 'GABLE' && 'Classic Look'}
                    {model.roofStyle === 'BARN' && 'Extra Storage'}
                    {model.roofStyle === 'LEAN_TO' && 'Space Saver'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                    All Sizes Available
                  </span>
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
