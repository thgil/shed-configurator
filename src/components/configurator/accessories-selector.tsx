'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { formatPriceDecimal } from '@/lib/utils'
import { Plus, Minus } from 'lucide-react'

export function AccessoriesSelector() {
  const {
    selectedSize,
    doorOptions,
    windowOptions,
    doors,
    windows,
    addDoor,
    removeDoor,
    addWindow,
    removeWindow,
  } = useConfiguratorStore()

  const maxDoors = selectedSize?.maxDoors ?? 2
  const maxWindows = selectedSize?.maxWindows ?? 4
  const doorCount = doors.length
  const windowCount = windows.length

  // Get price of default door/window
  const doorPrice = doorOptions[0]?.priceEach ?? 0
  const windowPrice = windowOptions[0]?.priceEach ?? 150

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Doors */}
      <div className="bg-white rounded-xl p-4 border border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-stone-900">Doors</h3>
          <span className="text-sm text-stone-500">{doorCount}/{maxDoors}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              if (doors.length > 0) {
                removeDoor(doors[doors.length - 1].id)
              }
            }}
            disabled={doorCount === 0}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              "focus:outline-none focus:ring-2 focus:ring-amber-500",
              doorCount === 0
                ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            )}
          >
            <Minus className="w-5 h-5" />
          </button>

          <span className="text-3xl font-bold text-stone-900 w-12 text-center">
            {doorCount}
          </span>

          <button
            onClick={() => addDoor('FRONT')}
            disabled={doorCount >= maxDoors}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              "focus:outline-none focus:ring-2 focus:ring-amber-500",
              doorCount >= maxDoors
                ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600"
            )}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-3">
          <span className="text-sm text-amber-600 font-medium">
            {doorPrice === 0 ? 'Included' : `+${formatPriceDecimal(doorPrice)} each`}
          </span>
        </div>
      </div>

      {/* Windows */}
      <div className="bg-white rounded-xl p-4 border border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-stone-900">Windows</h3>
          <span className="text-sm text-stone-500">{windowCount}/{maxWindows}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              if (windows.length > 0) {
                removeWindow(windows[windows.length - 1].id)
              }
            }}
            disabled={windowCount === 0}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              "focus:outline-none focus:ring-2 focus:ring-amber-500",
              windowCount === 0
                ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            )}
          >
            <Minus className="w-5 h-5" />
          </button>

          <span className="text-3xl font-bold text-stone-900 w-12 text-center">
            {windowCount}
          </span>

          <button
            onClick={() => addWindow('FRONT')}
            disabled={windowCount >= maxWindows}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              "focus:outline-none focus:ring-2 focus:ring-amber-500",
              windowCount >= maxWindows
                ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600"
            )}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-3">
          <span className="text-sm text-amber-600 font-medium">
            +{formatPriceDecimal(windowPrice)} each
          </span>
        </div>
      </div>
    </div>
  )
}
