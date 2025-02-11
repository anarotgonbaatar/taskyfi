import { useState } from "react"
import Task from "./Task"
import ListMenu from "./ListMenu"
import EditableText from "../components/EditableText"
import { ListProps, TaskType } from "@/types"
import "./list.css"

export default function List({ list, setLists }: ListProps ) {
	const [ tasks, setTasks ] = useState <TaskType[]> ( list.tasks )
	const [ showMenu, setShowMenu ] = useState( false )

	const addTask = async () => {
		const res = await fetch( `/api/lists/${list._id}/tasks`, {
			method: "POST",
			body: JSON.stringify({ name: "New Task "}),
			headers: { "Content-Type": "application/json" },
		})

		const newTask: TaskType = await res.json()
		setTasks([ ...tasks, newTask ])
	}

	const updateListName = async ( newName: string ) => {
		await fetch( `/api/lists/${list._id}`, {
			method: "PUT",
			body: JSON.stringify({ name: newName }),
			headers: { "Content-Type": "application/json" }
		})

		setLists(( prev ) =>
			prev.map((l) => ( l._id === list._id ? { ...l, name: newName } : l ))
		)
	}

	return (
		<div className="list">
			<div className="list-header flex">
				<EditableText
					text={ list.name }
					onSave={ updateListName }
				/>
				<button onClick={() => setShowMenu( !showMenu )} type="button">
					:
				</button>
				<button onClick={ addTask } type="button">+ Task</button>
			</div>

			<div className="tasks-box">
				{ tasks.map(( task ) => (
					<Task key={ task._id } task={ task }/>
				))}
			</div>

			{ showMenu && <ListMenu list={ list } setLists={ setLists }/> }
		</div>
	)
}