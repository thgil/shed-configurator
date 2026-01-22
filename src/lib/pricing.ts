import type { ConfiguratorState } from '@/types/configurator'

export interface PriceBreakdown {
  basePrice: number
  sizeModifier: number
  sidingModifier: number
  shingleModifier: number
  doorsTotal: number
  windowsTotal: number
  subtotal: number
  taxRate: number
  tax: number
  total: number
}

export function calculatePrice(config: ConfiguratorState): PriceBreakdown {
  const basePrice = config.selectedModel?.basePrice ?? 0
  const sizeModifier = config.selectedSize?.priceModifier ?? 0
  const sidingModifier = config.selectedSidingOption?.priceModifier ?? 0
  const shingleModifier = config.selectedShingleOption?.priceModifier ?? 0

  const doorsTotal = config.doors.reduce((sum, door) => {
    return sum + (door.option?.priceEach ?? 0)
  }, 0)

  const windowsTotal = config.windows.reduce((sum, window) => {
    return sum + (window.option?.priceEach ?? 0)
  }, 0)

  const subtotal = basePrice + sizeModifier + sidingModifier + shingleModifier + doorsTotal + windowsTotal

  // Default tax rate - would be calculated based on delivery address in production
  const taxRate = 0.0825 // 8.25%
  const tax = subtotal * taxRate

  return {
    basePrice,
    sizeModifier,
    sidingModifier,
    shingleModifier,
    doorsTotal,
    windowsTotal,
    subtotal,
    taxRate,
    tax,
    total: subtotal + tax,
  }
}
