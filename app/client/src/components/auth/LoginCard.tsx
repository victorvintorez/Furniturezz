import {Anchor, Button, PasswordInput, Stack, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login} from "../../queries/auth.ts";

type FormValues = {
	username: string;
	password: string;
}

const LoginCard = () => {
	const form = useForm<FormValues>({
		mode: "uncontrolled",
		initialValues: {
			username: "",
			password: "",
		},
		validate: {
			username: (value) => value.length === 0 ? "Username is required" : null,
			password: (value) => value.length === 0 ? "Password is required" : null,
		},
	})
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (values: FormValues) => await login(values.username, values.password),
		onSuccess: () => queryClient.invalidateQueries({queryKey: ["auth.user"], refetchType: "active"})
	});

	return (
		<form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
			<Stack align="stretch" gap={0}>
				<TextInput withAsterisk size="lg" label="Username"
				           placeholder="johndoe@email.com" px="lg" pt="sm" {...form.getInputProps("username")} />
					<PasswordInput withAsterisk size="lg" label="Password"
					               placeholder="Password" px="lg" pt="sm" {...form.getInputProps("password")} />
					<Anchor px="lg" pb="sm">Forgotten Password?</Anchor>
				<Button fullWidth type="submit" loading={mutation.isPending}>Login</Button>
			</Stack>
		</form>
	)
}

export default LoginCard;