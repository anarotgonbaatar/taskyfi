"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
	const { data: session, status } = useSession()
	const router = useRouter()

	useEffect(() => {
		if ( status === "loading" ) return	// Wait for session to load

		if ( session ) {
			router.push( "/dashboard" )
		} else {
			router.push( "/auth" )
		}
	}, [ session, status, router ] )

	return <p>Loading...</p>	// Show loading while directing
}