'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { Shed3DView } from './3d/shed-3d-view'
import { PriceSummary } from './price-summary'
import { cn } from '@/lib/utils'
import { Check, Paintbrush, Home } from 'lucide-react'

// Helper to determine if a color is light (for contrast)
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

// Inline color palette component
function ColorPalette({
  colors,
  selectedColorId,
  onSelect,
  size = 'normal',
}: {
  colors: Array<{ id: string; name: string; hexCode: string }>
  selectedColorId: string | undefined
  onSelect: (color: any) => void
  size?: 'small' | 'normal'
}) {
  return (
    <div className={cn(
      "flex flex-wrap gap-2",
      size === 'small' && "gap-1.5"
    )}>
      {colors.map((color) => {
        const isSelected = selectedColorId === color.id
        const sizeClasses = size === 'small' ? 'w-8 h-8' : 'w-10 h-10'

        return (
          <button
            key={color.id}
            onClick={() => onSelect(color)}
            className={cn(
              "group relative rounded-full transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
              sizeClasses,
              isSelected && "ring-2 ring-amber-500 ring-offset-2 scale-110",
              !isSelected && "hover:scale-105",
              isLightColor(color.hexCode) && "border-2 border-stone-200"
            )}
            style={{ backgroundColor: color.hexCode }}
            title={color.name}
          >
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className={cn(
                  "w-4 h-4",
                  isLightColor(color.hexCode) ? "text-stone-800" : "text-white"
                )} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Configuration summary card
function ConfigSummary() {
  const {
    selectedModel,
    selectedSize,
    selectedSidingColor,
    selectedShingleColor,
    doors,
    windows,
  } = useConfiguratorStore()

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <h3 className="font-semibold text-stone-900 mb-4">Configuration Summary</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-stone-500">Style</span>
          <p className="font-medium text-stone-900">{selectedModel?.name}</p>
        </div>
        <div>
          <span className="text-stone-500">Size</span>
          <p className="font-medium text-stone-900">{selectedSize?.displayName}</p>
        </div>
        <div>
          <span className="text-stone-500">Siding</span>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-stone-300"
              style={{ backgroundColor: selectedSidingColor?.hexCode }}
            />
            <p className="font-medium text-stone-900">{selectedSidingColor?.name}</p>
          </div>
        </div>
        <div>
          <span className="text-stone-500">Roof</span>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-stone-300"
              style={{ backgroundColor: selectedShingleColor?.hexCode }}
            />
            <p className="font-medium text-stone-900">{selectedShingleColor?.name}</p>
          </div>
        </div>
        <div>
          <span className="text-stone-500">Doors</span>
          <p className="font-medium text-stone-900">{doors.length} door{doors.length !== 1 ? 's' : ''}</p>
        </div>
        <div>
          <span className="text-stone-500">Windows</span>
          <p className="font-medium text-stone-900">{windows.length} window{windows.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  )
}

export function CustomizePhase() {
  const {
    selectedSidingOption,
    selectedSidingColor,
    selectedShingleOption,
    selectedShingleColor,
    selectSidingColor,
    selectShingleColor,
  } = useConfiguratorStore()

  const sidingColors = selectedSidingOption?.colors ?? []
  const shingleColors = selectedShingleOption?.colors ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Customize Your Shed</h2>
        <p className="text-stone-600 mt-1">
          See your design in 3D and choose your colors.
        </p>
      </div>

      {/* Main content grid - 3D view left, controls right */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* 3D View - takes up more space */}
        <div className="lg:col-span-3">
          <Shed3DView />
        </div>

        {/* Color controls and summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Siding Color */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Paintbrush className="w-5 h-5 text-stone-400" />
              <h3 className="font-semibold text-stone-900">Siding Color</h3>
            </div>
            <ColorPalette
              colors={sidingColors}
              selectedColorId={selectedSidingColor?.id}
              onSelect={selectSidingColor}
            />
            {selectedSidingColor && (
              <p className="text-sm text-stone-500 mt-3">
                Selected: <span className="font-medium text-stone-700">{selectedSidingColor.name}</span>
              </p>
            )}
          </div>

          {/* Roof Color */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-5 h-5 text-stone-400" />
              <h3 className="font-semibold text-stone-900">Roof Color</h3>
            </div>
            <ColorPalette
              colors={shingleColors}
              selectedColorId={selectedShingleColor?.id}
              onSelect={selectShingleColor}
            />
            {selectedShingleColor && (
              <p className="text-sm text-stone-500 mt-3">
                Selected: <span className="font-medium text-stone-700">{selectedShingleColor.name}</span>
              </p>
            )}
          </div>

          {/* Configuration Summary */}
          <ConfigSummary />

          {/* Price Breakdown */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
            <PriceSummary />
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
        <h3 className="font-semibold text-amber-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-amber-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">1.</span>
            Add to cart and complete checkout
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">2.</span>
            Our team will contact you to confirm details
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">3.</span>
            We build and deliver your custom shed
          </li>
        </ul>
      </div>
    </div>
  )
}
