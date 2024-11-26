const getUserDetails = async () => {
	const res = await fetch("/api/user/", {
		credentials: "include",
	});
	if (!res.ok) throw new Error("Failed to fetch user data");
	return res.json();
}

const login = async (username: string, password: string) => {
	const res = await fetch("/api/auth/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({username, password}),
	});
	if (!res.ok) throw new Error("Failed to login");
	return res.json();
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
};