import { useState } from "react"
import EditableText from "../components/EditableText"
import { TaskProps } from "../types"
import { TaskType } from "../types"
import "./task.css"
// React icons
import { FaTrash, FaEllipsisV, FaCalendar, FaCopy } from "react-icons/fa"
import { FaArrowRightArrowLeft, FaTurnDown } from "react-icons/fa6"

export default function Task({ task, setTasks }: TaskProps ) {
	const [ isCompleted, setIsCompleted ] = useState( task.completed )
	const [ showMenu, setShowMenu ] = useState( false )
	
	const toggleComplete = async () => {
		const updatedTask = { ...task, completed: !isCompleted }
		setIsCompleted( !isCompleted )

		await fetch( `/api/tasks/${task._id}`, {
			method: "PUT",
			body: JSON.stringify({ completed: !isCompleted }),
			headers: { "Content-Type": "application/json" },
		})

		// Move/reorder completed tasks to bottom
		setTasks(( prev: TaskType[] ) =>
			[ ...prev.filter(( t: TaskType ) => t._id !== task._id ), updatedTask ].sort(
				( a, b ) => Number( a.completed ) - Number( b.completed )
			)
		)
	}

	const updateTask = async ( field: string, value: any ) => {
		setTasks( prev => prev.map( t => t._id === task._id ? { ...t, [ field ]: value } : t ))
		
		await fetch( `/api/tasks/${task._id}`, {
			method: "PUT",
			body: JSON.stringify({ [field]: value }),
			headers: { "Content-Type": "application/json" },
		})
	}

	const deleteTask = async () => {
		await fetch( `/api/tasks/${task._id}`, { method: "DELETE" })
		setTasks(( prev: TaskType[] ) => prev.filter((t) => t._id !== task._id ))
	}

	const priorityColors: Record <"none" | "low" | "medium" | "high", string> = {
		none: "transparent",
		low: "bg-green-700",
		medium: "bg-yellow-700",
		high: "bg-red-700",
	}

	return (
		<div className={ `task ${ priorityColors[ task.priority ]} ${ isCompleted ? "completed" : "" }` }>
			<div className="task-content flex">
				<input
					id={ `completed-${task._id}` }
					type="checkbox"
					checked={ isCompleted }
					onChange={ toggleComplete }
					aria-label="Mark task completed"
					className="checkbox"
				/>
				<EditableText
					text={ task.name ?? "" }
					onSave={( newName: string ) => updateTask( "name", newName )}
				/>
				<div className="flex ml-auto gap-2">
					<FaTrash onClick={ deleteTask } className="task-btn"/>
					<FaEllipsisV onClick={() => setShowMenu( !showMenu )} className="task-btn"/>
				</div>
			</div>
			{ showMenu && (
				<div className="flex gap-2 pl-10">
					<FaTurnDown className="task-btn"/>
					<FaCopy className="task-btn"/>
					<FaCalendar className="task-btn"/>
					<select 
						id={ `priority-${task._id}` }
						value={ task.priority }
						onChange={(e) => updateTask("priority", e.target.value)}
						aria-label="Select task priority"
						className="priority-drop"
					>
						<option value="none">None</option>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>
			)}
			<div className="subtasks-box">
				{ task.subtasks?.map(( subtask ) => (
					<div key={ subtask._id } className="subtask">
						<Task task={ subtask } setTasks={ setTasks }/>
					</div>
				))}
			</div>
		</div>
	)
}