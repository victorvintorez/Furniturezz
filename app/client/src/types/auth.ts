export interface User {
	id: number;
	username: string;
	title: string;
	firstName: string;
	lastName: string;
	gender: string;
	address1: string;
	address2: string | null;
	address3: string | null;
	postcode: string;
	description: string | null;
	email: string;
	telephone: string;
	profileImageUrl: string;
}

export type LoginFormValues = {
	username: string;
	password: string;
}

export interface RegisterFormValues {
	username: string;
	password: string;
	email: string;
	telephone: string;
	profileImage: File | null; // File must allow null at first for setting initial value
	title: "Mr" | "Mrs" | "Miss" | "Ms" | "Dr" | "Prof" | "Rev" | "Lord" | "Lady" | "Not Listed" | "";
	firstName: string;
	lastName: string;
	gender: "Male" | "Female" | "Non-Binary" | "Not Listed" | "";
	description: string;
	address1: string;
	address2: string | null;
	address3: string | null;
	postcode: string;
}