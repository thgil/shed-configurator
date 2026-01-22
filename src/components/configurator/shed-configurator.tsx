'use client'

import { useEffect } from 'react'
import { useConfiguratorStore } from '@/stores/configurator'
import { ShedPreview } from './shed-preview'
import { StyleSelector } from './style-selector'
import { SizeSelector } from './size-selector'
import { ColorSelector } from './color-selector'
import { FloorPlanEditor } from './floor-plan-editor'
import { PriceSummary } from './price-summary'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

// Demo data - would come from database in production
const demoData = {
  models: [
    { id: '1', name: 'Classic Gable', slug: 'classic', description: 'Traditional gable roof design', roofStyle: 'GABLE' as const, basePrice: 2999 },
    { id: '2', name: 'Rustic Barn', slug: 'barn', description: 'Charming barn-style gambrel roof', roofStyle: 'BARN' as const, basePrice: 3499 },
    { id: '3', name: 'Modern Lean-To', slug: 'lean-to', description: 'Contemporary single-slope design', roofStyle: 'LEAN_TO' as const, basePrice: 2799 },
  ],
  sizes: [
    { id: 's1', widthFeet: 8, depthFeet: 8, heightFeet: 7, displayName: "8'×8'", priceModifier: 0, maxDoors: 1, maxWindows: 2 },
    { id: 's2', widthFeet: 8, depthFeet: 10, heightFeet: 7, displayName: "8'×10'", priceModifier: 400, maxDoors: 1, maxWindows: 3 },
    { id: 's3', widthFeet: 10, depthFeet: 10, heightFeet: 7.5, displayName: "10'×10'", priceModifier: 800, maxDoors: 2, maxWindows: 4 },
    { id: 's4', widthFeet: 10, depthFeet: 12, heightFeet: 7.5, displayName: "10'×12'", priceModifier: 1200, maxDoors: 2, maxWindows: 4 },
    { id: 's5', widthFeet: 12, depthFeet: 12, heightFeet: 8, displayName: "12'×12'", priceModifier: 1800, maxDoors: 2, maxWindows: 5 },
    { id: 's6', widthFeet: 12, depthFeet: 16, heightFeet: 8, displayName: "12'×16'", priceModifier: 2600, maxDoors: 2, maxWindows: 6 },
  ],
  sidingOptions: [
    {
      id: 'sid1', name: 'LP SmartSide', material: 'Engineered Wood', priceModifier: 0,
      colors: [
        { id: 'c1', name: 'Barn Red', hexCode: '#8B2500' },
        { id: 'c2', name: 'Forest Green', hexCode: '#228B22' },
        { id: 'c3', name: 'Stone Gray', hexCode: '#708090' },
        { id: 'c4', name: 'Cream', hexCode: '#F5F5DC' },
        { id: 'c5', name: 'Colonial White', hexCode: '#FAFAFA' },
        { id: 'c6', name: 'Autumn Brown', hexCode: '#8B4513' },
      ],
    },
  ],
  shingleOptions: [
    {
      id: 'sh1', name: 'Architectural Shingles', priceModifier: 0,
      colors: [
        { id: 'sc1', name: 'Charcoal', hexCode: '#36454F' },
        { id: 'sc2', name: 'Weathered Wood', hexCode: '#8B7355' },
        { id: 'sc3', name: 'Desert Tan', hexCode: '#C4A76A' },
        { id: 'sc4', name: 'Onyx Black', hexCode: '#353839' },
      ],
    },
  ],
  doorOptions: [
    { id: 'd1', name: 'Single Entry Door', type: 'SINGLE_ENTRY' as const, widthInches: 36, heightInches: 72, imageUrl: null, priceEach: 0 },
    { id: 'd2', name: 'Double Entry Door', type: 'DOUBLE_ENTRY' as const, widthInches: 60, heightInches: 72, imageUrl: null, priceEach: 250 },
    { id: 'd3', name: 'Barn Door', type: 'BARN_DOOR' as const, widthInches: 48, heightInches: 72, imageUrl: null, priceEach: 350 },
  ],
  windowOptions: [
    { id: 'w1', name: '24×36 Single Hung', widthInches: 24, heightInches: 36, imageUrl: null, priceEach: 150 },
    { id: 'w2', name: '30×36 Single Hung', widthInches: 30, heightInches: 36, imageUrl: null, priceEach: 175 },
  ],
}

export function ShedConfigurator() {
  const {
    setOptions,
    setLoading,
    isLoading,
    selectedModel,
    selectedSize,
    selectModel,
    selectSize,
    selectSidingOption,
    selectShingleOption,
  } = useConfiguratorStore()

  useEffect(() => {
    // Load options and auto-select defaults
    setOptions(demoData)

    // Auto-select first model, size, siding, and shingle
    if (demoData.models.length > 0) {
      selectModel(demoData.models[0])
    }
    if (demoData.sizes.length > 0) {
      selectSize(demoData.sizes[2]) // Default to 10x10
    }
    if (demoData.sidingOptions.length > 0) {
      selectSidingOption(demoData.sidingOptions[0])
    }
    if (demoData.shingleOptions.length > 0) {
      selectShingleOption(demoData.shingleOptions[0])
    }

    setLoading(false)
  }, [setOptions, setLoading, selectModel, selectSize, selectSidingOption, selectShingleOption])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto" />
          <p className="mt-4 text-stone-500">Loading configurator...</p>
        </div>
      </div>
    )
  }

  const canAddToCart = selectedModel && selectedSize

  return (
    <div className="space-y-8">
      {/* Top Row: Preview + Floor Plan */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Shed Preview (Photo) */}
        <div>
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Preview</h2>
          <ShedPreview />
        </div>

        {/* Floor Plan Editor */}
        <div>
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Design Your Layout</h2>
          <FloorPlanEditor />
        </div>
      </div>

      {/* Configuration Options Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Style Selector */}
        <div>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Style</h3>
          <StyleSelector />
        </div>

        {/* Size Selector */}
        <div>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Size</h3>
          <SizeSelector />
        </div>

        {/* Color Selector */}
        <div>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Colors</h3>
          <ColorSelector />
        </div>
      </div>

      {/* Price Summary & CTA */}
      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <PriceSummary />

          <Button
            size="lg"
            className="h-14 text-lg px-12"
            disabled={!canAddToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
