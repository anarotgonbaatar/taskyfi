// Lists schema
import mongoose, { Schema } from "mongoose"

const ListSchema = new Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	name: { type: String, required: true },
	taskCount: { type: Number, default: 0 },
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
}, { timestamps: true })

export default mongoose.models.List || mongoose.model( "List", ListSchema )