// Tasks schema
import mongoose, { mongo, Schema } from "mongoose"

const TaskSchema = new Schema({
	name: { type: String, required: true },
	details: { type: String },
	dueDate: { type: Date },
	priority: { type: String, enum: [ "low", "medium", "high" ] },
	subtasks: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
})

export default mongoose.models.Task || mongoose.model( "Task", TaskSchema )