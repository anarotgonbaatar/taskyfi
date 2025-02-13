import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import Task from "@/app/models/Task"
import List from "@/app/models/List"

export async function POST( req: Request, { params }: { params: { id: string }}) {
	await connectToDB()
	const { id } = params
	const { name } = await req.json()

	// Make sure the list exists before adding a task
	const list = await List.findById( id )
	if ( !list ) {
		return NextResponse.json({ message: "Error: List doesn't exist." }, { status: 404 })
	}

	// Create the new task
	const newTask = new Task({ name, listId: id })
	await newTask.save()

	return NextResponse.json( newTask, { status: 201 })
}
