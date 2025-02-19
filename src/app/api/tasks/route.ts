// Tasks CRUD routes
import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import List from "@/app/models/List"
import Task from "@/app/models/Task"

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

export async function POST( req: Request ) {
	await connectToDB()
	const session = await getServerSession( authOptions )

	if ( !session || !session.user || !session.user.email ) {
		return NextResponse.json({ error: "Error: Not authenticated." }, { status: 401 })
	}

	const { listId, name } = await req.json()
	const list = await List.findOne({ _id: listId, userId: session.user.id })

	if ( !list ) {
		return NextResponse.json({ message: "Error: List doesn't exist." }, { status: 404 })
	}

	// Create the new task
	const newTask = new Task({ name, listId, userId: session.user.id })
	await newTask.save()

	return NextResponse.json( newTask )
}