'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useConfiguratorStore } from '@/stores/configurator'
import { calculatePrice } from '@/lib/pricing'
import { formatPriceDecimal } from '@/lib/utils'

export function PriceDisplay() {
  const store = useConfiguratorStore()
  const price = calculatePrice(store)

  const hasSelections = store.selectedModel && store.selectedSize

  return (
    <div className="rounded-xl bg-white border border-stone-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-stone-500">Estimated Price</span>
        {price.subtotal > 0 && (
          <span className="text-xs text-stone-400">+ tax at checkout</span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={price.subtotal}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="text-3xl font-bold text-stone-900"
        >
          {hasSelections ? formatPriceDecimal(price.subtotal) : '--'}
        </motion.div>
      </AnimatePresence>

      {hasSelections && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-stone-100 space-y-2"
        >
          <PriceLine label="Base price" value={price.basePrice} />
          {price.sizeModifier > 0 && (
            <PriceLine label="Size upgrade" value={price.sizeModifier} />
          )}
          {price.sidingModifier > 0 && (
            <PriceLine label="Siding upgrade" value={price.sidingModifier} />
          )}
          {price.shingleModifier > 0 && (
            <PriceLine label="Shingle upgrade" value={price.shingleModifier} />
          )}
          {price.doorsTotal > 0 && (
            <PriceLine label="Doors" value={price.doorsTotal} />
          )}
          {price.windowsTotal > 0 && (
            <PriceLine label="Windows" value={price.windowsTotal} />
          )}
        </motion.div>
      )}
    </div>
  )
}

function PriceLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-stone-500">{label}</span>
      <span className="text-stone-700">+{formatPriceDecimal(value)}</span>
    </div>
  )
}
