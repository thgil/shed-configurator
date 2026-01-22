import type { WallPosition, DoorPlacement, WindowPlacement, ShedSize, DoorOption, WindowOption } from '@/types/configurator'

// SVG viewBox dimensions
export const FLOOR_PLAN_SIZE = 400
export const PADDING = 50
export const WALL_THICKNESS = 8

// Item sizes in inches (converted to proportional SVG units)
export const DOOR_WIDTH_DEFAULT = 36 // 3 feet
export const WINDOW_WIDTH_DEFAULT = 24 // 2 feet

export interface WallDimensions {
  x: number
  y: number
  width: number
  height: number
  orientation: 'horizontal' | 'vertical'
  wall: WallPosition
}

/**
 * Calculate wall dimensions based on shed size
 */
export function getWallDimensions(size: ShedSize): WallDimensions[] {
  const innerWidth = FLOOR_PLAN_SIZE - (PADDING * 2)
  const innerHeight = FLOOR_PLAN_SIZE - (PADDING * 2)

  // Scale based on aspect ratio
  const aspectRatio = size.widthFeet / size.depthFeet
  let shedWidth: number
  let shedHeight: number

  if (aspectRatio > 1) {
    shedWidth = innerWidth
    shedHeight = innerWidth / aspectRatio
  } else {
    shedHeight = innerHeight
    shedWidth = innerHeight * aspectRatio
  }

  const offsetX = (FLOOR_PLAN_SIZE - shedWidth) / 2
  const offsetY = (FLOOR_PLAN_SIZE - shedHeight) / 2

  return [
    {
      wall: 'FRONT',
      x: offsetX,
      y: offsetY + shedHeight - WALL_THICKNESS,
      width: shedWidth,
      height: WALL_THICKNESS,
      orientation: 'horizontal',
    },
    {
      wall: 'BACK',
      x: offsetX,
      y: offsetY,
      width: shedWidth,
      height: WALL_THICKNESS,
      orientation: 'horizontal',
    },
    {
      wall: 'LEFT',
      x: offsetX,
      y: offsetY,
      width: WALL_THICKNESS,
      height: shedHeight,
      orientation: 'vertical',
    },
    {
      wall: 'RIGHT',
      x: offsetX + shedWidth - WALL_THICKNESS,
      y: offsetY,
      width: WALL_THICKNESS,
      height: shedHeight,
      orientation: 'vertical',
    },
  ]
}

/**
 * Get the usable length of a wall in pixels for placing items
 */
export function getWallUsableLength(wallDim: WallDimensions): number {
  return wallDim.orientation === 'horizontal' ? wallDim.width : wallDim.height
}

/**
 * Get the wall length in feet based on shed size
 */
export function getWallLengthFeet(wall: WallPosition, size: ShedSize): number {
  if (wall === 'FRONT' || wall === 'BACK') {
    return size.widthFeet
  }
  return size.depthFeet
}

/**
 * Calculate item width in pixels based on actual dimensions
 */
export function getItemWidthPixels(
  itemWidthInches: number,
  wallLengthFeet: number,
  wallLengthPixels: number
): number {
  const wallLengthInches = wallLengthFeet * 12
  const proportion = itemWidthInches / wallLengthInches
  return proportion * wallLengthPixels
}

/**
 * Convert offsetPercent to pixel position along a wall
 */
export function offsetToPixels(
  offsetPercent: number,
  wallDim: WallDimensions,
  itemWidthPixels: number
): number {
  const usableLength = getWallUsableLength(wallDim) - itemWidthPixels
  const pixelOffset = (offsetPercent / 100) * usableLength

  if (wallDim.orientation === 'horizontal') {
    return wallDim.x + pixelOffset
  }
  return wallDim.y + pixelOffset
}

/**
 * Convert pixel position to offsetPercent
 */
export function pixelsToOffset(
  pixelPosition: number,
  wallDim: WallDimensions,
  itemWidthPixels: number
): number {
  const usableLength = getWallUsableLength(wallDim) - itemWidthPixels
  const startPixel = wallDim.orientation === 'horizontal' ? wallDim.x : wallDim.y
  const relativePosition = pixelPosition - startPixel

  const offsetPercent = (relativePosition / usableLength) * 100
  return Math.max(0, Math.min(100, offsetPercent))
}

/**
 * Convert click position to offset percent for a new item
 */
export function clickToOffset(
  clickX: number,
  clickY: number,
  wallDim: WallDimensions,
  itemWidthPixels: number
): number {
  const clickPos = wallDim.orientation === 'horizontal' ? clickX : clickY
  const wallStart = wallDim.orientation === 'horizontal' ? wallDim.x : wallDim.y

  // Center the item on click position
  const itemCenterOffset = clickPos - wallStart - (itemWidthPixels / 2)
  const usableLength = getWallUsableLength(wallDim) - itemWidthPixels

  const offsetPercent = (itemCenterOffset / usableLength) * 100
  return Math.max(0, Math.min(100, offsetPercent))
}

/**
 * Check if two items on the same wall overlap
 */
export function itemsOverlap(
  item1Offset: number,
  item1Width: number,
  item2Offset: number,
  item2Width: number,
  wallLength: number
): boolean {
  // Convert percentage offsets to actual positions
  const usable1 = wallLength - item1Width
  const usable2 = wallLength - item2Width

  const pos1Start = (item1Offset / 100) * usable1
  const pos1End = pos1Start + item1Width

  const pos2Start = (item2Offset / 100) * usable2
  const pos2End = pos2Start + item2Width

  // Check for overlap
  return !(pos1End <= pos2Start || pos2End <= pos1Start)
}

/**
 * Validate item placement - returns error message or null if valid
 */
export function validatePlacement(
  newItem: { wall: WallPosition; offsetPercent: number; widthInches: number },
  existingDoors: DoorPlacement[],
  existingWindows: WindowPlacement[],
  size: ShedSize,
  excludeId?: string
): string | null {
  const wallLengthFeet = getWallLengthFeet(newItem.wall, size)
  const wallLengthInches = wallLengthFeet * 12

  // Minimum 6 inches from corners
  const minMarginInches = 6
  const minMarginPercent = (minMarginInches / (wallLengthInches - newItem.widthInches)) * 100

  if (newItem.offsetPercent < minMarginPercent || newItem.offsetPercent > (100 - minMarginPercent)) {
    return 'Too close to corner'
  }

  // Check overlap with existing doors on same wall
  for (const door of existingDoors) {
    if (door.id === excludeId || door.wall !== newItem.wall) continue

    const doorWidth = door.option?.widthInches ?? DOOR_WIDTH_DEFAULT
    if (itemsOverlap(
      newItem.offsetPercent,
      newItem.widthInches,
      door.offsetPercent,
      doorWidth,
      wallLengthInches
    )) {
      return 'Overlaps with existing door'
    }
  }

  // Check overlap with existing windows on same wall
  for (const window of existingWindows) {
    if (window.id === excludeId || window.wall !== newItem.wall) continue

    const windowWidth = window.option?.widthInches ?? WINDOW_WIDTH_DEFAULT
    if (itemsOverlap(
      newItem.offsetPercent,
      newItem.widthInches,
      window.offsetPercent,
      windowWidth,
      wallLengthInches
    )) {
      return 'Overlaps with existing window'
    }
  }

  return null
}

/**
 * Get item position for rendering on the floor plan
 */
export function getItemPosition(
  item: DoorPlacement | WindowPlacement,
  wallDim: WallDimensions,
  wallLengthFeet: number,
  itemWidthInches: number
): { x: number; y: number; width: number; height: number; rotation: number } {
  const wallLengthPixels = getWallUsableLength(wallDim)
  const itemWidthPixels = getItemWidthPixels(itemWidthInches, wallLengthFeet, wallLengthPixels)
  const itemHeightPixels = 12 // Fixed visual height

  const offset = offsetToPixels(item.offsetPercent, wallDim, itemWidthPixels)

  if (wallDim.orientation === 'horizontal') {
    return {
      x: offset,
      y: wallDim.y - itemHeightPixels / 2 + WALL_THICKNESS / 2,
      width: itemWidthPixels,
      height: itemHeightPixels,
      rotation: 0,
    }
  } else {
    return {
      x: wallDim.x - itemHeightPixels / 2 + WALL_THICKNESS / 2,
      y: offset,
      width: itemHeightPixels,
      height: itemWidthPixels,
      rotation: 0,
    }
  }
}
