"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { FaUser } from "react-icons/fa"

export default function Header() {
	const { data: session } = useSession()

	return (
		<div
			className={ `header p-2 flex ${ session ? "justify-between" : "justify-center" }` }
		>
			<h1 className="text-xl font-bold">TASKYFI</h1>
			{ session && (
				<Link href="./account" className="cursor-pointer flex">
					<FaUser className="acc-page-btn self-center w-6 h-6"/>
				</Link>
			)}
		</div>
	)
}