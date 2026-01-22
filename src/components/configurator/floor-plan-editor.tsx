'use client'

import { useState, useRef, useCallback } from 'react'
import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import {
  FLOOR_PLAN_SIZE,
  PADDING,
  WALL_THICKNESS,
  DOOR_WIDTH_DEFAULT,
  WINDOW_WIDTH_DEFAULT,
  getWallDimensions,
  getWallLengthFeet,
  getItemWidthPixels,
  getWallUsableLength,
  offsetToPixels,
  pixelsToOffset,
  clickToOffset,
  getItemPosition,
  validatePlacement,
} from '@/lib/floor-plan-utils'
import type { WallPosition, DoorPlacement, WindowPlacement } from '@/types/configurator'
import { DoorOpen, Grid3X3, Trash2, Move, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type AddMode = 'door' | 'window' | null

export function FloorPlanEditor() {
  const {
    selectedSize,
    doors,
    windows,
    doorOptions,
    windowOptions,
    addDoor,
    addWindow,
    updateDoor,
    updateWindow,
    removeDoor,
    removeWindow,
  } = useConfiguratorStore()

  const [addMode, setAddMode] = useState<AddMode>(null)
  const [hoveredWall, setHoveredWall] = useState<WallPosition | null>(null)
  const [draggingItem, setDraggingItem] = useState<{ type: 'door' | 'window'; id: string } | null>(null)
  const [selectedItem, setSelectedItem] = useState<{ type: 'door' | 'window'; id: string } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  if (!selectedSize) {
    return (
      <div className="bg-stone-100 rounded-xl p-8 text-center min-h-[300px] flex items-center justify-center">
        <p className="text-stone-500">Select a size to design your layout</p>
      </div>
    )
  }

  const wallDimensions = getWallDimensions(selectedSize)

  // Get SVG coordinates from mouse event
  const getSvgCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    if (!svgRef.current) return null

    const svg = svgRef.current
    const point = svg.createSVGPoint()

    // Handle both mouse and touch events
    if ('touches' in e) {
      point.x = e.touches[0].clientX
      point.y = e.touches[0].clientY
    } else {
      point.x = e.clientX
      point.y = e.clientY
    }

    const ctm = svg.getScreenCTM()
    if (!ctm) return null

    const svgPoint = point.matrixTransform(ctm.inverse())
    return { x: svgPoint.x, y: svgPoint.y }
  }, [])

  // Handle wall click to add item
  const handleWallClick = useCallback((wall: WallPosition, e: React.MouseEvent) => {
    if (!addMode) return

    const coords = getSvgCoordinates(e)
    if (!coords) return

    const wallDim = wallDimensions.find(w => w.wall === wall)
    if (!wallDim) return

    const itemWidthInches = addMode === 'door'
      ? (doorOptions[0]?.widthInches ?? DOOR_WIDTH_DEFAULT)
      : (windowOptions[0]?.widthInches ?? WINDOW_WIDTH_DEFAULT)

    const wallLengthFeet = getWallLengthFeet(wall, selectedSize)
    const wallLengthPixels = getWallUsableLength(wallDim)
    const itemWidthPixels = getItemWidthPixels(itemWidthInches, wallLengthFeet, wallLengthPixels)

    const offsetPercent = clickToOffset(coords.x, coords.y, wallDim, itemWidthPixels)

    // Validate placement
    const error = validatePlacement(
      { wall, offsetPercent, widthInches: itemWidthInches },
      doors,
      windows,
      selectedSize
    )

    if (error) {
      // Could show a toast here
      console.warn('Invalid placement:', error)
      return
    }

    if (addMode === 'door') {
      addDoor(wall)
      // Update the last added door's position
      const newDoors = useConfiguratorStore.getState().doors
      const lastDoor = newDoors[newDoors.length - 1]
      if (lastDoor) {
        updateDoor(lastDoor.id, { offsetPercent })
      }
    } else {
      addWindow(wall)
      const newWindows = useConfiguratorStore.getState().windows
      const lastWindow = newWindows[newWindows.length - 1]
      if (lastWindow) {
        updateWindow(lastWindow.id, { offsetPercent })
      }
    }

    setAddMode(null)
  }, [addMode, wallDimensions, selectedSize, doors, windows, doorOptions, windowOptions, addDoor, addWindow, updateDoor, updateWindow, getSvgCoordinates])

  // Handle drag start
  const handleDragStart = useCallback((type: 'door' | 'window', id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingItem({ type, id })
    setSelectedItem({ type, id })
  }, [])

  // Handle drag move
  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingItem) return

    const coords = getSvgCoordinates(e)
    if (!coords) return

    const item = draggingItem.type === 'door'
      ? doors.find(d => d.id === draggingItem.id)
      : windows.find(w => w.id === draggingItem.id)

    if (!item) return

    const wallDim = wallDimensions.find(w => w.wall === item.wall)
    if (!wallDim) return

    const itemWidthInches = draggingItem.type === 'door'
      ? (item as DoorPlacement).option?.widthInches ?? DOOR_WIDTH_DEFAULT
      : (item as WindowPlacement).option?.widthInches ?? WINDOW_WIDTH_DEFAULT

    const wallLengthFeet = getWallLengthFeet(item.wall, selectedSize)
    const wallLengthPixels = getWallUsableLength(wallDim)
    const itemWidthPixels = getItemWidthPixels(itemWidthInches, wallLengthFeet, wallLengthPixels)

    const newOffset = pixelsToOffset(
      wallDim.orientation === 'horizontal' ? coords.x : coords.y,
      wallDim,
      itemWidthPixels
    )

    if (draggingItem.type === 'door') {
      updateDoor(draggingItem.id, { offsetPercent: newOffset })
    } else {
      updateWindow(draggingItem.id, { offsetPercent: newOffset })
    }
  }, [draggingItem, doors, windows, wallDimensions, selectedSize, updateDoor, updateWindow, getSvgCoordinates])

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setDraggingItem(null)
  }, [])

  // Handle delete selected item
  const handleDelete = useCallback(() => {
    if (!selectedItem) return

    if (selectedItem.type === 'door') {
      removeDoor(selectedItem.id)
    } else {
      removeWindow(selectedItem.id)
    }
    setSelectedItem(null)
  }, [selectedItem, removeDoor, removeWindow])

  // Click outside to deselect
  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if clicking on the SVG background
    if (e.target === svgRef.current || (e.target as SVGElement).tagName === 'rect') {
      if (!addMode) {
        setSelectedItem(null)
      }
    }
  }, [addMode])

  const maxDoors = selectedSize.maxDoors
  const maxWindows = selectedSize.maxWindows

  // Wall labels for better clarity
  const wallLabels: Record<WallPosition, string> = {
    FRONT: 'Front',
    BACK: 'Back',
    LEFT: 'Left',
    RIGHT: 'Right',
  }

  return (
    <div className="space-y-4">
      {/* Add buttons - more prominent */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setAddMode(addMode === 'door' ? null : 'door')}
          disabled={doors.length >= maxDoors}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all",
            addMode === 'door'
              ? "bg-amber-500 text-white shadow-lg ring-2 ring-amber-500 ring-offset-2"
              : doors.length >= maxDoors
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-700"
          )}
        >
          <Plus className="w-4 h-4" />
          <DoorOpen className="w-4 h-4" />
          Add Door
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs",
            addMode === 'door' ? "bg-amber-400" : "bg-stone-200"
          )}>
            {doors.length}/{maxDoors}
          </span>
        </button>

        <button
          onClick={() => setAddMode(addMode === 'window' ? null : 'window')}
          disabled={windows.length >= maxWindows}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all",
            addMode === 'window'
              ? "bg-sky-500 text-white shadow-lg ring-2 ring-sky-500 ring-offset-2"
              : windows.length >= maxWindows
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-stone-100 text-stone-700 hover:bg-sky-100 hover:text-sky-700"
          )}
        >
          <Plus className="w-4 h-4" />
          <Grid3X3 className="w-4 h-4" />
          Add Window
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs",
            addMode === 'window' ? "bg-sky-400" : "bg-stone-200"
          )}>
            {windows.length}/{maxWindows}
          </span>
        </button>

        {selectedItem && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        )}
      </div>

      {/* Instruction banner - fixed height to prevent layout shift */}
      <div className="h-11">
        <AnimatePresence>
          {addMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl p-3 text-sm font-medium",
                addMode === 'door' ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
              )}
            >
              Click on any wall to place your {addMode}. The {addMode} will appear where you click.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SVG Floor Plan - larger and more prominent */}
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${FLOOR_PLAN_SIZE} ${FLOOR_PLAN_SIZE}`}
          className="w-full max-w-lg mx-auto bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl shadow-inner"
          style={{ minHeight: '350px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onClick={handleSvgClick}
        >
          {/* Floor area */}
          <rect
            x={wallDimensions[0]?.x ?? PADDING}
            y={wallDimensions[1]?.y ?? PADDING}
            width={(wallDimensions[0]?.width ?? 300)}
            height={(wallDimensions[2]?.height ?? 300)}
            fill="#fafaf9"
            stroke="#d6d3d1"
            strokeWidth="1"
          />

          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e7e5e4" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect
            x={wallDimensions[0]?.x ?? PADDING}
            y={wallDimensions[1]?.y ?? PADDING}
            width={(wallDimensions[0]?.width ?? 300)}
            height={(wallDimensions[2]?.height ?? 300)}
            fill="url(#grid)"
          />

          {/* Walls */}
          {wallDimensions.map((wall) => {
            const isHovered = hoveredWall === wall.wall && addMode
            const canAdd = addMode && (
              (addMode === 'door' && doors.length < maxDoors) ||
              (addMode === 'window' && windows.length < maxWindows)
            )

            return (
              <g key={wall.wall}>
                {/* Wall rectangle */}
                <rect
                  x={wall.x}
                  y={wall.y}
                  width={wall.width}
                  height={wall.height}
                  fill={isHovered ? (addMode === 'door' ? '#f59e0b' : '#38bdf8') : '#78716c'}
                  className={cn(
                    "transition-all duration-200",
                    canAdd && "cursor-crosshair"
                  )}
                  onMouseEnter={() => addMode && setHoveredWall(wall.wall)}
                  onMouseLeave={() => setHoveredWall(null)}
                  onClick={(e) => handleWallClick(wall.wall, e)}
                />

                {/* Wall label */}
                <text
                  x={wall.orientation === 'horizontal'
                    ? wall.x + wall.width / 2
                    : wall.wall === 'LEFT' ? wall.x - 20 : wall.x + wall.width + 20
                  }
                  y={wall.orientation === 'horizontal'
                    ? wall.wall === 'FRONT' ? wall.y + wall.height + 24 : wall.y - 14
                    : wall.y + wall.height / 2
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-stone-600 font-semibold select-none"
                  style={{ fontSize: '12px' }}
                >
                  {wallLabels[wall.wall]}
                </text>
                <text
                  x={wall.orientation === 'horizontal'
                    ? wall.x + wall.width / 2
                    : wall.wall === 'LEFT' ? wall.x - 20 : wall.x + wall.width + 20
                  }
                  y={wall.orientation === 'horizontal'
                    ? wall.wall === 'FRONT' ? wall.y + wall.height + 38 : wall.y - 28
                    : wall.y + wall.height / 2 + 14
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-stone-400 select-none"
                  style={{ fontSize: '10px' }}
                >
                  ({getWallLengthFeet(wall.wall, selectedSize)}')
                </text>
              </g>
            )
          })}

          {/* Doors */}
          {doors.map((door) => {
            const wallDim = wallDimensions.find(w => w.wall === door.wall)
            if (!wallDim) return null

            const doorWidth = door.option?.widthInches ?? DOOR_WIDTH_DEFAULT
            const wallLengthFeet = getWallLengthFeet(door.wall, selectedSize)
            const pos = getItemPosition(door, wallDim, wallLengthFeet, doorWidth)
            const isSelected = selectedItem?.type === 'door' && selectedItem.id === door.id
            const isDragging = draggingItem?.type === 'door' && draggingItem.id === door.id

            return (
              <g
                key={door.id}
                onMouseDown={(e) => handleDragStart('door', door.id, e)}
                onTouchStart={(e) => handleDragStart('door', door.id, e)}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItem({ type: 'door', id: door.id })
                }}
                className={cn(
                  "cursor-move",
                  isDragging && "opacity-75"
                )}
              >
                {/* Door selection highlight */}
                {isSelected && (
                  <rect
                    x={pos.x - 3}
                    y={pos.y - 3}
                    width={pos.width + 6}
                    height={pos.height + 6}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth={2}
                    strokeDasharray="4,2"
                    rx="4"
                  />
                )}
                {/* Door body */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  height={pos.height}
                  fill="#f59e0b"
                  stroke={isSelected ? '#dc2626' : '#d97706'}
                  strokeWidth={isSelected ? 2 : 1.5}
                  rx="2"
                />
                {/* Door swing indicator */}
                <path
                  d={wallDim.orientation === 'horizontal'
                    ? `M ${pos.x} ${pos.y} Q ${pos.x + pos.width / 2} ${pos.y - 18} ${pos.x + pos.width} ${pos.y}`
                    : `M ${pos.x} ${pos.y} Q ${pos.x - 18} ${pos.y + pos.height / 2} ${pos.x} ${pos.y + pos.height}`
                  }
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                />
                {/* Door label */}
                <text
                  x={pos.x + pos.width / 2}
                  y={pos.y + pos.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white font-bold select-none pointer-events-none"
                  style={{ fontSize: '10px' }}
                >
                  D
                </text>
              </g>
            )
          })}

          {/* Windows */}
          {windows.map((window) => {
            const wallDim = wallDimensions.find(w => w.wall === window.wall)
            if (!wallDim) return null

            const windowWidth = window.option?.widthInches ?? WINDOW_WIDTH_DEFAULT
            const wallLengthFeet = getWallLengthFeet(window.wall, selectedSize)
            const pos = getItemPosition(window, wallDim, wallLengthFeet, windowWidth)
            const isSelected = selectedItem?.type === 'window' && selectedItem.id === window.id
            const isDragging = draggingItem?.type === 'window' && draggingItem.id === window.id

            return (
              <g
                key={window.id}
                onMouseDown={(e) => handleDragStart('window', window.id, e)}
                onTouchStart={(e) => handleDragStart('window', window.id, e)}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItem({ type: 'window', id: window.id })
                }}
                className={cn(
                  "cursor-move",
                  isDragging && "opacity-75"
                )}
              >
                {/* Window selection highlight */}
                {isSelected && (
                  <rect
                    x={pos.x - 3}
                    y={pos.y - 3}
                    width={pos.width + 6}
                    height={pos.height + 6}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth={2}
                    strokeDasharray="4,2"
                    rx="4"
                  />
                )}
                {/* Window body */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  height={pos.height}
                  fill="#7dd3fc"
                  stroke={isSelected ? '#dc2626' : '#0284c7'}
                  strokeWidth={isSelected ? 2 : 1.5}
                  rx="2"
                />
                {/* Window pane dividers */}
                <line
                  x1={pos.x + pos.width / 2}
                  y1={pos.y + 1}
                  x2={pos.x + pos.width / 2}
                  y2={pos.y + pos.height - 1}
                  stroke="#0284c7"
                  strokeWidth="1.5"
                />
                <line
                  x1={pos.x + 1}
                  y1={pos.y + pos.height / 2}
                  x2={pos.x + pos.width - 1}
                  y2={pos.y + pos.height / 2}
                  stroke="#0284c7"
                  strokeWidth="1.5"
                />
                {/* Window label */}
                <text
                  x={pos.x + pos.width / 2}
                  y={pos.y + pos.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-sky-800 font-bold select-none pointer-events-none"
                  style={{ fontSize: '9px' }}
                >
                  W
                </text>
              </g>
            )
          })}

          {/* Compass indicator */}
          <g transform={`translate(${FLOOR_PLAN_SIZE - 45}, 45)`}>
            <circle r="18" fill="white" stroke="#d6d3d1" strokeWidth="1.5" />
            <text y="-3" textAnchor="middle" className="fill-stone-700 font-bold" style={{ fontSize: '11px' }}>N</text>
            <polygon points="0,-12 -4,-5 4,-5" fill="#78716c" />
          </g>
        </svg>

        {/* Drag indicator overlay */}
        {draggingItem && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-stone-900/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
            <Move className="w-3 h-3" />
            Drag to reposition
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 text-sm text-stone-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 bg-amber-500 rounded shadow-sm" />
          <span>Door</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 bg-sky-400 rounded shadow-sm" />
          <span>Window</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-stone-400 text-center">
        {selectedItem
          ? 'Press Delete key or click the Delete button to remove selected item'
          : 'Click an item to select it, then drag to reposition'
        }
      </p>
    </div>
  )
}
