import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IUser extends Document {
	_id: Types.ObjectId
	fName: string
	lName: string
	email: string
	password: string	// password will be hashed
	createdTime: Date
	updatedTime: Date
}

const UserSchema: Schema< IUser > = new Schema(
	{
		fName: { type: String, required: true },
		lName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }	// auto add created and updated time fields
)

const User: Model< IUser > = mongoose.models.User || mongoose.model< IUser >( "User", UserSchema )

export default User