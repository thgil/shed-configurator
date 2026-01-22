'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import type { WallPosition } from '@/types/configurator'
import { getWallDimensions } from '@/lib/shed-geometry'

interface WallsProps {
  widthFeet: number
  depthFeet: number
  heightFeet: number
  color: string
}

const WALL_POSITIONS: WallPosition[] = ['FRONT', 'BACK', 'LEFT', 'RIGHT']

export function Walls({ widthFeet, depthFeet, heightFeet, color }: WallsProps) {
  const walls = useMemo(() => {
    return WALL_POSITIONS.map((wall) => ({
      wall,
      ...getWallDimensions(wall, widthFeet, depthFeet, heightFeet),
    }))
  }, [widthFeet, depthFeet, heightFeet])

  // Create a slightly varied color for depth
  const baseColor = useMemo(() => new THREE.Color(color), [color])

  return (
    <group>
      {walls.map(({ wall, width, height, depth, position }, index) => {
        // Subtle color variation per wall for depth
        const shade = wall === 'LEFT' || wall === 'BACK' ? 0.92 : 1.0
        const wallColor = baseColor.clone().multiplyScalar(shade)

        return (
          <mesh key={wall} position={position} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>
        )
      })}

      {/* Base trim */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[widthFeet + 0.3, 0.3, depthFeet + 0.3]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Top trim / fascia */}
      <mesh position={[0, heightFeet - 0.1, 0]} castShadow>
        <boxGeometry args={[widthFeet + 0.15, 0.2, depthFeet + 0.15]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.6} metalness={0} />
      </mesh>
    </group>
  )
}
