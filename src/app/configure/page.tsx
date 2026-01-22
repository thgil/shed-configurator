import { ConfiguratorWizard } from '@/components/configurator/configurator-wizard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design Your Shed | Shed Co',
  description: 'Customize your perfect shed with our interactive configurator. Choose style, size, colors, and more.',
}

export default function ConfigurePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stone-900">Design Your Shed</h1>
          <p className="mt-2 text-stone-600">
            Customize every detail and see your shed come to life
          </p>
        </div>

        <ConfiguratorWizard />
      </div>
    </div>
  )
}
