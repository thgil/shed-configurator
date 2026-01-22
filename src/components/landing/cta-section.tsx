import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Phone } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-blue-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Ready to Design Your Perfect Shed?
        </h2>
        <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
          Start designing today and see exactly what your custom shed will look like.
          No commitment required.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 bg-white text-blue-800 hover:bg-gray-100"
          >
            <Link href="/configure">
              Start Designing Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 border-white text-white hover:bg-white/10 bg-transparent"
          >
            <a href="tel:1-800-555-0123">
              <Phone className="w-4 h-4 mr-2" />
              Call 1-800-555-0123
            </a>
          </Button>
        </div>
        <p className="mt-6 text-sm text-blue-200">
          Free design consultation &bull; No obligation &bull; Expert support
        </p>
      </div>
    </section>
  )
}
