export interface Furniture {
	id: number;
	userId: number;
	make: string;
	model: string;
	color: string;
	type: string;
	location: string;
	year: string;
	videoUrl: string;
	images: {
		id: number;
		imageUrl: string;
	}[];
	user: {
		username: string;
		description: string | null;
		email: string;
		telephone: string;
		profileImageUrl: string;
	};
}

export interface AddFurnitureFormValues {
	make: string;
	model: string;
	color: string;
	type: string;
	location: string;
	year: string;
	video: File | null;
	images: File[];
}

export interface EditFurnitureFormValues {
	make: string | null;
	model: string | null;
	color: string | null;
	type: string | null;
	location: string | null;
	year: string | null;
	video: File | null;
	images: File[] | null;
}