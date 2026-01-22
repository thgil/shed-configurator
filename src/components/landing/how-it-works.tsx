import { HOW_IT_WORKS_STEPS } from '@/lib/constants'
import { PenTool, Eye, Hammer, Home } from 'lucide-react'

const iconMap = {
  PenTool,
  Eye,
  Hammer,
  Home,
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide mb-2">
            Our Process
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From design to delivery, we make getting your perfect shed easy.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gray-200" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, index) => {
              const Icon = iconMap[step.icon as keyof typeof iconMap]

              return (
                <div key={step.step} className="relative text-center">
                  {/* Step Number & Icon */}
                  <div className="relative mx-auto w-16 h-16 mb-6">
                    <div className="w-full h-full bg-blue-800 rounded-full flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {/* Step Badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>

                  {/* Arrow (mobile only) */}
                  {index < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <svg
                        className="w-6 h-6 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
