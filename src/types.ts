export interface TaskType {
	_id: string;
	name: string;
}

export interface ListType {
	_id: string;
	name: string;
	tasks: TaskType[];
}

export interface ListMenuProps {
	list: ListType;
	setLists: React.Dispatch<React.SetStateAction<ListType[]>>;
}

export interface ListProps {
	list: ListType;
	setLists: React.Dispatch<React.SetStateAction<ListType[]>>;
}

export interface TaskProps {
	task: TaskType;
}
