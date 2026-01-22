'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { Walls } from './walls'
import { Roof } from './roof'
import { Door } from './door'
import { Window } from './window'

export function ShedModel() {
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

      {/* Roof */}
      <Roof
        roofStyle={roofStyle}
        widthFeet={widthFeet}
        depthFeet={depthFeet}
        heightFeet={heightFeet}
        color={roofColor}
      />

      {/* Doors */}
      {selectedSize && doors.map((door) => (
        <Door key={door.id} door={door} size={selectedSize} />
      ))}

      {/* Windows */}
      {selectedSize && windows.map((window) => (
        <Window key={window.id} window={window} size={selectedSize} />
      ))}
    </group>
  )
}
