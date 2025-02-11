// Backend sign up API

import { NextResponse } from "next/server"
import { connectToDB } from "@/app/utils/db"
import User from "@/app/models/User"
import List from "@/app/models/List"
import Task from "@/app/models/Task"
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

	// Create an initial list and task for new user
	const initialList = new List({
		name: "My Tasks",
		userId: user._id,
	})
	await initialList.save()

	const initialTask = new Task({
		name: "My first task",
		listId: initialList._id,
	})
	await initialTask.save()

	return NextResponse.json({ message: "User account created successfully." }, { status: 201 })
}