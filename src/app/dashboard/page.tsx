"use client"

import { useState, useEffect } from "react"
import List from "./List"
import { ListType } from "../types"
import "./dashboard.css"

export default function DashboardPage() {
	const [ lists, setLists ] = useState <ListType[]>( [] )
	const [ loading, setLoading ] = useState( true )

	// Get lists from API
	useEffect(() => {
		async function fetchLists() {
			const res = await fetch( "/api/lists", { cache: "no-store" } )
			const data = await res.json()
			setLists( data )
			setLoading( false )
		}
		fetchLists()
	}, [])
	
	// Add new list
	const addList = async () => {
		const res = await fetch( "/api/lists", {
			method: "POST",
			body: JSON.stringify({ name: "New List" }),
			headers: { "Content-Type": "application/json" },
		})
		const newList = await res.json()
		setLists( ( prev ) => ( prev ? [ ...prev, newList ] : [ newList ]) )
	}

	return (
		<div className="flex gap-4 overflow-x-auto h">
			{ loading ? (
				<p>Loading Tasks...</p>
			):(
				lists?.map( ( list ) => (
					<List key={ list._id } list={ list } setLists={ setLists }/>
				))
			)}

			<button onClick={ addList } type="button">
				+ List
			</button>
		</div>
	)
}