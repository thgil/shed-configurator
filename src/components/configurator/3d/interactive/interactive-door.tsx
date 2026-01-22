'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useThree, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { DoorPlacement, ShedSize } from '@/types/configurator'
import { getDoorPosition, worldPositionToOffsetPercent } from '@/lib/shed-geometry'
import { useConfiguratorStore } from '@/stores/configurator'
import { SelectionOutline } from './selection-outline'

interface InteractiveDoorProps {
  door: DoorPlacement
  size: ShedSize
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function InteractiveDoor({ door, size, onDragStart, onDragEnd }: InteractiveDoorProps) {
  const { selectedItemId, setSelectedItemId, updateDoor, editMode3D } = useConfiguratorStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()

  const isSelected = selectedItemId === door.id
  const isInteractive = editMode3D === 'view'

  const { position, rotation, width, height } = useMemo(
    () => getDoorPosition(door, size),
    [door, size]
  )

  const doorDepth = 0.12
  const frameInset = 0.08
  const panelDepth = 0.04

  // Get wall plane for raycasting during drag
  const wallPlane = useMemo(() => {
    const normal = new THREE.Vector3()

    switch (door.wall) {
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
  }, [door.wall, size])

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
        const doorWidthFeet = (door.option?.widthInches ?? 36) / 12
        const newOffset = worldPositionToOffsetPercent(
          intersection.x,
          intersection.z,
          door.wall,
          size,
          doorWidthFeet
        )
        updateDoor(door.id, { offsetPercent: newOffset })
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
  }, [isDragging, gl, camera, wallPlane, door, size, updateDoor, onDragEnd])

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (!isInteractive) return
    setIsDragging(true)
    setSelectedItemId(door.id)
    onDragStart?.()
  }, [isInteractive, door.id, setSelectedItemId, onDragStart])

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()  // ALWAYS stop propagation first
    if (!isInteractive) return
    setSelectedItemId(isSelected ? null : door.id)
  }, [isInteractive, isSelected, door.id, setSelectedItemId])

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
      {isSelected && <SelectionOutline width={width + 0.15} height={height + 0.08} depth={doorDepth} />}

      {/* Door frame - white trim */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.15, height + 0.08, doorDepth]} />
        <meshStandardMaterial
          color={isHovered && isInteractive ? '#ffffff' : '#f5f5f0'}
          roughness={0.5}
          metalness={0}
          emissive={isHovered && isInteractive ? '#f59e0b' : '#000000'}
          emissiveIntensity={isHovered && isInteractive ? 0.15 : 0}
        />
      </mesh>

      {/* Main door panel */}
      <mesh position={[0, 0, panelDepth]} castShadow>
        <boxGeometry args={[width - frameInset, height - frameInset, doorDepth]} />
        <meshStandardMaterial
          color="#4a3728"
          roughness={0.75}
          metalness={0.05}
          transparent={isDragging}
          opacity={isDragging ? 0.7 : 1}
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

      {/* Door handle */}
      <group position={[width * 0.38, 0, panelDepth + doorDepth / 2 + 0.03]}>
        <mesh>
          <boxGeometry args={[0.08, 0.2, 0.015]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.06, 0, 0.02]}>
          <boxGeometry args={[0.12, 0.04, 0.04]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
