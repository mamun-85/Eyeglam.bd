import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/cart-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif'
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

const SITE_URL = 'https://eyeglambd.com'
const SITE_NAME = 'EyeGlam'
const SITE_DESCRIPTION =
  'Shop premium sunglasses and eyeglasses in Bangladesh. Trendy, UV400-protected designer frames at honest prices — fast delivery inside & outside Dhaka, cash on delivery, and easy WhatsApp ordering.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EyeGlam | Premium Eyewear & Sunglasses in Bangladesh',
    template: '%s | EyeGlam',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'eyewear Bangladesh',
    'sunglasses BD',
    'eyeglasses Bangladesh',
    'glasses Dhaka',
    'buy sunglasses online Bangladesh',
    'designer frames BD',
    'UV400 sunglasses',
    'polarized sunglasses Bangladesh',
    'optical frames Dhaka',
    'EyeGlam',
    'eyeglambd',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'EyeGlam | Premium Eyewear & Sunglasses in Bangladesh',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'EyeGlam — Premium Eyewear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EyeGlam | Premium Eyewear & Sunglasses in Bangladesh',
    description: SITE_DESCRIPTION,
    images: ['/web-app-manifest-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'shopping',
  icons: {
    icon: [
      {
        url: '/icon1.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/icon0.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/web-app-manifest-512x512.png`,
        description: SITE_DESCRIPTION,
        areaServed: 'BD',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
