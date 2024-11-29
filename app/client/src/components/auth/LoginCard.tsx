import {Anchor, Button, PasswordInput, Stack, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {auth} from "../../queries/auth.ts";
import {useNavigate} from "@tanstack/react-router";
import {LoginFormValues} from "../../types/auth.ts";



const LoginCard = () => {
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
	const navigate = useNavigate()
	const loginMutation = useMutation({
		mutationKey: auth.loginMutOptions.key,
		mutationFn: async (values: LoginFormValues) => await auth.loginMutOptions.fn(values),
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: ["auth.user"], refetchType: "all"})
			return navigate({to: "/"})
		}
	});

	return (
		<form onSubmit={form.onSubmit((values) => loginMutation.mutate(values))}>
			<Stack align="stretch" gap={0}>
				<TextInput withAsterisk size="lg" label="Username"
				           placeholder="johndoe@email.com" px="lg" pt="sm" {...form.getInputProps("username")} />
				<PasswordInput withAsterisk size="lg" label="Password"
				               placeholder="Password" px="lg" pt="sm" {...form.getInputProps("password")} />
				<Anchor px="lg" pb="sm">Forgotten Password?</Anchor>
				<Button fullWidth type="submit" loading={loginMutation.isPending}>Login</Button>
			</Stack>
		</form>
	)
}

export default LoginCard;