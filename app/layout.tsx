import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Mohsen Khosravi — Product Manager & Data Analyst",
  description:
    "Case studies from six years turning ambiguous problems into shipped products and messy data into decisions that stick — across media, manufacturing, and industrial operations.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
