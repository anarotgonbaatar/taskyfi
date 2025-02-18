"use client"

import { useState, useEffect } from "react"
import Task from "./Task"
import ListMenu from "./ListMenu"
import EditableText from "../components/EditableText"
import { ListProps, TaskType } from "../types"
import "./list.css"
import { FaEllipsisV } from "react-icons/fa"

export default function List({ list, setLists }: ListProps ) {
	const [ tasks, setTasks ] = useState <TaskType[]>( list.tasks || [] )
	const [ showMenu, setShowMenu ] = useState( false )

	useEffect(() => {
		const fetchTasks = async () => {
			const res = await fetch( `/api/lists/${list._id}/tasks`)
			const data = await res.json()
			setTasks( data )
		}
		fetchTasks()
	}, [ list._id ])

	const addTask = async () => {
		if ( !list._id ) return
		const res = await fetch( `/api/lists/${list._id}/tasks`, {
			method: "POST",
			body: JSON.stringify({ name: "New Task" }),
			headers: { "Content-Type": "application/json" },
		})

		const newTask: TaskType = await res.json()

		// Update both tasks and the lists
		setTasks([ newTask, ...tasks ])
		setLists(( prev ) =>
			prev.map( (l) => ( l._id === list._id ? { ...list, tasks: [ newTask, ...list.tasks ]} : l ))
		)
	}

	const updateListName = async ( newName: string ) => {
		// Check if the new name is valid
		if ( newName.trim() === "" || newName === list.name ) return
		
		const res = await fetch( `/api/lists/${list._id}`, {
			method: "PUT",
			body: JSON.stringify({ name: newName }),
			headers: { "Content-Type": "application/json" }
		})

		if ( res.ok ) {
			setLists(( prev ) =>
				prev.map((l) => ( l._id === list._id ? { ...l, name: newName } : l ))
			)
		}
	}

	return (
		<div className="list">
			<div className="list-header flex justify-between gap-2">
				<EditableText
					text={ list.name }
					onSave={ updateListName }
				/>
				<div className="flex gap-2">
					<button className="add-task-btn" onClick={ addTask } type="button">+ Task</button>
					<button className="list-menu-btn w-8" onClick={() => setShowMenu( !showMenu )} type="button" aria-label="List Menu">
						<FaEllipsisV/>
					</button>
				</div>
			</div>
			
			{ showMenu && <ListMenu list={ list } setLists={ setLists }/> }

			<div className="tasks-box flex flex-col gap-2">
				{ tasks.map(( task ) => (
					<Task key={ task._id } task={ task } setTasks={ setTasks }/>
				))}
			</div>

		</div>
	)
}