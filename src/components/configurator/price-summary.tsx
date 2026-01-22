'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { calculatePrice } from '@/lib/pricing'
import { formatPriceDecimal } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function PriceSummary() {
  const store = useConfiguratorStore()
  const price = calculatePrice(store)

  return (
    <div>
      {/* Price Breakdown */}
      <div className="space-y-2 mb-4">
        <PriceLine label="Base Price" value={price.basePrice} />
        {price.sizeModifier > 0 && (
          <PriceLine label="Size Upgrade" value={price.sizeModifier} />
        )}
        {price.doorsTotal > 0 && (
          <PriceLine label="Doors" value={price.doorsTotal} />
        )}
        {price.windowsTotal > 0 && (
          <PriceLine label="Windows" value={price.windowsTotal} />
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-stone-200 pt-4">
        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-stone-700">Subtotal</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={price.subtotal}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold text-stone-900"
            >
              {formatPriceDecimal(price.subtotal)}
            </motion.span>
          </AnimatePresence>
        </div>
        <p className="text-sm text-stone-500 mt-1">
          Tax calculated at checkout
        </p>
      </div>
    </div>
  )
}

function PriceLine({ label, value }: { label: string; value: number }) {
  if (value === 0) return null

  return (
    <div className="flex justify-between text-sm">
      <span className="text-stone-600">{label}</span>
      <span className="text-stone-800 font-medium">
        {formatPriceDecimal(value)}
      </span>
    </div>
  )
}
