// Task specific api calls

import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import Task from "@/app/models/Task"

export async function PUT( req: Request, context: { params: { id: string }}) {
	await connectToDB()
	const { id } = await context.params
	const updateData = await req.json()

	if ( !id ) {
		return NextResponse.json({ message: "Error: Task ID invalid." }, { status: 400 })
	}

	try {
		if ( updateData.dueDate ) {
			updateData.dueDate = new Date( updateData.dueDate )
		}
		
		const updatedTask = await Task.findByIdAndUpdate( id, updateData, { new: true })
		
		if ( !updatedTask ) {
			return NextResponse.json({ message: "Error: Task doesn't exist." }, { status: 404 })
		}

		return NextResponse.json( updatedTask )
	} catch ( error ) {
		return NextResponse.json({ message: `Error: Failed to update task: ${error}` }, { status: 500 })
	}
}

export async function DELETE ( req: Request, context: { params: { id: string }}) {
	await connectToDB()
	
	const { id } = await context.params
	
	if ( !id ) {
		return NextResponse.json({ message: "Error: Task ID invalid." }, { status: 400 })
	}
	
	const deletedTask = await Task.findByIdAndDelete( id )
	
	if ( !deletedTask ) {
		return NextResponse.json({ message: "Error: Task doesn't exist." }, { status: 404 })
	}

	return NextResponse.json({ message: "Task updated." }, { status: 200 })
}