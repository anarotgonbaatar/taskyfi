import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import List from "@/app/models/List"
import Task from "@/app/models/Task"

// Task Fetching
export async function GET( req: Request ) {
	await connectToDB()
	const session = await getServerSession( authOptions )

	if ( !session || !session.user || !session.user.email ) {
		return NextResponse.json({ error: "Error: Not authenticated." }, { status: 401 })
	}

	const url = new URL( req.url )
	const listId = url.searchParams.get( "listId" )

	if ( !listId ) {
		return NextResponse.json({ message: "Error: List ID doesn't exist." }, { status: 400 })
	}

	// Create the new task
	const tasks = await Task.find({ listId, userId: session.user.id }).lean()

	return NextResponse.json( tasks )
}

// Task Creation
export async function POST( req: Request ) {
	await connectToDB()
	const session = await getServerSession( authOptions )

	if ( !session || !session.user || !session.user.email ) {
		return NextResponse.json({ error: "Error: Not authenticated." }, { status: 401 })
	}

	const body = await req.json()
	const { listId } = body
	const list = await List.findOne({ _id: listId, userId: session.user.id })

	if ( !list ) {
		return NextResponse.json({ message: "Error: List doesn't exist." }, { status: 404 })
	}

	// Create the new task
	const newTask = new Task({
		name: body.name,
		details: body.details || "",
		listId: body.listId,
		dueDate: body.dueDate ? new Date( body.dueDate ) : null,
		priority: body.priority || "none",
		parentTask: body.parentTask || null,
		completed: body.completed ?? false,
	})

	await newTask.save()
	return NextResponse.json( newTask )
}