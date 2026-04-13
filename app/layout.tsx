import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClinicPages — Landing Page Builder for Aesthetic Clinics',
  description: 'Generate conversion-optimized, multi-language treatment landing pages in minutes. Built on the template that generated CHF 2M+ for aesthetic clinics.',
  keywords: 'aesthetic clinic landing page, medspa marketing, medical spa website, treatment page builder',
  openGraph: {
    title: 'ClinicPages — The Landing Page Builder That Generated CHF 2M+',
    description: 'Turn your treatment into a patient-generating machine. Multi-language, dark/light modes, before/after gallery, pricing calculator — ready in 5 minutes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
