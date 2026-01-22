'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants'

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide mb-2">
            Customer Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            See what homeowners have to say about their Shed Co experience.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {TESTIMONIALS.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border border-gray-200">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <Quote className="w-8 h-8 text-gray-200 mb-4" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>

                    {/* Shed Type */}
                    <p className="mt-4 text-sm text-blue-800 font-medium">
                      {testimonial.shedType}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
