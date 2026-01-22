'use client'

import { useMemo } from 'react'
import type { WindowPlacement, ShedSize } from '@/types/configurator'
import { getWindowPosition } from '@/lib/shed-geometry'

interface WindowProps {
  window: WindowPlacement
  size: ShedSize
}

export function Window({ window, size }: WindowProps) {
  const { position, rotation, width, height } = useMemo(
    () => getWindowPosition(window, size),
    [window, size]
  )

  const windowDepth = 0.08
  const frameWidth = 0.08
  const mullionWidth = 0.04

  return (
    <group position={position} rotation={rotation}>
      {/* Outer frame - white trim */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.12, height + 0.12, windowDepth]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.5} metalness={0} />
      </mesh>

      {/* Inner frame */}
      <mesh position={[0, 0, 0.01]} castShadow>
        <boxGeometry args={[width, height, windowDepth]} />
        <meshStandardMaterial color="#e8e8e0" roughness={0.5} metalness={0} />
      </mesh>

      {/* Glass panes - 4 pane window */}
      {[
        [-width / 4 + mullionWidth / 4, height / 4 - mullionWidth / 4],
        [width / 4 - mullionWidth / 4, height / 4 - mullionWidth / 4],
        [-width / 4 + mullionWidth / 4, -height / 4 + mullionWidth / 4],
        [width / 4 - mullionWidth / 4, -height / 4 + mullionWidth / 4],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, windowDepth / 2 + 0.01]}>
          <planeGeometry args={[
            width / 2 - frameWidth - mullionWidth / 2,
            height / 2 - frameWidth - mullionWidth / 2,
          ]} />
          <meshStandardMaterial
            color="#a8d4e6"
            transparent
            opacity={0.7}
            metalness={0.2}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* Vertical mullion (center divider) */}
      <mesh position={[0, 0, windowDepth / 2 + 0.015]} castShadow>
        <boxGeometry args={[mullionWidth, height - frameWidth * 2, 0.025]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.5} metalness={0} />
      </mesh>

      {/* Horizontal mullion */}
      <mesh position={[0, 0, windowDepth / 2 + 0.015]} castShadow>
        <boxGeometry args={[width - frameWidth * 2, mullionWidth, 0.025]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.5} metalness={0} />
      </mesh>

      {/* Window sill */}
      <mesh position={[0, -height / 2 - 0.06, 0.06]} castShadow>
        <boxGeometry args={[width + 0.2, 0.06, 0.12]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.5} metalness={0} />
      </mesh>
    </group>
  )
}
