import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Check } from 'lucide-react'
import { SHED_CATEGORIES } from '@/lib/constants'
import { formatPriceDecimal } from '@/lib/utils'

export function ShedCategories() {
  return (
    <section id="categories" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide mb-2">
            Our Products
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Choose Your Shed Type
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From simple storage to lifestyle retreats, we have the perfect shed for every need.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SHED_CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>

              <CardContent className="p-5">
                {/* Price */}
                <p className="text-sm text-gray-500 mb-1">
                  Starting at <span className="font-semibold text-gray-900">{formatPriceDecimal(category.startingPrice)}</span>
                </p>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-blue-800 font-medium">{category.tagline}</p>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {category.description}
                </p>

                {/* Features */}
                <ul className="mt-4 space-y-2">
                  {category.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-5 group-hover:bg-blue-800 group-hover:text-white group-hover:border-blue-800 transition-colors"
                >
                  <Link href={`/configure?type=${category.id}`}>
                    Customize
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
