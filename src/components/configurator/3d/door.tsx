'use client'

import { useMemo } from 'react'
import type { DoorPlacement, ShedSize } from '@/types/configurator'
import { getDoorPosition } from '@/lib/shed-geometry'

interface DoorProps {
  door: DoorPlacement
  size: ShedSize
}

export function Door({ door, size }: DoorProps) {
  const { position, rotation, width, height } = useMemo(
    () => getDoorPosition(door, size),
    [door, size]
  )

  const doorDepth = 0.12
  const frameInset = 0.08
  const panelDepth = 0.04

  return (
    <group position={position} rotation={rotation}>
      {/* Door frame - white trim */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.15, height + 0.08, doorDepth]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.5} metalness={0} />
      </mesh>

      {/* Main door panel */}
      <mesh position={[0, 0, panelDepth]} castShadow>
        <boxGeometry args={[width - frameInset, height - frameInset, doorDepth]} />
        <meshStandardMaterial
          color="#4a3728"
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {/* Door panels - decorative raised sections */}
      {[-0.3, 0.3].map((yOffset, i) => (
        <mesh key={i} position={[0, height * yOffset, panelDepth + doorDepth / 2 + 0.01]} castShadow>
          <boxGeometry args={[width * 0.7, height * 0.28, 0.03]} />
          <meshStandardMaterial
            color="#3d2e22"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Door handle - modern lever style */}
      <group position={[width * 0.38, 0, panelDepth + doorDepth / 2 + 0.03]}>
        {/* Handle base plate */}
        <mesh>
          <boxGeometry args={[0.08, 0.2, 0.015]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Handle lever */}
        <mesh position={[0.06, 0, 0.02]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.04]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
