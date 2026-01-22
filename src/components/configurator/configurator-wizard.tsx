'use client'

import { useEffect } from 'react'
import { useConfiguratorStore } from '@/stores/configurator'
import { DesignPhase } from './design-phase'
import { CustomizePhase } from './customize-phase'
import { calculatePrice } from '@/lib/pricing'
import { formatPriceDecimal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ShoppingCart, PenTool, Palette } from 'lucide-react'

// Demo data - would come from database in production
const demoData = {
  models: [
    { id: '1', name: 'Classic Gable', slug: 'classic', description: 'Traditional gable roof design', roofStyle: 'GABLE' as const, basePrice: 2999 },
    { id: '2', name: 'Rustic Barn', slug: 'barn', description: 'Charming barn-style gambrel roof', roofStyle: 'BARN' as const, basePrice: 3499 },
    { id: '3', name: 'Modern Lean-To', slug: 'lean-to', description: 'Contemporary single-slope design', roofStyle: 'LEAN_TO' as const, basePrice: 2799 },
  ],
  sizes: [
    { id: 's1', widthFeet: 8, depthFeet: 8, heightFeet: 7, displayName: "8'x8'", priceModifier: 0, maxDoors: 1, maxWindows: 2 },
    { id: 's2', widthFeet: 8, depthFeet: 10, heightFeet: 7, displayName: "8'x10'", priceModifier: 400, maxDoors: 1, maxWindows: 3 },
    { id: 's3', widthFeet: 10, depthFeet: 10, heightFeet: 7.5, displayName: "10'x10'", priceModifier: 800, maxDoors: 2, maxWindows: 4 },
    { id: 's4', widthFeet: 10, depthFeet: 12, heightFeet: 7.5, displayName: "10'x12'", priceModifier: 1200, maxDoors: 2, maxWindows: 4 },
    { id: 's5', widthFeet: 12, depthFeet: 12, heightFeet: 8, displayName: "12'x12'", priceModifier: 1800, maxDoors: 2, maxWindows: 5 },
    { id: 's6', widthFeet: 12, depthFeet: 16, heightFeet: 8, displayName: "12'x16'", priceModifier: 2600, maxDoors: 2, maxWindows: 6 },
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
    { id: 'w1', name: '24x36 Single Hung', widthInches: 24, heightInches: 36, imageUrl: null, priceEach: 150 },
    { id: 'w2', name: '30x36 Single Hung', widthInches: 30, heightInches: 36, imageUrl: null, priceEach: 175 },
  ],
}

// New 2-phase steps
const PHASES = [
  { id: 'design', label: 'Design Layout', description: 'Style, size & floor plan', icon: PenTool },
  { id: 'customize', label: 'Customize', description: '3D preview & colors', icon: Palette },
] as const

// Phase indicator component
function PhaseIndicator() {
  const { currentStep } = useConfiguratorStore()

  return (
    <div className="flex items-center justify-center gap-4">
      {PHASES.map((phase, index) => {
        const isActive = currentStep === index
        const isCompleted = currentStep > index
        const Icon = phase.icon

        return (
          <div key={phase.id} className="flex items-center">
            {/* Phase circle */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive
                    ? "bg-amber-500 text-white shadow-lg"
                    : isCompleted
                      ? "bg-amber-600 text-white"
                      : "bg-stone-200 text-stone-500"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "transition-colors",
                isActive ? "text-stone-900" : "text-stone-500"
              )}>
                <p className="font-semibold text-sm">{phase.label}</p>
                <p className="text-xs hidden sm:block">{phase.description}</p>
              </div>
            </div>

            {/* Connector line */}
            {index < PHASES.length - 1 && (
              <div className={cn(
                "w-12 sm:w-20 h-1 mx-4 rounded-full transition-colors",
                currentStep > index ? "bg-amber-500" : "bg-stone-200"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Bottom navigation component
function PhaseNavigation() {
  const store = useConfiguratorStore()
  const { currentStep, prevStep, nextStep, selectedModel, selectedSize } = store
  const price = calculatePrice(store)

  const isFirstPhase = currentStep === 0
  const isLastPhase = currentStep === PHASES.length - 1

  // Check if current phase is complete enough to proceed
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Design phase
        return !!selectedModel && !!selectedSize
      case 1: // Customize phase
        return true
      default:
        return false
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Back Button */}
          <div className="flex-1">
            {!isFirstPhase && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Design</span>
                <span className="sm:hidden">Back</span>
              </Button>
            )}
          </div>

          {/* Price Display */}
          <div className="text-center">
            <p className="text-sm text-stone-500">Your Shed</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={price.subtotal}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="text-2xl sm:text-3xl font-bold text-stone-900"
              >
                {formatPriceDecimal(price.subtotal)}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Next/Complete Button */}
          <div className="flex-1 flex justify-end">
            {isLastPhase ? (
              <Button
                size="lg"
                className="gap-2"
                disabled={!selectedModel || !selectedSize}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="gap-2"
              >
                <span className="hidden sm:inline">Continue to 3D View</span>
                <span className="sm:hidden">Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ConfiguratorWizard() {
  const {
    setOptions,
    setLoading,
    isLoading,
    currentStep,
    selectedModel,
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

  // Render phase content
  const renderPhaseContent = () => {
    const phaseVariants = {
      enter: { opacity: 0, x: 20 },
      center: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    }

    const content = (() => {
      switch (currentStep) {
        case 0:
          return <DesignPhase />
        case 1:
          return <CustomizePhase />
        default:
          return <DesignPhase />
      }
    })()

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={phaseVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="pb-24">
      {/* Phase Indicator */}
      <div className="mb-8">
        <PhaseIndicator />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {renderPhaseContent()}
      </div>

      {/* Fixed Bottom Navigation */}
      <PhaseNavigation />
    </div>
  )
}
