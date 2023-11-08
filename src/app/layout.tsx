import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Head from 'next/head'
import Image from 'next/image'
import Footer from './components/Footer'
import Navbar from './components/Navbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Project management survey tool (working title)',
  description: 'Made by Allan and Friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
