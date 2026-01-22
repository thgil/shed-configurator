import type { RoofStyle, WallPosition, DoorPlacement, WindowPlacement, ShedSize } from '@/types/configurator'

export interface WallDimensions {
  width: number
  height: number
  depth: number
  position: [number, number, number]
  rotation: [number, number, number]
}

export function getWallDimensions(
  wall: WallPosition,
  widthFeet: number,
  depthFeet: number,
  heightFeet: number
): WallDimensions {
  const wallThickness = 0.3

  switch (wall) {
    case 'FRONT':
      return {
        width: widthFeet,
        height: heightFeet,
        depth: wallThickness,
        position: [0, heightFeet / 2, depthFeet / 2],
        rotation: [0, 0, 0],
      }
    case 'BACK':
      return {
        width: widthFeet,
        height: heightFeet,
        depth: wallThickness,
        position: [0, heightFeet / 2, -depthFeet / 2],
        rotation: [0, 0, 0],
      }
    case 'LEFT':
      return {
        width: wallThickness,
        height: heightFeet,
        depth: depthFeet,
        position: [-widthFeet / 2, heightFeet / 2, 0],
        rotation: [0, 0, 0],
      }
    case 'RIGHT':
      return {
        width: wallThickness,
        height: heightFeet,
        depth: depthFeet,
        position: [widthFeet / 2, heightFeet / 2, 0],
        rotation: [0, 0, 0],
      }
  }
}

export interface RoofGeometryData {
  vertices: number[]
  indices: number[]
}

export function getGableRoofGeometry(
  widthFeet: number,
  depthFeet: number,
  heightFeet: number
): RoofGeometryData[] {
  const peakHeight = heightFeet * 0.35
  const overhang = 0.5
  const w = widthFeet / 2 + overhang
  const d = depthFeet / 2 + overhang
  const h = heightFeet
  const peak = h + peakHeight

  // Left panel
  const leftVertices = [
    -w, h, d,           // 0: front-left bottom
    0, peak, d,         // 1: front peak
    0, peak, -d,        // 2: back peak
    -w, h, -d,          // 3: back-left bottom
  ]
  const leftIndices = [0, 1, 2, 0, 2, 3]

  // Right panel
  const rightVertices = [
    0, peak, d,         // 0: front peak
    w, h, d,            // 1: front-right bottom
    w, h, -d,           // 2: back-right bottom
    0, peak, -d,        // 3: back peak
  ]
  const rightIndices = [0, 1, 2, 0, 2, 3]

  return [
    { vertices: leftVertices, indices: leftIndices },
    { vertices: rightVertices, indices: rightIndices },
  ]
}

export function getBarnRoofGeometry(
  widthFeet: number,
  depthFeet: number,
  heightFeet: number
): RoofGeometryData[] {
  const peakHeight = heightFeet * 0.45
  const midHeight = heightFeet + peakHeight * 0.6
  const overhang = 0.5
  const w = widthFeet / 2
  const d = depthFeet / 2 + overhang
  const h = heightFeet
  const peak = h + peakHeight

  // Four panels for gambrel roof
  // Lower left
  const lowerLeftVertices = [
    -(w + overhang), h, d,
    -w * 0.5, midHeight, d,
    -w * 0.5, midHeight, -d,
    -(w + overhang), h, -d,
  ]

  // Upper left
  const upperLeftVertices = [
    -w * 0.5, midHeight, d,
    0, peak, d,
    0, peak, -d,
    -w * 0.5, midHeight, -d,
  ]

  // Upper right
  const upperRightVertices = [
    0, peak, d,
    w * 0.5, midHeight, d,
    w * 0.5, midHeight, -d,
    0, peak, -d,
  ]

  // Lower right
  const lowerRightVertices = [
    w * 0.5, midHeight, d,
    w + overhang, h, d,
    w + overhang, h, -d,
    w * 0.5, midHeight, -d,
  ]

  const indices = [0, 1, 2, 0, 2, 3]

  return [
    { vertices: lowerLeftVertices, indices },
    { vertices: upperLeftVertices, indices },
    { vertices: upperRightVertices, indices },
    { vertices: lowerRightVertices, indices },
  ]
}

export function getLeanToRoofGeometry(
  widthFeet: number,
  depthFeet: number,
  heightFeet: number
): RoofGeometryData[] {
  const rise = heightFeet * 0.2
  const overhang = 0.5
  const w = widthFeet / 2 + overhang
  const d = depthFeet / 2 + overhang
  const h = heightFeet

  // Single sloped panel - higher at back (negative Z)
  const vertices = [
    -w, h, d,           // 0: front-left (lower)
    w, h, d,            // 1: front-right (lower)
    w, h + rise, -d,    // 2: back-right (higher)
    -w, h + rise, -d,   // 3: back-left (higher)
  ]
  const indices = [0, 1, 2, 0, 2, 3]

  return [{ vertices, indices }]
}

export function getRoofGeometry(
  roofStyle: RoofStyle,
  widthFeet: number,
  depthFeet: number,
  heightFeet: number
): RoofGeometryData[] {
  switch (roofStyle) {
    case 'GABLE':
      return getGableRoofGeometry(widthFeet, depthFeet, heightFeet)
    case 'BARN':
      return getBarnRoofGeometry(widthFeet, depthFeet, heightFeet)
    case 'LEAN_TO':
      return getLeanToRoofGeometry(widthFeet, depthFeet, heightFeet)
  }
}

export interface DoorPosition3D {
  position: [number, number, number]
  rotation: [number, number, number]
  width: number
  height: number
}

export function getDoorPosition(
  door: DoorPlacement,
  size: ShedSize
): DoorPosition3D {
  const doorWidthFeet = (door.option?.widthInches ?? 36) / 12
  const doorHeightFeet = (door.option?.heightInches ?? 72) / 12

  const wallLength = (door.wall === 'FRONT' || door.wall === 'BACK')
    ? size.widthFeet
    : size.depthFeet

  // Convert offset percentage to position along wall
  const usableLength = wallLength - doorWidthFeet
  const offsetFromCenter = (door.offsetPercent / 100) * usableLength - usableLength / 2
  const doorCenterY = doorHeightFeet / 2

  const offset = 0.15 // Slight offset from wall surface

  switch (door.wall) {
    case 'FRONT':
      return {
        position: [offsetFromCenter, doorCenterY, size.depthFeet / 2 + offset],
        rotation: [0, 0, 0],
        width: doorWidthFeet,
        height: doorHeightFeet,
      }
    case 'BACK':
      return {
        position: [-offsetFromCenter, doorCenterY, -size.depthFeet / 2 - offset],
        rotation: [0, Math.PI, 0],
        width: doorWidthFeet,
        height: doorHeightFeet,
      }
    case 'LEFT':
      return {
        position: [-size.widthFeet / 2 - offset, doorCenterY, -offsetFromCenter],
        rotation: [0, Math.PI / 2, 0],
        width: doorWidthFeet,
        height: doorHeightFeet,
      }
    case 'RIGHT':
      return {
        position: [size.widthFeet / 2 + offset, doorCenterY, offsetFromCenter],
        rotation: [0, -Math.PI / 2, 0],
        width: doorWidthFeet,
        height: doorHeightFeet,
      }
  }
}

export interface WindowPosition3D {
  position: [number, number, number]
  rotation: [number, number, number]
  width: number
  height: number
}

export function getWindowPosition(
  window: WindowPlacement,
  size: ShedSize
): WindowPosition3D {
  const windowWidthFeet = (window.option?.widthInches ?? 24) / 12
  const windowHeightFeet = (window.option?.heightInches ?? 36) / 12

  const wallLength = (window.wall === 'FRONT' || window.wall === 'BACK')
    ? size.widthFeet
    : size.depthFeet

  // Convert offset percentage to position along wall
  const usableLength = wallLength - windowWidthFeet
  const offsetFromCenter = (window.offsetPercent / 100) * usableLength - usableLength / 2

  // Height position based on heightPercent
  const maxHeight = size.heightFeet - windowHeightFeet / 2 - 0.5
  const minHeight = windowHeightFeet / 2 + 1 // At least 1 foot from ground
  const windowCenterY = minHeight + (window.heightPercent / 100) * (maxHeight - minHeight)

  const offset = 0.15 // Slight offset from wall surface

  switch (window.wall) {
    case 'FRONT':
      return {
        position: [offsetFromCenter, windowCenterY, size.depthFeet / 2 + offset],
        rotation: [0, 0, 0],
        width: windowWidthFeet,
        height: windowHeightFeet,
      }
    case 'BACK':
      return {
        position: [-offsetFromCenter, windowCenterY, -size.depthFeet / 2 - offset],
        rotation: [0, Math.PI, 0],
        width: windowWidthFeet,
        height: windowHeightFeet,
      }
    case 'LEFT':
      return {
        position: [-size.widthFeet / 2 - offset, windowCenterY, -offsetFromCenter],
        rotation: [0, Math.PI / 2, 0],
        width: windowWidthFeet,
        height: windowHeightFeet,
      }
    case 'RIGHT':
      return {
        position: [size.widthFeet / 2 + offset, windowCenterY, offsetFromCenter],
        rotation: [0, -Math.PI / 2, 0],
        width: windowWidthFeet,
        height: windowHeightFeet,
      }
  }
}
