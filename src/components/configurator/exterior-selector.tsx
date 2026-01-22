'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { Card, CardContent } from '@/components/ui/card'
import { ColorSwatch } from '@/components/ui/color-swatch'
import { formatPriceDecimal, cn } from '@/lib/utils'

export function ExteriorSelector() {
  const {
    sidingOptions,
    shingleOptions,
    selectedSidingOption,
    selectedSidingColor,
    selectedShingleOption,
    selectedShingleColor,
    selectSidingOption,
    selectSidingColor,
    selectShingleOption,
    selectShingleColor,
  } = useConfiguratorStore()

  return (
    <div className="space-y-6">
      {/* Siding Material */}
      <div>
        <h3 className="text-sm font-medium text-stone-700 mb-3">Siding Material</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sidingOptions.map((option) => {
            const isSelected = selectedSidingOption?.id === option.id
            return (
              <button
                key={option.id}
                onClick={() => selectSidingOption(option)}
                className="text-left"
              >
                <Card className={cn(
                  "h-full transition-all",
                  isSelected && "ring-2 ring-amber-500 border-amber-500"
                )}>
                  <CardContent className="p-4">
                    <div className="font-semibold text-stone-900">{option.name}</div>
                    <div className="text-sm text-stone-500">{option.material}</div>
                    {option.priceModifier > 0 && (
                      <div className="mt-1 text-sm font-medium text-amber-700">
                        +{formatPriceDecimal(option.priceModifier)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>
      </div>

      {/* Siding Color */}
      {selectedSidingOption && (
        <div>
          <h3 className="text-sm font-medium text-stone-700 mb-3">Siding Color</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSidingOption.colors.map((color) => (
              <ColorSwatch
                key={color.id}
                color={color.hexCode}
                name={color.name}
                selected={selectedSidingColor?.id === color.id}
                onClick={() => selectSidingColor(color)}
              />
            ))}
          </div>
          {selectedSidingColor && (
            <p className="mt-2 text-sm text-stone-500">{selectedSidingColor.name}</p>
          )}
        </div>
      )}

      {/* Shingle Type */}
      <div>
        <h3 className="text-sm font-medium text-stone-700 mb-3">Roof Shingles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shingleOptions.map((option) => {
            const isSelected = selectedShingleOption?.id === option.id
            return (
              <button
                key={option.id}
                onClick={() => selectShingleOption(option)}
                className="text-left"
              >
                <Card className={cn(
                  "h-full transition-all",
                  isSelected && "ring-2 ring-amber-500 border-amber-500"
                )}>
                  <CardContent className="p-4">
                    <div className="font-semibold text-stone-900">{option.name}</div>
                    {option.priceModifier > 0 && (
                      <div className="mt-1 text-sm font-medium text-amber-700">
                        +{formatPriceDecimal(option.priceModifier)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>
      </div>

      {/* Shingle Color */}
      {selectedShingleOption && (
        <div>
          <h3 className="text-sm font-medium text-stone-700 mb-3">Shingle Color</h3>
          <div className="flex flex-wrap gap-2">
            {selectedShingleOption.colors.map((color) => (
              <ColorSwatch
                key={color.id}
                color={color.hexCode}
                name={color.name}
                selected={selectedShingleColor?.id === color.id}
                onClick={() => selectShingleColor(color)}
              />
            ))}
          </div>
          {selectedShingleColor && (
            <p className="mt-2 text-sm text-stone-500">{selectedShingleColor.name}</p>
          )}
        </div>
      )}
    </div>
  )
}
