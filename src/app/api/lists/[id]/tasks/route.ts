import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import Task from "@/app/models/Task"
import List from "@/app/models/List"

export async function POST( req: Request, context: { params: { id: string }}) {
	await connectToDB()

	const { id } = await context.params
	const { name } = await req.json()

	if ( !id ) {
		return NextResponse.json({ message: "Error: List ID invalid." }, { status: 400 })
	}

	// Make sure the list exists before adding a task
	const list = await List.findById( id )
	if ( !list ) {
		return NextResponse.json({ message: "Error: List doesn't exist." }, { status: 404 })
	}

	// Create the new task
	const newTask = await Task.create({ name, listId: id })
	await List.findByIdAndUpdate( id, { $push: { tasks: newTask._id }})

	return NextResponse.json( newTask, { status: 201 })
}

export async function GET( req: Request, context: { params: { id: string }}) {
	await connectToDB()

	const { id } = await context.params

	if ( !id ) {
		return NextResponse.json({ message: "Error: List ID invalid." }, { status: 400 })
	}

	const tasks = await Task.find({ listId: id })

	return NextResponse.json( tasks )
}