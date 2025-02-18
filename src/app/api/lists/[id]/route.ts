// Delete List API
import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import List from "@/app/models/List"

export async function DELETE( req: Request, context: { params: { id: string } } ) {
	await connectToDB()

	const { id } = await context.params

	if ( !id ) {
		return NextResponse.json({ message: "Error: List ID invalid." }, { status: 400 })
	}

	// Delete the list
	const deletedList = await List.findByIdAndDelete( id )

	if ( !deletedList ) {
		return NextResponse.json({ message: "Error: List not found."}, { status: 404 })
	}

	return NextResponse.json({ message: "List deleted successfully." }, { status: 200 })
}

export async function PUT( req: Request, context: { params: { id: string } } ) {
	await connectToDB()

	const { id } = await context.params

	if ( !id ) {
		return NextResponse.json({ message: "Error: List ID invalid." }, { status: 400 })
	}
	
	const { name } = await req.json()

	// Find and update the list name
	const updatedList = await List.findByIdAndUpdate( id, { name }, { new: true } )

	if ( !updatedList ) {
		return NextResponse.json({ message: "Error: List not found."}, { status: 404 })
	}

	return NextResponse.json({ message: "List updated successfully." }, { status: 200 })
}