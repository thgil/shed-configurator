'use client'

import { useState } from 'react'
import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { Check, Paintbrush, Home } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ColorSelector() {
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
    <Tabs defaultValue="siding" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="siding" className="gap-2">
          <Paintbrush className="w-4 h-4" />
          Siding Color
        </TabsTrigger>
        <TabsTrigger value="roof" className="gap-2">
          <Home className="w-4 h-4" />
          Roof Color
        </TabsTrigger>
      </TabsList>

      {/* Siding Colors */}
      <TabsContent value="siding" className="mt-0">
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-900 mb-4">Choose Your Siding Color</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {sidingColors.map((color) => {
              const isSelected = selectedSidingColor?.id === color.id

              return (
                <button
                  key={color.id}
                  onClick={() => selectSidingColor(color)}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                    isSelected
                      ? "bg-amber-50 ring-2 ring-amber-500"
                      : "hover:bg-stone-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full transition-all duration-200 relative shadow-md",
                      isSelected ? "scale-110" : "group-hover:scale-105",
                      isLightColor(color.hexCode) && "border-2 border-stone-200"
                    )}
                    style={{ backgroundColor: color.hexCode }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className={cn(
                          "w-6 h-6",
                          isLightColor(color.hexCode) ? "text-stone-800" : "text-white"
                        )} />
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium text-center",
                    isSelected ? "text-amber-700" : "text-stone-600"
                  )}>
                    {color.name}
                  </span>
                </button>
              )
            })}
          </div>

          {selectedSidingColor && (
            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full shadow-sm border border-stone-200"
                style={{ backgroundColor: selectedSidingColor.hexCode }}
              />
              <div>
                <p className="font-medium text-stone-900">Selected: {selectedSidingColor.name}</p>
                <p className="text-sm text-stone-500">{selectedSidingOption?.material}</p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Roof Colors */}
      <TabsContent value="roof" className="mt-0">
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-900 mb-4">Choose Your Roof Color</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {shingleColors.map((color) => {
              const isSelected = selectedShingleColor?.id === color.id

              return (
                <button
                  key={color.id}
                  onClick={() => selectShingleColor(color)}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                    isSelected
                      ? "bg-amber-50 ring-2 ring-amber-500"
                      : "hover:bg-stone-50 border border-stone-200"
                  )}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-lg transition-all duration-200 relative shadow-md",
                      isSelected ? "scale-110" : "group-hover:scale-105"
                    )}
                    style={{ backgroundColor: color.hexCode }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium text-center",
                    isSelected ? "text-amber-700" : "text-stone-600"
                  )}>
                    {color.name}
                  </span>
                </button>
              )
            })}
          </div>

          {selectedShingleColor && (
            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg shadow-sm"
                style={{ backgroundColor: selectedShingleColor.hexCode }}
              />
              <div>
                <p className="font-medium text-stone-900">Selected: {selectedShingleColor.name}</p>
                <p className="text-sm text-stone-500">{selectedShingleOption?.name}</p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

// Helper to determine if a color is light (for contrast)
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}
