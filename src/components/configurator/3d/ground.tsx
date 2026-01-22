'use client'

import { useRef } from 'react'
import * as THREE from 'three'

export function Ground() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <group>
      {/* Main ground plane - subtle grass texture via color */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[35, 64]} />
        <meshStandardMaterial
          color="#5a7d5a"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Inner lighter grass area around shed */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        receiveShadow
      >
        <circleGeometry args={[15, 48]} />
        <meshStandardMaterial
          color="#6b8e6b"
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Gravel pad under shed */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color="#b8b0a8"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  )
}
