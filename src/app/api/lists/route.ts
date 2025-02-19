import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import List from "@/app/models/List"
import Task from "@/app/models/Task"

export async function GET() {
	await connectToDB()
	const session = await getServerSession( authOptions )
	console.log("Session data:", session);

	if ( !session || !session.user || !session.user.email ) {
		return NextResponse.json({ error: "Error: Not authenticated." }, { status: 401 })
	}

	const lists = await List.find({ userId: session.user.id }).populate( "tasks" ).lean()

	// Fetch tasks for each list
	const listsWithTasks = await Promise.all(
		lists.map( async ( list ) => {
			const tasks = await Task.find({ listId: list._id }).lean()
			return { ...list, tasks }
		})
	)

	return NextResponse.json( listsWithTasks )
}

export async function POST( req: Request ) {
	await connectToDB()
	const session = await getServerSession( authOptions )
	console.log("Session data:", session);

	if ( !session || !session.user || !session.user.id ) {
		return NextResponse.json({ error: "Error: Not authenticated." }, { status: 401 })
	}

	try {
		const body = await req.json()
		const newList = await List.create({
			name: body.name,
			taskCount: body.taskCount || 0,
			tasks: body.tasks || [],
			userId: session.user.id
		})

		if ( !newList ) {
			throw new Error( "Error: Failed to create a list." )
		}
		return NextResponse.json( newList )
	} catch ( error ) {
		console.error( "Error creating list: ", error )
		return NextResponse.json({ error: "Error: Failed to create a list." }, { status: 500 })
	}
}