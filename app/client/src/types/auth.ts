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
