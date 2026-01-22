'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useThree, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { WindowPlacement, ShedSize } from '@/types/configurator'
import { getWindowPosition, worldPositionToOffsetPercent } from '@/lib/shed-geometry'
import { useConfiguratorStore } from '@/stores/configurator'
import { SelectionOutline } from './selection-outline'

interface InteractiveWindowProps {
  window: WindowPlacement
  size: ShedSize
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function InteractiveWindow({ window, size, onDragStart, onDragEnd }: InteractiveWindowProps) {
  const { selectedItemId, setSelectedItemId, updateWindow, editMode3D } = useConfiguratorStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()

  const isSelected = selectedItemId === window.id
  const isInteractive = editMode3D === 'view'

  const { position, rotation, width, height } = useMemo(
    () => getWindowPosition(window, size),
    [window, size]
  )

  const windowDepth = 0.08
  const frameWidth = 0.08
  const mullionWidth = 0.04

  // Get wall plane for raycasting during drag
  const wallPlane = useMemo(() => {
    const normal = new THREE.Vector3()

    switch (window.wall) {
      case 'FRONT':
        normal.set(0, 0, 1)
        return new THREE.Plane(normal, -size.depthFeet / 2)
      case 'BACK':
        normal.set(0, 0, -1)
        return new THREE.Plane(normal, -size.depthFeet / 2)
      case 'LEFT':
        normal.set(-1, 0, 0)
        return new THREE.Plane(normal, -size.widthFeet / 2)
      case 'RIGHT':
        normal.set(1, 0, 0)
        return new THREE.Plane(normal, -size.widthFeet / 2)
    }
  }, [window.wall, size])

  // Use window-level events for reliable drag tracking
  useEffect(() => {
    if (!isDragging) return

    const handleWindowMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const pointer = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(pointer, camera)

      const intersection = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(wallPlane, intersection)) {
        const windowWidthFeet = (window.option?.widthInches ?? 24) / 12
        const newOffset = worldPositionToOffsetPercent(
          intersection.x,
          intersection.z,
          window.wall,
          size,
          windowWidthFeet
        )
        updateWindow(window.id, { offsetPercent: newOffset })
      }
    }

    const handleWindowUp = () => {
      setIsDragging(false)
      onDragEnd?.()
    }

    window.addEventListener('pointermove', handleWindowMove)
    window.addEventListener('pointerup', handleWindowUp)

    return () => {
      window.removeEventListener('pointermove', handleWindowMove)
      window.removeEventListener('pointerup', handleWindowUp)
    }
  }, [isDragging, gl, camera, wallPlane, window, size, updateWindow, onDragEnd])

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (!isInteractive) return
    setIsDragging(true)
    setSelectedItemId(window.id)
    onDragStart?.()
  }, [isInteractive, window.id, setSelectedItemId, onDragStart])

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()  // ALWAYS stop propagation first
    if (!isInteractive) return
    setSelectedItemId(isSelected ? null : window.id)
  }, [isInteractive, isSelected, window.id, setSelectedItemId])

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => isInteractive && setIsHovered(true)}
      onPointerLeave={() => !isDragging && setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Selection outline */}
      {isSelected && <SelectionOutline width={width + 0.12} height={height + 0.12} depth={windowDepth} color="#38bdf8" />}

      {/* Outer frame - white trim */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.12, height + 0.12, windowDepth]} />
        <meshStandardMaterial
          color={isHovered && isInteractive ? '#ffffff' : '#f5f5f0'}
          roughness={0.5}
          metalness={0}
          emissive={isHovered && isInteractive ? '#38bdf8' : '#000000'}
          emissiveIntensity={isHovered && isInteractive ? 0.15 : 0}
        />
      </mesh>

      {/* Inner frame */}
      <mesh position={[0, 0, 0.01]} castShadow>
        <boxGeometry args={[width, height, windowDepth]} />
        <meshStandardMaterial
          color="#e8e8e0"
          roughness={0.5}
          metalness={0}
          transparent={isDragging}
          opacity={isDragging ? 0.7 : 1}
        />
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
            opacity={isDragging ? 0.4 : 0.7}
            metalness={0.2}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* Vertical mullion */}
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
