import { ListMenuProps } from "@/types"

export default function ListMenu({ list, setLists }: ListMenuProps ) {
	const deleteList = async () => {
		await fetch( `/api/lists/${ list._id }`, { method: "DELETE" } )
		setLists( ( prev ) => prev.filter((l) => l._id !== list._id ) )
	}

	return (
		<div>
			<button className="" type="button">Duplicate</button>
			<button className="" type="button">Change Color</button>
			<button onClick={ deleteList } className="" type="button">Delete</button>
		</div>
	)
}