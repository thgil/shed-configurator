'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { CONFIGURATOR_STEPS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export function StepIndicator() {
  const { currentStep, setCurrentStep } = useConfiguratorStore()

  return (
    <nav className="w-full">
      <ol className="flex items-center justify-between">
        {CONFIGURATOR_STEPS.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = index <= currentStep

          return (
            <li key={step.id} className="flex-1 relative">
              {/* Connector Line */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-5 -left-1/2 w-full h-0.5 -translate-y-1/2",
                    isCompleted ? "bg-amber-600" : "bg-stone-200"
                  )}
                />
              )}

              <button
                onClick={() => isClickable && setCurrentStep(index)}
                disabled={!isClickable}
                className={cn(
                  "relative flex flex-col items-center group w-full",
                  isClickable && !isCurrent && "cursor-pointer",
                  !isClickable && "cursor-not-allowed"
                )}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all relative z-10",
                    isCompleted && "bg-amber-600 text-white",
                    isCurrent && "bg-amber-600 text-white ring-4 ring-amber-100",
                    !isCompleted && !isCurrent && "bg-stone-200 text-stone-500",
                    isClickable && !isCurrent && "group-hover:bg-amber-500 group-hover:text-white"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    "mt-2 text-sm font-medium transition-colors hidden sm:block",
                    isCurrent ? "text-amber-600" : "text-stone-500",
                    isClickable && !isCurrent && "group-hover:text-amber-600"
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
