// Lists schema
import mongoose, { Schema } from "mongoose"

const ListSchema = new Schema({
	name: { type: String, required: true },
	taskCount: { type: Number, default: 0 },
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
})

export default mongoose.models.List || mongoose.model( "List", ListSchema )