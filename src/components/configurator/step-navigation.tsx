'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { calculatePrice } from '@/lib/pricing'
import { formatPriceDecimal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CONFIGURATOR_STEPS } from '@/lib/constants'
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function StepNavigation() {
  const store = useConfiguratorStore()
  const { currentStep, prevStep, nextStep, selectedModel, selectedSize } = store
  const price = calculatePrice(store)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === CONFIGURATOR_STEPS.length - 1

  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 0: // Style
        return !!selectedModel
      case 1: // Size
        return !!selectedSize
      case 2: // Colors
        return true // Colors have defaults
      case 3: // Doors & Windows
        return true // Optional
      case 4: // Review
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
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
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
            {isLastStep ? (
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
                disabled={!isStepComplete()}
                className="gap-2"
              >
                <span className="hidden sm:inline">Continue</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
