'use client'

import { useState } from 'react'
import { Html } from '@react-three/drei'
import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'
import type { RoofStyle, ShedModel } from '@/types/configurator'

interface RoofPickerProps {
  heightFeet: number
}

const roofStyleLabels: Record<RoofStyle, string> = {
  GABLE: 'Gable',
  BARN: 'Barn',
  LEAN_TO: 'Lean-To',
}

const roofStyleDescriptions: Record<RoofStyle, string> = {
  GABLE: 'Classic peaked roof',
  BARN: 'Gambrel style roof',
  LEAN_TO: 'Single slope roof',
}

export function RoofPicker({ heightFeet }: RoofPickerProps) {
  const { selectedModel, models, selectModel } = useConfiguratorStore()
  const [isOpen, setIsOpen] = useState(false)

  const currentRoofStyle = selectedModel?.roofStyle ?? 'GABLE'

  // Group models by roof style for easy switching
  const modelsByRoofStyle = models.reduce((acc, model) => {
    acc[model.roofStyle] = model
    return acc
  }, {} as Record<RoofStyle, ShedModel>)

  const handleSelectRoofStyle = (roofStyle: RoofStyle) => {
    const model = modelsByRoofStyle[roofStyle]
    if (model) {
      selectModel(model)
    }
    setIsOpen(false)
  }

  const availableStyles = Object.keys(modelsByRoofStyle) as RoofStyle[]

  return (
    <Html
      position={[0, heightFeet + 3, 0]}
      center
      distanceFactor={15}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative">
        {/* Current selection button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-stone-200 transition-all",
            "hover:bg-stone-50 text-sm font-medium text-stone-700",
            isOpen && "ring-2 ring-amber-500"
          )}
        >
          <span>{roofStyleLabels[currentRoofStyle]}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-stone-400 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-stone-200 overflow-hidden z-50">
            <div className="p-1">
              {availableStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => handleSelectRoofStyle(style)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left",
                    currentRoofStyle === style
                      ? "bg-amber-100 text-amber-800"
                      : "hover:bg-stone-100 text-stone-700"
                  )}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {roofStyleLabels[style]}
                    </div>
                    <div className="text-xs text-stone-500">
                      {roofStyleDescriptions[style]}
                    </div>
                  </div>
                  {currentRoofStyle === style && (
                    <Check className="w-4 h-4 text-amber-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Html>
  )
}
