export type TaskType = {
	_id: string
	name: string
	details?: string
	completed: boolean
	priority: "none" | "low" | "medium" | "high"
	files: File[]
	subtasks?: TaskType[]
	dueDate?: string
	listId: string
	parentTask?: string
}

export interface TaskProps {
	task: TaskType
	setTasks: React.Dispatch <React.SetStateAction <TaskType[]>>
}

export type ListType = {
	_id: string
	name: string
	tasks: TaskType[]
}

export interface ListProps {
	list: ListType
	setLists: React.Dispatch <React.SetStateAction <ListType[]>>
}