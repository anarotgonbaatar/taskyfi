import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import User from "@/app/models/User"
import { connectToDB } from "@/app/utils/db"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
	await connectToDB()
	const session = await getServerSession(authOptions)

	if ( !session || !session.user || !session.user.email ) {
		return NextResponse.json({ error: "Error: not authenticated."}, { status: 401 })
	}

	const formData = await req.formData()
	const file = formData.get("profilePic") as File

	if (!file) {
		return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
	}

	const filePath = path.join(process.cwd(), "public/uploads", `${session.user.email}.jpg`)
	const bytes = await file.arrayBuffer()
	await writeFile(filePath, Buffer.from(bytes))

	// Save file path in database
	const user = await User.findOneAndUpdate(
		{ email: session.user.email },
		{ profilePic: `/uploads/${session.user.email}.jpg` },
		{ new: true }
	)

	if ( !user ) {
		return NextResponse.json({ error: "Error: User not found." }, { status: 404 })
	}

	return NextResponse.json({ profilePic: user.profilePic })
}