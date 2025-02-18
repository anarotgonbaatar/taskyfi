// Tasks CRUD routes
import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import Task from "@/app/models/Task"
import List from "@/app/models/List"

export async function POST( req: Request ) {
	await connectToDB()
	const { listId, name } = await req.json()

	// Make sure the list exists
	const list = await List.findById( listId )
	if ( !list ) {
		return NextResponse.json({ message: "Error: List doesn't exist." }, { status: 404 })
	}
	// Create the new task
	const newTask = new Task({ name, listId })
	await newTask.save()

	return NextResponse.json({ message: "Task created." }, { status: 201 })
}