'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

const styles = [
  { id: 'gable', name: 'Classic Gable', image: 'https://images.unsplash.com/photo-1530836176759-510f58baebf4?w=800&q=80' },
  { id: 'barn', name: 'Rustic Barn', image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80' },
  { id: 'lean-to', name: 'Modern Lean-To', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' },
]

const colors = [
  { id: 'red', name: 'Barn Red', hex: '#8B2500' },
  { id: 'green', name: 'Forest Green', hex: '#228B22' },
  { id: 'gray', name: 'Stone Gray', hex: '#708090' },
  { id: 'white', name: 'Colonial White', hex: '#FAFAFA' },
  { id: 'brown', name: 'Autumn Brown', hex: '#8B4513' },
]

export function InteractivePreview() {
  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [selectedColor, setSelectedColor] = useState(colors[0])

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Preview Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={selectedStyle.image}
                alt={selectedStyle.name}
                fill
                className="object-cover transition-all duration-500"
                unoptimized
              />
              {/* Color overlay simulation */}
              <div
                className="absolute inset-0 mix-blend-multiply opacity-20 transition-colors duration-500"
                style={{ backgroundColor: selectedColor.hex }}
              />
            </div>

            {/* Style Label */}
            <div className="absolute top-4 left-4 bg-white rounded-md px-3 py-1.5 shadow-md">
              <span className="text-sm font-medium text-gray-900">{selectedStyle.name}</span>
            </div>

            {/* Color Label */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white rounded-md px-3 py-1.5 shadow-md">
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <span className="text-sm font-medium text-gray-900">{selectedColor.name}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="order-1 lg:order-2">
            <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide mb-2">
              Try It Out
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              See Your Shed Come to Life
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get a quick preview of your shed. Choose a style and color to see how it looks.
            </p>

            {/* Style Selection */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose a Style</h3>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all border",
                      selectedStyle.id === style.id
                        ? "bg-blue-800 text-white border-blue-800"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose a Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={cn(
                      "w-10 h-10 rounded-md transition-all border-2",
                      selectedColor.id === color.id
                        ? "ring-2 ring-blue-800 ring-offset-2 border-transparent"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button asChild size="lg" className="h-12 px-8 bg-blue-800 hover:bg-blue-900">
                <Link href={`/configure?style=${selectedStyle.id}`}>
                  Start Full Customization
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="mt-3 text-sm text-gray-500">
                Full customization available including size, doors, and windows
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
