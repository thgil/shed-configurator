'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Sky } from '@react-three/drei'
import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { ShedModel } from './shed-model'
import { Ground } from './ground'

interface Shed3DViewProps {
  className?: string
}

function SceneLighting() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.3} />

      {/* Main sun light - warm and directional */}
      <directionalLight
        position={[15, 25, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001}
        color="#fff5e6"
      />

      {/* Fill light from opposite side - cooler */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.4}
        color="#e6f0ff"
      />

      {/* Subtle rim light */}
      <directionalLight
        position={[0, 5, -15]}
        intensity={0.2}
        color="#ffffff"
      />
    </>
  )
}

function LoadingPlaceholder() {
  return (
    <mesh position={[0, 2, 0]}>
      <boxGeometry args={[4, 4, 4]} />
      <meshStandardMaterial color="#e5e5e5" />
    </mesh>
  )
}

export function Shed3DView({ className }: Shed3DViewProps) {
  const { selectedModel, selectedSize } = useConfiguratorStore()

  return (
    <div className={cn("rounded-2xl overflow-hidden bg-stone-100", className)}>
      {/* 3D Canvas */}
      <div className="relative" style={{ height: '420px' }}>
        <Canvas
          shadows
          camera={{ position: [18, 12, 18], fov: 40 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          {/* Sky background */}
          <color attach="background" args={['#f0f4f8']} />
          <Sky
            distance={450000}
            sunPosition={[100, 50, 100]}
            inclination={0.6}
            azimuth={0.25}
            rayleigh={0.5}
          />

          {/* Fog for depth */}
          <fog attach="fog" args={['#f0f4f8', 40, 100]} />

          {/* Lighting */}
          <SceneLighting />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            minDistance={12}
            maxDistance={35}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.3}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />

          {/* Scene */}
          <Suspense fallback={<LoadingPlaceholder />}>
            <ShedModel />
            <Ground />

            {/* Contact shadows for grounding */}
            <ContactShadows
              position={[0, -0.01, 0]}
              opacity={0.4}
              scale={40}
              blur={2}
              far={15}
              color="#1a1a2e"
            />
          </Suspense>
        </Canvas>

        {/* Overlay badges - minimal and refined */}
        <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
          <div className="flex items-end justify-between">
            {/* Drag hint */}
            <div className="pointer-events-auto">
              <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
                Drag to rotate
              </span>
            </div>

            {/* Size badge */}
            {selectedSize && (
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-stone-200/50">
                <span className="text-sm font-medium text-stone-700">
                  {selectedSize.displayName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Style badge - top left */}
        {selectedModel && (
          <div className="absolute top-4 left-4">
            <div className="bg-stone-900 text-white px-3 py-1.5 rounded-lg shadow-lg">
              <span className="text-sm font-medium tracking-wide">
                {selectedModel.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
