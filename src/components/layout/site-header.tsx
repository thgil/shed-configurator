'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Design Your Shed', href: '/configure' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'FAQ', href: '/#faq' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-800 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">Shed Co</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href.split('#')[0]))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "text-blue-800 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:1-800-555-0123"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <Phone className="w-4 h-4" />
              1-800-555-0123
            </a>
            <Button asChild className="bg-blue-800 hover:bg-blue-900">
              <Link href="/configure">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <nav className="flex flex-col gap-2 mt-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-4 py-3 text-base font-medium rounded-md transition-colors",
                        isActive
                          ? "text-blue-800 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                })}
                <div className="border-t border-gray-200 my-4 pt-4">
                  <a
                    href="tel:1-800-555-0123"
                    className="flex items-center gap-2 px-4 py-3 text-base font-medium text-gray-600"
                  >
                    <Phone className="w-4 h-4" />
                    1-800-555-0123
                  </a>
                </div>
                <Button asChild className="mx-4 bg-blue-800 hover:bg-blue-900">
                  <Link href="/configure" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
