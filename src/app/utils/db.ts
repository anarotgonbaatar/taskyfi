// MongoDB Connection
import mongoose from "mongoose"
import { MongoClient } from "mongodb"

const MONGO_URI = process.env.MONGO_URI || ""

if ( !MONGO_URI ) {
	throw new Error( "MONGO_URI not defined in env." )
}

declare global {
	var _mongoClientPromise: Promise<MongoClient>
}

let client
let clientPromise: Promise<MongoClient>

if ( mongoose.connection.readyState < 1 ) {
	mongoose.connect( MONGO_URI )
}

if ( global._mongoClientPromise ) {
	clientPromise = global._mongoClientPromise
} else {
	client = new MongoClient( MONGO_URI )
	global._mongoClientPromise = client.connect()
	clientPromise = global._mongoClientPromise
}

export async function connectToDB() {
	if ( mongoose.connection.readyState < 1 ) {
		await mongoose.connect( MONGO_URI )
	}
}
export default clientPromise