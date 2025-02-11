// Backend sign up API

import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import User from "@/app/models/User"
import bcrypt from "bcrypt"

export async function POST( req: Request ) {
	await connectToDB()
	const { fName, lName, email, password } = await req.json()

	// Check if user account exists
	const userExists = await User.findOne({ email })
	if ( userExists ) {
		return NextResponse.json({ message: "Account already exists." }, { status: 400 })
	}

	// Hash password
	const hashedPassword = await bcrypt.hash( password, 10 )

	// Create new user account
	const user = new User({ fName, lName, email, password: hashedPassword })
	await user.save()

	return NextResponse.json({ message: "User account created successfully." }, { status: 201 })
}