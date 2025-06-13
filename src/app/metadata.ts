import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'unmute | Anonymous Mental Health Support Platform',
  description: 'A safe, anonymous space for peer support sessions moderated by AI. Connect with others who understand your journey through topic-based mental health support.',
      keywords: [
      'mental health',
      'peer support',
      'support groups',
      'anonymous chat',
      'AI moderation',
      'anxiety support',
      'depression help',
      'support circles',
      'peer support sessions',
      'wellness'
    ],
  authors: [{ name: 'unmute Team' }],
  creator: 'unmute',
  publisher: 'unmute',
  metadataBase: new URL('https://unmute.social'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'unmute | Anonymous Mental Health Support',
    description: 'A safe, anonymous space for peer support sessions moderated by AI. Connect with others who understand your journey.',
    url: 'https://unmute.social',
    siteName: 'unmute',
    images: [
      {
        url: '/unmute-logo-light.svg',
        width: 400,
        height: 400,
        alt: 'unmute logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'unmute | Anonymous Mental Health Support',
    description: 'A safe, anonymous space for peer support sessions moderated by AI. Connect with others who understand your journey.',
    images: ['/unmute-logo-light.svg'],
    creator: '@unmute',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/unmute-logo-light.svg',
    apple: '/unmute-logo-light.svg',
  },
  manifest: '/manifest.json',
  category: 'health',
}; 