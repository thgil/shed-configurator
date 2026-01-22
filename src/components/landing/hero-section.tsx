import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Star, Users, Shield, ArrowRight } from 'lucide-react'
import { TRUST_INDICATORS } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide mb-4">
              Custom-Built Storage Solutions
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Your Perfect Shed, Designed by You
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              We build custom storage solutions that match your style, space, and needs.
              Design your shed online with our easy configurator, and we handle the rest.
            </p>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{TRUST_INDICATORS.averageRating}</span> rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{TRUST_INDICATORS.customerCount}</span> customers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{TRUST_INDICATORS.warrantyYears}-year</span> warranty
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-blue-800 hover:bg-blue-900">
                <Link href="/configure">
                  Design Your Shed
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1530836176759-510f58baebf4?w=800&q=80"
                alt="Beautiful custom shed in backyard"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-5 hidden md:block border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-800">#1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Top Rated Builder</p>
                  <p className="text-sm text-gray-500">{TRUST_INDICATORS.yearsInBusiness} years in business</p>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="absolute -top-4 -right-4 bg-blue-800 text-white rounded-lg shadow-lg p-4 hidden md:block">
              <p className="text-sm font-medium text-blue-200">Starting at</p>
              <p className="text-2xl font-bold">$2,999</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
