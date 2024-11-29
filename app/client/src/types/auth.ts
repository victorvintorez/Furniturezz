export interface User {
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

export type RegisterFormValues = {
	username: string;
	title: "Mr" | "Mrs" | "Miss" | "Ms" | "Dr" | "Prof" | "Rev" | "Lord" | "Lady";
	firstName: string;
	lastName: string;
	gender: "Male" | "Female" | "Non-Binary" | "Not Listed";
	address1: string;
	address2: string | null;
	address3: string | null;
	postcode: string;
	description: string;
	email: string;
	telephone: string;
	password: string;
	profileImage: File | null; // File must allow null at first for setting initial value
}
