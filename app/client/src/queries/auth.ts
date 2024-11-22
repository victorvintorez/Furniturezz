export const getUserDetails = async () => {
	const res = await fetch("/api/user/");
	if (!res.ok) throw new Error("Failed to fetch user data");
	return res.json();
}

export const login = async (username: string, password: string) => {
	const res = await fetch("/api/auth/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});
	if (!res.ok) throw new Error("Failed to login");
	return res.json();
}