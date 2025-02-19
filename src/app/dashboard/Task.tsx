import EditableText from "../components/EditableText"
import DatePicker from "react-datepicker"
import { useRef, useState } from "react"
import { TaskProps } from "../types"
import { TaskType } from "../types"

import "react-datepicker/dist/react-datepicker.css"
import "./task.css"
// React icons
import { FaTrash, FaEllipsisV, FaCalendar, FaCopy, FaAngleDown } from "react-icons/fa"
import { FaArrowRightArrowLeft, FaTurnDown } from "react-icons/fa6"

export default function Task({ task, setTasks }: TaskProps ) {
	const [ isCompleted, setIsCompleted ] = useState( task.completed ?? false )
	const [ showMenu, setShowMenu ] = useState( false )
	const menuRef = useRef<HTMLDivElement | null>( null )
	const [ showCalendar, setShowCalendar ] = useState( false )
	
	// Toggle task completion state
	const toggleComplete = async () => {
		const newCompletedState = !isCompleted
		setIsCompleted( newCompletedState )

		const res = await fetch( `/api/tasks/${task._id}`, {
			method: "PUT",
			body: JSON.stringify({ completed: newCompletedState }),
			headers: { "Content-Type": "application/json" },
		})

		if ( res.ok ) {
			setTasks( ( prev ) => {
				// Update completion state
				const updatedTasks = prev.map( (t) =>
					t._id === task._id? { ...t, completed: newCompletedState } : t
				)
				// Sort completed tasks last
				// return updatedTasks.sort( ( a, b ) => Number( a.completed ) - Number( b.completed ) )
				return updatedTasks
			})
		} else {
			console.error( "Error: Failed to update task completion state." )
		}
	}

	// Update task
	const updateTask = async ( field: string, value: any ) => {
		setTasks( prev => prev.map( t => t._id === task._id ? { ...t, [ field ]: value } : t ))
		
		await fetch( `/api/tasks/${task._id}`, {
			method: "PUT",
			body: JSON.stringify({ [field]: value }),
			headers: { "Content-Type": "application/json" },
		})
	}

	// Duplicate Task
	const duplicateTask = async () => {
		const newTask = {
			name: task.name + " (Copy)",
			details: task.details || "",
			listId: task.listId,
			dueDate: task.dueDate || null,
			priority: task.priority ?? "none",
			parentTask: task.parentTask || null,
			completed: task.completed ?? false,
		}

		const res = await fetch(`/api/tasks`, {
			method: "POST",
			body: JSON.stringify(newTask),
        	headers: { "Content-Type": "application/json" },
		})

		if ( res.ok ) {
			const duplicatedTask = await res.json()
			setTasks( (prev) => [ ...prev, duplicatedTask ])
		}
	}

	// Delete task
	const deleteTask = async () => {
		await fetch( `/api/tasks/${task._id}`, { method: "DELETE" })
		setTasks(( prev: TaskType[] ) => prev.filter((t) => t._id !== task._id ))
	}

	const subtasks = task.subtasks ?? []

	return (
		<div
			className={ `task relative priority-${task.priority} ${isCompleted ? "completed" : ""}` }
			// onMouseLeave={() => setShowMenu( false )}
		>
			<div className="task-content flex">
				{/* Checkbox */}
				<input
					id={ `completed-${task._id}` }
					type="checkbox"
					checked={ isCompleted }
					onChange={ toggleComplete }
					aria-label="Mark task completed"
					className="checkbox"
				/>
				{/* Name */}
				<EditableText
					text={ task.name ?? "" }
					onSave={( newName: string ) => updateTask( "name", newName )}
				/>
				{/* Buttons */}
				<div className="task-btns-box flex ml-auto gap-2">
					<FaTrash onClick={ deleteTask } className="task-btn delete-btn"/>
					<FaAngleDown onClick={() => setShowMenu( !showMenu )} className="task-btn"/>
				</div>
			</div>

			{/* Due date: Only if task has dueDate */}
			{ task.dueDate && (
				<div className="due-date">
					{ new Date( task.dueDate ).toLocaleDateString( "en-us", {
						month: "short",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
						hour12: true,
					})}
				</div>
			)}

			{/* Task Menu */}
			{ showMenu && (
				<div ref={ menuRef } className="flex gap-2 pl-10 mt-1">
					{/* Subtasks button */}
					<FaTurnDown className="task-btn"/>

					{/* Duplicate Button */}
					<FaCopy className="task-btn" onClick={ duplicateTask }/>

					{/* Calendar Button */}
						<FaCalendar className="task-btn" onClick={() => setShowCalendar( !showCalendar )}/>
						{ showCalendar && (
							<div className="datepicker-box">
								<DatePicker
									selected={ task.dueDate ? new Date( task.dueDate ) : null }
									onChange={ (date) => {
										updateTask( "dueDate", date )
										setShowCalendar( false )
									}}
									showTimeSelect
									dateFormat="Pp"
									inline
								/>
							</div>
						)}

					{/* Priority Button */}
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
				{ subtasks.map( (subtask) => (
					<div key={ subtask._id} className="subtask">
						<Task task={ subtask } setTasks={ setTasks }/>
					</div>
				))}
			</div>
		</div>
	)
}