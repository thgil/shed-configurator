'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { FloorPlanEditor } from './floor-plan-editor'
import { cn } from '@/lib/utils'
import { formatPriceDecimal } from '@/lib/utils'
import { Check, Star, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Inline compact style selector for Phase 1
function CompactStyleSelector() {
  const { models, selectedModel, selectModel } = useConfiguratorStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const STYLE_ICONS = {
    GABLE: (
      <svg viewBox="0 0 40 30" className="w-10 h-8">
        <path d="M2 28 L2 15 L20 4 L38 15 L38 28 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 15 L20 4 L38 15" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    BARN: (
      <svg viewBox="0 0 40 30" className="w-10 h-8">
        <path d="M2 28 L2 14 L8 10 L20 4 L32 10 L38 14 L38 28 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 14 L8 10 L20 4 L32 10 L38 14" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    LEAN_TO: (
      <svg viewBox="0 0 40 30" className="w-10 h-8">
        <path d="M2 28 L2 8 L38 14 L38 28 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 8 L38 14" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-amber-600">
            {selectedModel && STYLE_ICONS[selectedModel.roofStyle]}
          </div>
          <div className="text-left">
            <p className="text-xs text-stone-500 uppercase tracking-wide">Style</p>
            <p className="font-semibold text-stone-900">{selectedModel?.name ?? 'Select style'}</p>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-stone-400 transition-transform",
          isExpanded && "rotate-180"
        )} />
      </button>

      {/* Expandable options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-stone-100"
          >
            <div className="p-3 space-y-2">
              {models.map((model, index) => {
                const isSelected = selectedModel?.id === model.id
                const isPopular = index === 0

                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      selectModel(model)
                      setIsExpanded(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                      isSelected
                        ? "bg-amber-50 ring-2 ring-amber-500"
                        : "hover:bg-stone-50"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0",
                      isSelected ? "text-amber-600" : "text-stone-400"
                    )}>
                      {STYLE_ICONS[model.roofStyle]}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-900">{model.name}</span>
                        {isPopular && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                            <Star className="w-3 h-3 mr-1 fill-current" /> Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-500">{model.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-sm font-semibold text-amber-600">
                        {formatPriceDecimal(model.basePrice)}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Inline compact size selector for Phase 1
function CompactSizeSelector() {
  const { sizes, selectedSize, selectSize } = useConfiguratorStore()

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wide">Size</h3>
        {selectedSize && (
          <span className="text-xs text-stone-500">
            {selectedSize.widthFeet}' W × {selectedSize.depthFeet}' D × {selectedSize.heightFeet}' H · {selectedSize.widthFeet * selectedSize.depthFeet} sq ft
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {sizes.map((size) => {
          const isSelected = selectedSize?.id === size.id

          return (
            <button
              key={size.id}
              onClick={() => selectSize(size)}
              className={cn(
                "relative py-2 px-1 rounded-lg transition-all duration-200 text-center",
                "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1",
                isSelected
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-stone-50 text-stone-900 hover:bg-stone-100"
              )}
            >
              <div className="text-sm font-bold">{size.displayName}</div>
              {size.priceModifier > 0 && (
                <div className={cn(
                  "text-xs",
                  isSelected ? "text-amber-100" : "text-stone-500"
                )}>
                  +{formatPriceDecimal(size.priceModifier)}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DesignPhase() {
  return (
    <div className="space-y-3">
      {/* Style & Size selectors side by side */}
      <div className="grid md:grid-cols-[1fr,1.5fr] gap-3">
        <CompactStyleSelector />
        <CompactSizeSelector />
      </div>

      {/* Floor Plan */}
      <div className="bg-white rounded-xl border border-stone-200 p-3">
        <FloorPlanEditor />
      </div>
    </div>
  )
}
