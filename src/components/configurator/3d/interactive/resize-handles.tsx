'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { useThree, useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfiguratorStore } from '@/stores/configurator'

type Corner = 'NW' | 'NE' | 'SW' | 'SE'

interface ResizeHandleProps {
  corner: Corner
  widthFeet: number
  depthFeet: number
  onDragStart?: () => void
  onDragEnd?: () => void
}

function ResizeHandle({ corner, widthFeet, depthFeet, onDragStart, onDragEnd }: ResizeHandleProps) {
  const { selectNearestSize, editMode3D } = useConfiguratorStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, gl } = useThree()

  const isActive = editMode3D === 'resize'

  // Calculate corner position
  const position = useMemo((): [number, number, number] => {
    const x = corner.includes('W') ? -widthFeet / 2 : widthFeet / 2
    const z = corner.includes('N') ? -depthFeet / 2 : depthFeet / 2
    return [x, 0.3, z] // Slightly above ground
  }, [corner, widthFeet, depthFeet])

  // Ground plane for raycasting
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])

  // Initial drag position for calculating delta
  const dragStart = useRef<{ x: number; z: number; width: number; depth: number } | null>(null)

  // Animate handle
  useFrame(() => {
    if (!meshRef.current || !isActive) return
    const scale = isHovered || isDragging ? 1.3 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15)
  })

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()  // ALWAYS stop propagation first
    if (!isActive) return
    setIsDragging(true)
    onDragStart?.()

    // Raycast to get initial position
    const raycaster = new THREE.Raycaster()
    const rect = gl.domElement.getBoundingClientRect()
    const pointer = new THREE.Vector2(
      ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1
    )
    raycaster.setFromCamera(pointer, camera)
    const intersection = new THREE.Vector3()
    if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
      dragStart.current = {
        x: intersection.x,
        z: intersection.z,
        width: widthFeet,
        depth: depthFeet,
      }
    }

    ;(e.nativeEvent.target as HTMLElement)?.setPointerCapture?.(e.nativeEvent.pointerId)
  }, [isActive, gl, camera, groundPlane, widthFeet, depthFeet, onDragStart])

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !isActive || !dragStart.current) return
    e.stopPropagation()

    // Raycast to ground plane
    const raycaster = new THREE.Raycaster()
    const rect = gl.domElement.getBoundingClientRect()
    const pointer = new THREE.Vector2(
      ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1
    )
    raycaster.setFromCamera(pointer, camera)
    const intersection = new THREE.Vector3()

    if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
      const deltaX = intersection.x - dragStart.current.x
      const deltaZ = intersection.z - dragStart.current.z

      // Calculate new dimensions based on which corner is being dragged
      let newWidth = dragStart.current.width
      let newDepth = dragStart.current.depth

      if (corner.includes('E')) {
        newWidth = dragStart.current.width + deltaX * 2
      } else {
        newWidth = dragStart.current.width - deltaX * 2
      }

      if (corner.includes('S')) {
        newDepth = dragStart.current.depth + deltaZ * 2
      } else {
        newDepth = dragStart.current.depth - deltaZ * 2
      }

      // Clamp to reasonable bounds
      newWidth = Math.max(6, Math.min(20, newWidth))
      newDepth = Math.max(6, Math.min(20, newDepth))

      // Snap to nearest predefined size
      selectNearestSize(newWidth, newDepth)
    }
  }, [isDragging, isActive, gl, camera, groundPlane, corner, selectNearestSize])

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return
    e.stopPropagation()
    setIsDragging(false)
    dragStart.current = null
    onDragEnd?.()
    ;(e.nativeEvent.target as HTMLElement)?.releasePointerCapture?.(e.nativeEvent.pointerId)
  }, [isDragging, onDragEnd])

  if (!isActive) return null

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial
        color={isDragging ? '#f59e0b' : isHovered ? '#fbbf24' : '#78716c'}
        emissive={isHovered || isDragging ? '#f59e0b' : '#000000'}
        emissiveIntensity={isHovered || isDragging ? 0.3 : 0}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>
  )
}

interface ResizeHandlesProps {
  widthFeet: number
  depthFeet: number
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function ResizeHandles({ widthFeet, depthFeet, onDragStart, onDragEnd }: ResizeHandlesProps) {
  const corners: Corner[] = ['NW', 'NE', 'SW', 'SE']

  return (
    <group>
      {corners.map((corner) => (
        <ResizeHandle
          key={corner}
          corner={corner}
          widthFeet={widthFeet}
          depthFeet={depthFeet}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </group>
  )
}
