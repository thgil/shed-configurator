'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import type { RoofStyle } from '@/types/configurator'
import { getRoofGeometry } from '@/lib/shed-geometry'

interface RoofProps {
  roofStyle: RoofStyle
  widthFeet: number
  depthFeet: number
  heightFeet: number
  color: string
}

export function Roof({ roofStyle, widthFeet, depthFeet, heightFeet, color }: RoofProps) {
  const geometries = useMemo(() => {
    const panels = getRoofGeometry(roofStyle, widthFeet, depthFeet, heightFeet)

    return panels.map((panel, index) => {
      const geometry = new THREE.BufferGeometry()
      const vertices = new Float32Array(panel.vertices)
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      geometry.setIndex(panel.indices)
      geometry.computeVertexNormals()

      return { geometry, key: `roof-panel-${index}` }
    })
  }, [roofStyle, widthFeet, depthFeet, heightFeet])

  const baseColor = useMemo(() => new THREE.Color(color), [color])

  return (
    <group>
      {geometries.map(({ geometry, key }, index) => {
        // Alternate shading for visual depth
        const shade = index % 2 === 0 ? 1.0 : 0.9
        const panelColor = baseColor.clone().multiplyScalar(shade)

        return (
          <mesh key={key} geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={panelColor}
              side={THREE.DoubleSide}
              roughness={0.85}
              metalness={0.1}
            />
          </mesh>
        )
      })}

      {/* Ridge cap for gable and barn roofs */}
      {(roofStyle === 'GABLE' || roofStyle === 'BARN') && (
        <RidgeCap
          widthFeet={widthFeet}
          depthFeet={depthFeet}
          heightFeet={heightFeet}
          roofStyle={roofStyle}
          color={color}
        />
      )}
    </group>
  )
}

function RidgeCap({
  widthFeet,
  depthFeet,
  heightFeet,
  roofStyle,
  color,
}: {
  widthFeet: number
  depthFeet: number
  heightFeet: number
  roofStyle: RoofStyle
  color: string
}) {
  const peakHeight = roofStyle === 'BARN' ? heightFeet * 0.45 : heightFeet * 0.35
  const overhang = 0.5

  return (
    <mesh
      position={[0, heightFeet + peakHeight + 0.05, 0]}
      castShadow
    >
      <boxGeometry args={[0.3, 0.15, depthFeet + overhang * 2 + 0.2]} />
      <meshStandardMaterial
        color={new THREE.Color(color).multiplyScalar(0.85)}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}
