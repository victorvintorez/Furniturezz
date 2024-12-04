import {Anchor, Button, PasswordInput, Stack, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {auth} from "../../queries/auth.ts";
import {LoginFormValues} from "../../types/auth.ts";
import {modals} from "@mantine/modals";


const LoginForm = () => {
	const form = useForm<LoginFormValues>({
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
	const loginMutation = useMutation({
		mutationKey: auth.loginMutOptions.key,
		mutationFn: async (values: LoginFormValues) => await auth.loginMutOptions.fn(values),
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: ["auth.user"], refetchType: "all"})
			return modals.closeAll();
		}
	});

	return (
		<form onSubmit={form.onSubmit((values) => loginMutation.mutate(values))}>
			<Stack align="stretch" gap={0}>
				<TextInput withAsterisk data-autofocus size="lg" label="Username"
				           placeholder="johndoe@email.com" pt="sm" {...form.getInputProps("username")} />
				<PasswordInput withAsterisk size="lg" label="Password"
				               placeholder="Password" pt="sm" {...form.getInputProps("password")} />
				<Anchor pb="sm">Forgotten Password?</Anchor>
				<Button fullWidth type="submit" size="lg" loading={loginMutation.isPending}>Login</Button>
			</Stack>
		</form>
	)
}

export default LoginForm;