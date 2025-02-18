// Tasks schema
import mongoose, { mongo, Schema } from "mongoose"

const TaskSchema = new Schema({
	name: { type: String, required: true },
	details: { type: String },
	listId: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
	dueDate: { type: Date },
	priority: { type: String, enum: [ "low", "medium", "high" ] },
	subtasks: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
})

export default mongoose.models.Task || mongoose.model( "Task", TaskSchema )