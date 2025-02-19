// Tasks schema
import mongoose, { Schema } from "mongoose"

const TaskSchema = new Schema({
	name: { type: String, required: true },
	details: { type: String },
	listId: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
	dueDate: { type: Date },
	priority: { type: String, enum: [ "none", "low", "medium", "high" ], default: "none" },
	parentTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
	subtasks: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
	completed: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.models.Task || mongoose.model( "Task", TaskSchema )