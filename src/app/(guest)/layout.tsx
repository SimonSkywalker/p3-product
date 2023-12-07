import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/(admin)/globals.css'
import Head from 'next/head'
import Image from 'next/image'



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
          {children}
      </body>
      
    </html>
  )
}
