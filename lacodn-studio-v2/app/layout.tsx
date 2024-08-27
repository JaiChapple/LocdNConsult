import "./globals.css"

import { Montserrat as FontSans } from "next/font/google"
import type { Metadata } from "next"
import { cn } from "@/lib/utils"

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "Loc'd N Studios",
    description: "",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                {children}
            </body>
        </html>
    )
}
