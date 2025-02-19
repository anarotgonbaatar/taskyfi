// Defines the layout for all pages. Ex: header, footer, nagivation
// Applies a global structure to the app.
"use client"

import { SessionProvider } from "next-auth/react"
import Header from "./components/Header"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {

	return (
		<SessionProvider>
			<html lang="en">
			<body className="text-white h-screen">
				<Header/>
				<main className="p-2 mt-2">{ children }</main>
			</body>
			</html>
		</SessionProvider>
	)
}