import { FEATURES } from '@/lib/constants'
import {
  Shield,
  Palette,
  Wrench,
  CloudRain,
  CreditCard,
  Award,
} from 'lucide-react'

const iconMap = {
  Shield,
  Palette,
  Wrench,
  CloudRain,
  CreditCard,
  Award,
}

export function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Built Better, Guaranteed
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Every shed is crafted with premium materials and backed by our commitment to quality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap]

            return (
              <div
                key={feature.id}
                className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-800" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
