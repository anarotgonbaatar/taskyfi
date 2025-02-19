import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import User from "@/app/models/User"
import { connectToDB } from "@/app/utils/db"

export async function GET() {
	await connectToDB()
	const session = await getServerSession( authOptions )

	if (!session) {
		return NextResponse.json({ error: "Error: Not authenticated" }, { status: 401 })
	}

	if ( !session || !session.user || !session.user.email ) {
		return NextResponse.json({ error: "Error: not authenticated."}, { status: 401 })
	}
	const user = await User.findOne({ email: session.user.email })

	if (!user) {
		return NextResponse.json({ error: "Error: User not found" }, { status: 404 })
	}

	return NextResponse.json({
		fName: user.fName,
		lName: user.lName,
		email: user.email,
		profilePic: user.profilePic || "",
	})
}

export async function PUT(req: Request) {
	await connectToDB()
	const session = await getServerSession(authOptions)

	if ( !session || !session.user || !session.user.email ) {
		return NextResponse.json({ error: "Error: not authenticated."}, { status: 401 })
	}

	const { fName, lName, email } = await req.json()
	const user = await User.findOneAndUpdate(
		{ email: session.user.email },
		{ fName, lName, email },
		{ new: true }
	)

	return NextResponse.json(user)
}