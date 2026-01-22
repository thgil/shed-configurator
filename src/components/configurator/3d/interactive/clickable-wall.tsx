'use client'

import { useState, useCallback, useMemo } from 'react'
import { useThree, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { WallPosition, ShedSize } from '@/types/configurator'
import { getWallDimensions, worldPositionToOffsetPercent } from '@/lib/shed-geometry'
import { useConfiguratorStore } from '@/stores/configurator'

interface ClickableWallProps {
  wall: WallPosition
  size: ShedSize
}

export function ClickableWall({ wall, size }: ClickableWallProps) {
  const {
    editMode3D,
    setEditMode3D,
    addDoor,
    addWindow,
    updateDoor,
    updateWindow,
    doorOptions,
    windowOptions,
    setSelectedItemId,
  } = useConfiguratorStore()

  const [isHovered, setIsHovered] = useState(false)
  const { camera, gl } = useThree()

  const isActive = editMode3D === 'add-door' || editMode3D === 'add-window'

  const wallDim = useMemo(
    () => getWallDimensions(wall, size.widthFeet, size.depthFeet, size.heightFeet),
    [wall, size]
  )

  // Position the overlay slightly in front of the wall
  const overlayPosition = useMemo((): [number, number, number] => {
    const offset = 0.02
    switch (wall) {
      case 'FRONT':
        return [wallDim.position[0], wallDim.position[1], wallDim.position[2] + offset]
      case 'BACK':
        return [wallDim.position[0], wallDim.position[1], wallDim.position[2] - offset]
      case 'LEFT':
        return [wallDim.position[0] - offset, wallDim.position[1], wallDim.position[2]]
      case 'RIGHT':
        return [wallDim.position[0] + offset, wallDim.position[1], wallDim.position[2]]
    }
  }, [wall, wallDim])

  // Get overlay dimensions (swap width/depth for side walls)
  const overlaySize = useMemo((): [number, number] => {
    if (wall === 'FRONT' || wall === 'BACK') {
      return [wallDim.width, wallDim.height]
    } else {
      return [wallDim.depth, wallDim.height]
    }
  }, [wall, wallDim])

  // Get overlay rotation
  const overlayRotation = useMemo((): [number, number, number] => {
    switch (wall) {
      case 'FRONT':
        return [0, 0, 0]
      case 'BACK':
        return [0, Math.PI, 0]
      case 'LEFT':
        return [0, Math.PI / 2, 0]
      case 'RIGHT':
        return [0, -Math.PI / 2, 0]
    }
  }, [wall])

  // Get wall plane for raycasting
  const wallPlane = useMemo(() => {
    const normal = new THREE.Vector3()
    switch (wall) {
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
  }, [wall, size])

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    if (!isActive) return
    e.stopPropagation()

    // Raycast to get click position on wall
    const raycaster = new THREE.Raycaster()
    const rect = gl.domElement.getBoundingClientRect()
    const pointer = new THREE.Vector2(
      ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1
    )
    raycaster.setFromCamera(pointer, camera)

    const intersection = new THREE.Vector3()
    if (!raycaster.ray.intersectPlane(wallPlane, intersection)) return

    if (editMode3D === 'add-door') {
      const doorWidthFeet = (doorOptions[0]?.widthInches ?? 36) / 12
      const offsetPercent = worldPositionToOffsetPercent(
        intersection.x,
        intersection.z,
        wall,
        size,
        doorWidthFeet
      )

      // Add door and update its position
      addDoor(wall)
      const newDoors = useConfiguratorStore.getState().doors
      const newDoor = newDoors[newDoors.length - 1]
      if (newDoor) {
        updateDoor(newDoor.id, { offsetPercent })
        setSelectedItemId(newDoor.id)
      }
    } else if (editMode3D === 'add-window') {
      const windowWidthFeet = (windowOptions[0]?.widthInches ?? 24) / 12
      const offsetPercent = worldPositionToOffsetPercent(
        intersection.x,
        intersection.z,
        wall,
        size,
        windowWidthFeet
      )

      // Add window and update its position
      addWindow(wall)
      const newWindows = useConfiguratorStore.getState().windows
      const newWindow = newWindows[newWindows.length - 1]
      if (newWindow) {
        updateWindow(newWindow.id, { offsetPercent })
        setSelectedItemId(newWindow.id)
      }
    }

    // Return to view mode
    setEditMode3D('view')
  }, [
    isActive,
    gl,
    camera,
    wallPlane,
    editMode3D,
    wall,
    size,
    doorOptions,
    windowOptions,
    addDoor,
    addWindow,
    updateDoor,
    updateWindow,
    setSelectedItemId,
    setEditMode3D,
  ])

  if (!isActive) return null

  const hoverColor = editMode3D === 'add-door' ? '#f59e0b' : '#38bdf8'

  return (
    <mesh
      position={overlayPosition}
      rotation={overlayRotation}
      onClick={handleClick}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={overlaySize} />
      <meshBasicMaterial
        color={hoverColor}
        transparent
        opacity={isHovered ? 0.4 : 0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
