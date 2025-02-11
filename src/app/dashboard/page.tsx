"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
	const { data: session, status } = useSession()
	const router = useRouter()

	useEffect(() => {

	})

	return (
		<div>Welcome, { session?.user?.fName }</div>
	)
}