export type TaskType = {
	id: string
	title: string
	details?: string
	completed: boolean
	priority: string
	files: File[]
	subtasks: SubTaskType[]
}

export type SubTaskType = {
	id: string
	title: string
	details?: string
	completed: boolean
	priority: string
}
