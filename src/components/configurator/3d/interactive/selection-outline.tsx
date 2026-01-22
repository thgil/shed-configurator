'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SelectionOutlineProps {
  width: number
  height: number
  depth?: number
  color?: string
}

export function SelectionOutline({ width, height, depth = 0.2, color = '#f59e0b' }: SelectionOutlineProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[width + 0.15, height + 0.15, depth + 0.1]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        side={THREE.BackSide}
      />
    </mesh>
  )
}
