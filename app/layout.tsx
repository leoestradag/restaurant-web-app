import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { RestaurantProvider } from "@/lib/restaurant-context"
import { TableProvider } from "@/lib/table-context"
import { PaymentMethodsProvider } from "@/lib/payment-methods-context"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Smartable - Restaurant Ordering', // Updated at: 2026-02-19
  description: 'Order food from your table with ease',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <TableProvider>
          <RestaurantProvider>
            <PaymentMethodsProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </PaymentMethodsProvider>
          </RestaurantProvider>
        </TableProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
