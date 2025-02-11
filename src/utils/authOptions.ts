// NextAuth entication settings

import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/app/utils/db"
import User, { IUser } from "@/app/models/User"
import bcrypt from "bcrypt"
import type { AuthOptions } from "next-auth"
import mongoose from "mongoose"

export const authOptions: AuthOptions = {
	adapter: MongoDBAdapter( clientPromise ),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},

			async authorize( credentials ) {
				if ( !credentials?.email || !credentials.password ) {
					throw new Error( "Both email and password are required." )
				}
				const { email, password } = credentials

				// Ensure DB connection
				await clientPromise

				// Find user account in DB
				const user: IUser | null = await User.findOne({ email })

				if ( !user ) {
					throw new Error( "Account doesn't exist. ")
				}

				// Compare hashed password
				const isValid = await bcrypt.compare( password, user.password )
				if ( !isValid ) {
					throw new Error( "Invalid credentials." )
				}

				return {
					// Ensure id is treated as ObjectId
					id: ( user._id as mongoose.Types.ObjectId ).toString(),
					email: user.email,
					name: user.fName,
				}
			},
		}),
	],

	session: {
		strategy: "jwt",
	},

	secret: process.env.NEXTAUTH_SECRET
}