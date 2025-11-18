"use client";

import '../styles/globals.css'
import { Providers } from './providers'
import { ErrorBoundary } from './error-boundary'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>FIRST CURRENT AI Orchestra ERP Design</title>
        <meta name="description" content="AI Orchestra ERP Design Application" />
      </head>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

