'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { Walls } from './walls'
import { Roof } from './roof'
import {
  InteractiveDoor,
  InteractiveWindow,
  ClickableWall,
  ResizeHandles,
  RoofPicker,
} from './interactive'
import type { WallPosition } from '@/types/configurator'

interface ShedModelProps {
  onDragStart?: () => void
  onDragEnd?: () => void
}

const WALL_POSITIONS: WallPosition[] = ['FRONT', 'BACK', 'LEFT', 'RIGHT']

export function ShedModel({ onDragStart, onDragEnd }: ShedModelProps) {
  const {
    selectedModel,
    selectedSize,
    selectedSidingColor,
    selectedShingleColor,
    doors,
    windows,
  } = useConfiguratorStore()

  // Default values if nothing selected
  const roofStyle = selectedModel?.roofStyle ?? 'GABLE'
  const widthFeet = selectedSize?.widthFeet ?? 10
  const depthFeet = selectedSize?.depthFeet ?? 10
  const heightFeet = selectedSize?.heightFeet ?? 7.5
  const sidingColor = selectedSidingColor?.hexCode ?? '#8B7355'
  const roofColor = selectedShingleColor?.hexCode ?? '#3d3d3d'

  return (
    <group position={[0, 0, 0]}>
      {/* Walls */}
      <Walls
        widthFeet={widthFeet}
        depthFeet={depthFeet}
        heightFeet={heightFeet}
        color={sidingColor}
      />

      {/* Clickable wall overlays for add mode */}
      {selectedSize && WALL_POSITIONS.map((wall) => (
        <ClickableWall
          key={wall}
          wall={wall}
          size={selectedSize}
        />
      ))}

      {/* Roof */}
      <Roof
        roofStyle={roofStyle}
        widthFeet={widthFeet}
        depthFeet={depthFeet}
        heightFeet={heightFeet}
        color={roofColor}
      />

      {/* Roof style picker */}
      <RoofPicker heightFeet={heightFeet} />

      {/* Interactive Doors */}
      {selectedSize && doors.map((door) => (
        <InteractiveDoor
          key={door.id}
          door={door}
          size={selectedSize}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}

      {/* Interactive Windows */}
      {selectedSize && windows.map((window) => (
        <InteractiveWindow
          key={window.id}
          window={window}
          size={selectedSize}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}

      {/* Resize handles */}
      <ResizeHandles
        widthFeet={widthFeet}
        depthFeet={depthFeet}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </group>
  )
}
