import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FAQ_ITEMS } from '@/lib/constants'

export function FAQSection() {
  return (
    <section id="faq" className="py-16 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide mb-2">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about ordering your shed.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg border border-gray-200 px-6"
            >
              <AccordionTrigger className="text-left text-gray-900 font-medium hover:text-blue-800 hover:no-underline py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions?{' '}
            <a href="/contact" className="text-blue-800 font-medium hover:underline">
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
