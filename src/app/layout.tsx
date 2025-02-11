// Defines the layout for all pages. Ex: header, footer, nagivation
// Applies a global structure to the app.
"use client"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import "./globals.css";

export default function RootLayout({
	children,
	session,
}: {
	children: React.ReactNode
	session?: Session | null
}) {

return (
	<SessionProvider session={ session }>
		<html lang="en">
		<body className="text-white">
			<header className="text-xl font-semibold p-4">TASKYFI</header>
			<main className="p-4">{ children }</main>
		</body>
		</html>
	</SessionProvider>
);
}
