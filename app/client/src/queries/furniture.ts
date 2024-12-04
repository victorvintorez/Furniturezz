import {AddFurnitureFormValues, EditFurnitureFormValues} from '../types/furniture';

const getAllFurniture = async () => {
	const res = await fetch('/api/furniture/', {
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Failed to get furniture');
	return res.json();
}

const addFurniture = async (values: AddFurnitureFormValues) => {
	const formData = new FormData();
	Object.keys(values).forEach((key) => {
		const value = values[key as keyof AddFurnitureFormValues];
		if (value !== undefined && value !== null) {
			if (value instanceof Array && value.every((v) => v instanceof File)) {
				value.forEach((v) => formData.append(key, v));
			} else {
				formData.append(key, value as string | File);
			}
		}
	});

	const res = await fetch('/api/furniture/', {
		method: 'POST',
		credentials: 'include',
		body: formData,
	});

	if (!res.ok) throw new Error('Failed to add furniture');
	return;
}

const editFurniture = async (id: number, values: EditFurnitureFormValues) => {
	const formData = new FormData();
	Object.keys(values).forEach((key) => {
		const value = values[key as keyof AddFurnitureFormValues];
		if (value !== undefined && value !== null) {
			if (value instanceof Array && value.every((v) => v instanceof File)) {
				value.forEach((v) => formData.append(key, v));
			} else {
				formData.append(key, value as string | File);
			}
		}
	});

	const res = await fetch(`/api/furniture/${id}/`, {
		method: 'PATCH',
		credentials: 'include',
		body: formData,
	});

	if (!res.ok) throw new Error('Failed to edit furniture');
	return;
}

const deleteFurniture = async (id: number) => {
	const res = await fetch(`/api/furniture/${id}/`, {
		method: 'DELETE',
		credentials: 'include',
	});

	if (!res.ok) throw new Error('Failed to delete furniture');
	return;
}

export const furniture = {
	getAllFurnitureOptions: {
		key: ['furniture.all'],
		fn: getAllFurniture,
		stale: 2 * 60 * 1000,
	},
	addFurnitureMutOptions: {
		key: ['furniture.add'],
		fn: addFurniture,
	},
	editFurnitureMutOptions: {
		key: ['furniture.edit'],
		fn: editFurniture,
	},
	deleteFurnitureMutOptions: {
		key: ['furniture.delete'],
		fn: deleteFurniture,
	},
};