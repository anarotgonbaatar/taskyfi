import mongoose from "mongoose"
import { MongoClient } from "mongodb"

const MONGO_URI = process.env.MONGO_URI ?? ""

if ( !MONGO_URI ) {
	throw new Error("MONGO_URI is not defined in the environment variables.")
}

// Ensure MongoDB connection is cached across hot reloads in development
declare global {
	var _mongoClientPromise: Promise<MongoClient> | undefined
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if ( !global._mongoClientPromise ) {
	client = new MongoClient( MONGO_URI )
	global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export async function connectToDB() {
	if ( mongoose.connection.readyState === 0 ) {
		await mongoose.connect( MONGO_URI )
	}
}

export default clientPromise
