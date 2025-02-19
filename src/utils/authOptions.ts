// NextAuth entication settings

import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/app/utils/db"
import User, { IUser } from "@/app/models/User"
import bcrypt from "bcrypt"
import type { AuthOptions } from "next-auth"
import mongoose from "mongoose"
import { Session } from "next-auth"

declare module "next-auth" {
	interface Session {
		user: {
			id: string
			name?: string | null
			email?: string | null
			profilePic?: string | null
		}
	}
}

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
				const user: IUser | null = await User.findOne({ email }).select( "+password" )

				if ( !user ) {
					throw new Error( "Account doesn't exist. ")
				}

				// Compare hashed password
				const isValid = await bcrypt.compare( password, user.password )
				if ( !isValid ) {
					throw new Error( "Invalid credentials." )
				}

				return {
					id: user._id.toString(),
					email: user.email,
					name: user.fName,
				}
			},
		}),
	],

	session: {
		strategy: "jwt",
	},

	callbacks: {
		async session({ session, token }) {
			if ( !session?.user || !session.user.email ) return session

			const dbUser = await User.findOne({ email: session.user.email }).select( "_id" )

			if ( dbUser ) {
				return {
					...session,
					user: {
						id: dbUser._id.toString(),
						name: session.user.name,
						email: session.user.email,
						profilePic: session.user.profilePic,
					}
				}
			}
			return session
		}
	},

	secret: process.env.NEXTAUTH_SECRET
}

export default authOptions