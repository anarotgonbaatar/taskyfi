import EditableText from "../components/EditableText"
import { TaskProps } from "@/types"

export default function Task({ task }: TaskProps ) {
	return (
		<div>
			<EditableText
				text={ task.name }
				onSave={( newName: string ) => console.log( "Save task name:", newName )}
			/>
		</div>
	)
}