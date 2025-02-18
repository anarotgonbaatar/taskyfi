import { NextResponse } from "next/server"
import List from "@/app/models/List"
import { connectToDB } from "@/app/utils/db"
import Task from "@/app/models/Task"

export async function GET() {
	await connectToDB()

	const lists = await List.find({}).populate( "tasks" ).lean()

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
	const body = await req.json()
	const newList = await List.create( body )
	return NextResponse.json( newList )
}