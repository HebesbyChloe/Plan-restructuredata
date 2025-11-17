import type { Metadata } from 'next'
import '../styles/globals.css'
import { Providers } from './providers'
import { ErrorBoundary } from './error-boundary'

export const metadata: Metadata = {
  title: 'FIRST CURRENT AI Orchestra ERP Design',
  description: 'AI Orchestra ERP Design Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

