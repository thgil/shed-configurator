// Shed Categories for landing page
export const SHED_CATEGORIES = [
  {
    id: 'storage',
    name: 'Storage Sheds',
    tagline: 'Organized Living Starts Here',
    description: 'Perfect for lawn equipment, tools, and seasonal items. Keep your garage clear and your belongings protected.',
    startingPrice: 2999,
    image: 'https://images.unsplash.com/photo-1530836176759-510f58baebf4?w=800&q=80',
    features: ['Weather-resistant', 'Built-in shelving options', 'Wide door access'],
  },
  {
    id: 'garden',
    name: 'Garden Sheds',
    tagline: 'Where Gardens Grow',
    description: 'Designed for the serious gardener. Store tools, pots, soil, and create a potting station.',
    startingPrice: 3299,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    features: ['Natural lighting options', 'Ventilation system', 'Workbench ready'],
  },
  {
    id: 'workshop',
    name: 'Workshop Sheds',
    tagline: 'Your Creative Command Center',
    description: 'The ultimate workspace for DIY projects, woodworking, or hobbies. Wired for power and built to last.',
    startingPrice: 3999,
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    features: ['Electrical pre-wiring', 'Heavy-duty flooring', 'Insulation options'],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Sheds',
    tagline: 'Your Personal Retreat',
    description: 'Transform your backyard into a home office, art studio, she-shed, or man cave. Your space, your rules.',
    startingPrice: 4499,
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    features: ['Climate control ready', 'Premium finishes', 'Multiple window options'],
  },
] as const

// Features for landing page grid
export const FEATURES = [
  {
    id: 'materials',
    title: 'Premium Materials',
    description: 'Built with LP SmartSide siding and 30-year architectural shingles for lasting durability.',
    icon: 'Shield',
  },
  {
    id: 'custom',
    title: 'Custom Designed',
    description: 'Choose your size, style, colors, doors, and windows. Make it uniquely yours.',
    icon: 'Palette',
  },
  {
    id: 'installation',
    title: 'Expert Installation',
    description: 'Our professional crews handle delivery and setup. You just point where it goes.',
    icon: 'Wrench',
  },
  {
    id: 'weather',
    title: 'Weather-Resistant',
    description: 'Engineered to withstand rain, snow, and sun. Your belongings stay protected.',
    icon: 'CloudRain',
  },
  {
    id: 'financing',
    title: 'Flexible Financing',
    description: 'Low monthly payments available. Get your shed now, pay over time.',
    icon: 'CreditCard',
  },
  {
    id: 'warranty',
    title: '10-Year Warranty',
    description: 'We stand behind our work. Full coverage on materials and craftsmanship.',
    icon: 'Award',
  },
] as const

// Testimonials
export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    location: 'Austin, TX',
    rating: 5,
    text: 'The configurator made designing my garden shed so easy! I could see exactly what I was getting before ordering. The installation team was professional and finished in one day.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    shedType: 'Garden Shed',
  },
  {
    id: '2',
    name: 'Mike Thompson',
    location: 'Denver, CO',
    rating: 5,
    text: 'Best investment I made for my home workshop. The quality is outstanding - solid construction, great paint job, and the double doors make moving equipment in and out a breeze.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    shedType: 'Workshop Shed',
  },
  {
    id: '3',
    name: 'Jennifer Adams',
    location: 'Portland, OR',
    rating: 5,
    text: "Turned my lifestyle shed into a home office and I couldn't be happier. The natural lighting from the extra windows I added is perfect. Worth every penny!",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    shedType: 'Lifestyle Shed',
  },
  {
    id: '4',
    name: 'David Chen',
    location: 'Seattle, WA',
    rating: 5,
    text: 'From design to delivery, the whole process was smooth. Customer service answered all my questions and the shed looks even better in person than on the screen.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    shedType: 'Storage Shed',
  },
] as const

// How it Works steps
export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Design',
    description: 'Use our interactive configurator to choose your style, size, colors, and add doors and windows.',
    icon: 'PenTool',
  },
  {
    step: 2,
    title: 'Review',
    description: 'See your complete design with pricing. Make adjustments until it\'s perfect.',
    icon: 'Eye',
  },
  {
    step: 3,
    title: 'We Build',
    description: 'Our craftsmen construct your shed using premium materials. Quality checked at every step.',
    icon: 'Hammer',
  },
  {
    step: 4,
    title: 'Enjoy',
    description: 'Professional delivery and installation. Your new shed is ready to use.',
    icon: 'Home',
  },
] as const

// FAQ items
export const FAQ_ITEMS = [
  {
    question: 'How long does delivery take?',
    answer: 'Most sheds are delivered within 4-6 weeks of order confirmation. Delivery time may vary based on your location and customization options. We\'ll provide a specific timeline when you place your order.',
  },
  {
    question: 'Do I need a permit for my shed?',
    answer: 'Permit requirements vary by location. Most areas don\'t require permits for sheds under 120 square feet, but we recommend checking with your local building department. We can provide documentation to help with the permit process.',
  },
  {
    question: 'What\'s included in the price?',
    answer: 'Our prices include the complete shed structure, all selected options (doors, windows, colors), delivery within our service area, and professional installation on a prepared site. Foundation and site prep are not included.',
  },
  {
    question: 'Can I customize beyond the configurator options?',
    answer: 'Yes! The configurator covers our most popular options, but we can accommodate special requests. Contact our team for custom sizing, additional features, or unique color matching.',
  },
  {
    question: 'What kind of foundation do I need?',
    answer: 'We recommend a level gravel pad, concrete slab, or concrete blocks. The foundation should be level within 3 inches across the entire footprint. We offer foundation preparation as an add-on service.',
  },
  {
    question: 'What is your warranty coverage?',
    answer: 'We provide a 10-year warranty covering structural defects, materials, and workmanship. The warranty is transferable if you sell your home. Normal wear and weather damage are not covered.',
  },
] as const

// Configurator phases (2-phase flow)
export const CONFIGURATOR_PHASES = [
  { id: 'design', label: 'Design Layout', description: 'Style, size & floor plan' },
  { id: 'customize', label: 'Customize', description: '3D preview & colors' },
] as const

// Legacy: kept for backwards compatibility if needed
export const CONFIGURATOR_STEPS = CONFIGURATOR_PHASES

// Trust indicators for hero
export const TRUST_INDICATORS = {
  customerCount: '2,500+',
  averageRating: 4.9,
  yearsInBusiness: 15,
  warrantyYears: 10,
} as const

// Preview images for different views and styles
export const SHED_PREVIEW_IMAGES = {
  GABLE: {
    front: 'https://images.unsplash.com/photo-1530836176759-510f58baebf4?w=800&q=80',
    side: 'https://images.unsplash.com/photo-1530836176759-510f58baebf4?w=800&q=80',
    interior: 'https://images.unsplash.com/photo-1530836176759-510f58baebf4?w=800&q=80',
  },
  BARN: {
    front: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    side: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    interior: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
  },
  LEAN_TO: {
    front: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    side: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    interior: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
  },
} as const
