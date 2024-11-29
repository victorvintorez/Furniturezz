import {LoginFormValues, RegisterFormValues} from "../types/auth.ts";

const getUserDetails = async () => {
	const res = await fetch("/api/user/", {
		credentials: "include",
	});
	switch (res.status) {
		case 200:
			return res.json();
		case 401:
			return null;
		case 422:
			throw new Error("Validation Error");
		default:
			throw new Error("Failed to get user details: " + res.status);
	}
}

const login = async (values: LoginFormValues) => {
	const res = await fetch("/api/auth/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(values),
	});
	if (!res.ok) throw new Error("Failed to login");
	return;
}

const logout = async () => {
	const res = await fetch("/api/auth/logout/", {
		credentials: "include",
	});
	if (!res.ok) throw new Error("Failed to logout");
	return;
}

const register = async (values: RegisterFormValues) => {
	const formData = new FormData();
	Object.keys(values).forEach((key) => {
		const value = values[key as keyof RegisterFormValues];
		if (value !== undefined && value !== null) {
			formData.append(key, value);
		}
	});

	const res = await fetch("/api/auth/register/", {
		method: "POST",
		credentials: "include",
		body: formData,
	});

	if (!res.ok) throw new Error("Failed to register");
	return;
}

export const auth = {
	userDetailOptions: {
		key: ["auth.user"],
		fn: getUserDetails,
		stale: Infinity,
	},
	loginMutOptions: {
		key: ["auth.login"],
		fn: login,
	},
	logoutMutOptions: {
		key: ["auth.logout"],
		fn: logout,
	},
	registerMutOptions: {
		key: ["auth.register"],
		fn: register,
	}
};