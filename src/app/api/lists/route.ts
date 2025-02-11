// Lists CRUD Routes
import { NextResponse } from "next/server"
import List from "@/app/models/List"
import { connectToDB } from "@/app/utils/db"

export async function GET() {
	await connectToDB()
	const lists = await List.find({})
	return NextResponse.json( lists )
}

export async function POST( req: Request ) {
	await connectToDB()
	const body = await req.json()
	const newList = await List.create( body )
	return NextResponse.json( newList )
}