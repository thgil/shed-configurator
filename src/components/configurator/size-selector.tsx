'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { formatPriceDecimal } from '@/lib/utils'
import { Check, Maximize2 } from 'lucide-react'

export function SizeSelector() {
  const { sizes, selectedSize, selectSize } = useConfiguratorStore()

  // Calculate relative scale for visual representation
  const maxArea = Math.max(...sizes.map(s => s.widthFeet * s.depthFeet))

  return (
    <div className="space-y-6">
      {/* Size Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {sizes.map((size) => {
          const isSelected = selectedSize?.id === size.id
          const area = size.widthFeet * size.depthFeet
          const relativeScale = (area / maxArea) * 100

          return (
            <button
              key={size.id}
              onClick={() => selectSize(size)}
              className={cn(
                "relative p-4 rounded-xl transition-all duration-200 text-left",
                "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                isSelected
                  ? "bg-amber-600 text-white shadow-lg ring-2 ring-amber-500"
                  : "bg-white text-stone-900 border border-stone-200 hover:border-amber-300 hover:shadow-md"
              )}
            >
              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-amber-600" />
                </div>
              )}

              {/* Size Visual */}
              <div className="mb-3 flex items-end justify-center h-16">
                <div
                  className={cn(
                    "rounded transition-all",
                    isSelected ? "bg-white/30" : "bg-amber-100"
                  )}
                  style={{
                    width: `${Math.max(40, relativeScale * 0.8)}%`,
                    height: `${Math.max(30, relativeScale * 0.6)}%`,
                    minWidth: '40px',
                    minHeight: '30px',
                  }}
                />
              </div>

              {/* Size Label */}
              <div className="text-center">
                <div className="text-xl font-bold">{size.displayName}</div>
                <div className={cn(
                  "text-sm mt-1",
                  isSelected ? "text-amber-100" : "text-stone-500"
                )}>
                  {area} sq ft
                </div>
              </div>

              {/* Price */}
              <div className={cn(
                "text-center mt-3 pt-3 border-t",
                isSelected ? "border-amber-500/30" : "border-stone-200"
              )}>
                {size.priceModifier > 0 ? (
                  <span className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-amber-100" : "text-amber-600"
                  )}>
                    +{formatPriceDecimal(size.priceModifier)}
                  </span>
                ) : (
                  <span className={cn(
                    "text-sm",
                    isSelected ? "text-amber-100" : "text-stone-400"
                  )}>
                    Base price
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Size Details */}
      {selectedSize && (
        <div className="bg-stone-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Maximize2 className="w-5 h-5 text-stone-600" />
            <h4 className="font-semibold text-stone-900">Size Details</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-stone-900">{selectedSize.widthFeet}'</div>
              <div className="text-sm text-stone-500">Width</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">{selectedSize.depthFeet}'</div>
              <div className="text-sm text-stone-500">Depth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">{selectedSize.heightFeet}'</div>
              <div className="text-sm text-stone-500">Height</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between text-sm">
            <span className="text-stone-600">Max doors: <strong>{selectedSize.maxDoors}</strong></span>
            <span className="text-stone-600">Max windows: <strong>{selectedSize.maxWindows}</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}
