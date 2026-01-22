'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPriceDecimal } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import type { WallPosition } from '@/types/configurator'

const wallLabels: Record<WallPosition, string> = {
  FRONT: 'Front Wall',
  BACK: 'Back Wall',
  LEFT: 'Left Wall',
  RIGHT: 'Right Wall',
}

export function DoorsWindowsSelector() {
  const {
    selectedSize,
    doorOptions,
    windowOptions,
    doors,
    windows,
    addDoor,
    removeDoor,
    updateDoor,
    addWindow,
    removeWindow,
    updateWindow,
  } = useConfiguratorStore()

  const maxDoors = selectedSize?.maxDoors ?? 2
  const maxWindows = selectedSize?.maxWindows ?? 4

  if (!selectedSize) {
    return (
      <div className="text-center py-8 text-stone-500">
        Please select a size first
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Doors Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-stone-700">
            Doors ({doors.length}/{maxDoors})
          </h3>
          {doors.length < maxDoors && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addDoor('FRONT')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Door
            </Button>
          )}
        </div>

        {doors.length === 0 ? (
          <p className="text-sm text-stone-500 py-4">
            No doors added. Click &quot;Add Door&quot; to customize door placement.
          </p>
        ) : (
          <div className="space-y-3">
            {doors.map((door, index) => (
              <Card key={door.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-stone-900">
                    Door {index + 1}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <select
                      value={door.option?.id ?? ''}
                      onChange={(e) => {
                        const option = doorOptions.find((o) => o.id === e.target.value)
                        updateDoor(door.id, { option: option ?? null })
                      }}
                      className="text-sm border border-stone-300 rounded-lg px-2 py-1"
                    >
                      {doorOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} (+{formatPriceDecimal(option.priceEach)})
                        </option>
                      ))}
                    </select>
                    <select
                      value={door.wall}
                      onChange={(e) =>
                        updateDoor(door.id, { wall: e.target.value as WallPosition })
                      }
                      className="text-sm border border-stone-300 rounded-lg px-2 py-1"
                    >
                      {Object.entries(wallLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDoor(door.id)}
                  className="text-stone-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Windows Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-stone-700">
            Windows ({windows.length}/{maxWindows})
          </h3>
          {windows.length < maxWindows && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWindow('FRONT')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Window
            </Button>
          )}
        </div>

        {windows.length === 0 ? (
          <p className="text-sm text-stone-500 py-4">
            No windows added. Click &quot;Add Window&quot; to add windows.
          </p>
        ) : (
          <div className="space-y-3">
            {windows.map((window, index) => (
              <Card key={window.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-stone-900">
                    Window {index + 1}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <select
                      value={window.option?.id ?? ''}
                      onChange={(e) => {
                        const option = windowOptions.find((o) => o.id === e.target.value)
                        updateWindow(window.id, { option: option ?? null })
                      }}
                      className="text-sm border border-stone-300 rounded-lg px-2 py-1"
                    >
                      {windowOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} (+{formatPriceDecimal(option.priceEach)})
                        </option>
                      ))}
                    </select>
                    <select
                      value={window.wall}
                      onChange={(e) =>
                        updateWindow(window.id, { wall: e.target.value as WallPosition })
                      }
                      className="text-sm border border-stone-300 rounded-lg px-2 py-1"
                    >
                      {Object.entries(wallLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWindow(window.id)}
                  className="text-stone-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
