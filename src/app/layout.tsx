import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/scrollbar.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/styles.css'

const inter = Inter({ subsets: ['latin'] })

const descText = "Sky Sync is your ultimate weather companion, offering precise meteorological insights with a user-friendly interface. Stay ahead of changing weather conditions, from sunny skies to approaching storms, and access real-time forecasts and radar data. With Sky Sync, you'll be in perfect harmony with the atmosphere, always prepared for what lies ahead"
export const metadata: Metadata = {
  title: 'Sky Sync',
  description: descText,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        </body>
    </html>
  )
}
