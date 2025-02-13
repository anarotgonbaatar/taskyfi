"use client"

import { useState } from "react"
import "./editable-text.css"

interface EditableTextProps {
	text: string
	onSave: ( newText: string ) => void
}

export default function EditableText({ text, onSave }: EditableTextProps ) {
	const [ isEditing, setIsEditing ] = useState( false )
	const [ value, setValue ] = useState( text )

	const handleSave = () => {
		if ( value.trim() !== "" && value !== text ) {
			onSave( value )
		}
		setIsEditing( false )
	}

	// Also save when pressed "Enter" key
	const handleKeyDown = ( e: React.KeyboardEvent <HTMLInputElement> ) => {
		if ( e.key === "Enter" ) {
			handleSave()
		}
	}

	return isEditing ? (
		<input
			className="editing"
			value={ value }
			onChange={(e) => setValue( e.target.value )}
			onBlur={ handleSave }
			onKeyDown={ handleKeyDown }
			autoFocus
			type="text"
			placeholder="Edit text"
			aria-label="Editable text input"
		/>
	) : (
		<p onClick={() => setIsEditing( true )} className="name cursor-pointer"> { text } </p>
	)
}