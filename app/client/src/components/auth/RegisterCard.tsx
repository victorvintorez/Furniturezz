import {Button, FileInput, PasswordInput, Select, Stack, Stepper, TextInput} from "@mantine/core";
import {formats} from "../../utils/formats.ts";
import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "@tanstack/react-router";
import {auth} from "../../queries/auth.ts";
import {RegisterFormValues} from "../../types/auth.ts";
import {useState} from "react";

const RegisterCard = () => {
	const form = useForm<RegisterFormValues>({
		mode: "uncontrolled",
		initialValues: {
			username: "",
			title: "Mr",
			firstName: "",
			lastName: "",
			gender: "Male",
			address1: "",
			address2: "",
			address3: "",
			postcode: "",
			description: "",
			email: "",
			telephone: "",
			password: "",
			profileImage: null,
		},
		validate: {
			username: (value) => value.length === 0 ? "Username is required" : null,
			firstName: (value) => value.length === 0 ? "First name is required" : null,
			lastName: (value) => value.length === 0 ? "Last name is required" : null,
			postcode: (value) => !formats.IsUkPostcode.test(value) ? "Invalid postcode" : null,
			email: (value) => !/^\S+@\S+$/.test(value) ? "Invalid email" : null,
			telephone: (value) => !formats.IsUkTelephone.test(value) ? "Invalid telephone number" : null,
			password: (value) => !formats.IsValidPassword.test(value) ? "Password must be at least 8 characters long and include letters, numbers, and special characters" : null,
			profileImage: (value) => value === null ? "Profile image is required" : null,
		},
	})

	const [step, setStep] = useState(0);
	const nextStep = () => setStep(step + 1);
	const prevStep = () => setStep(step - 1);

	const queryClient = useQueryClient();
	const navigate = useNavigate()
	const registerMutation = useMutation({
		mutationKey: auth.registerMutOptions.key,
		mutationFn: async (values: RegisterFormValues) => await auth.registerMutOptions.fn(values),
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: ["auth.user"], refetchType: "all"})
			return navigate({to: "/auth"})
		}
	});

	return (
		<form onSubmit={form.onSubmit((values) => registerMutation.mutate(values))}>
			<Stepper active={step} allowNextStepsSelect={false}>
				<Stepper.Step label="User Details" description="Personal Details">
					<Stack align="stretch" gap={0}>
						<TextInput withAsterisk size="lg" label="Username" placeholder="johndoe" px="lg" pt="sm" {...form.getInputProps("username")} />
						<Select withAsterisk size="lg" label="Title" data={["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof", "Rev", "Lord", "Lady"]} px="lg" pt="sm" {...form.getInputProps("title")} />
						<TextInput withAsterisk size="lg" label="First Name" placeholder="John" px="lg" pt="sm" {...form.getInputProps("firstName")} />
						<TextInput withAsterisk size="lg" label="Last Name" placeholder="Doe" px="lg" pt="sm" {...form.getInputProps("lastName")} />
						<Select withAsterisk size="lg" label="Gender" data={["Male", "Female", "Non-Binary", "Not Listed"]} px="lg" pt="sm" {...form.getInputProps("gender")} />
					</Stack>
				</Stepper.Step>
				<Stepper.Step label="User Details" description="Address Details">
					<Stack align="stretch" gap={0}>
						<TextInput withAsterisk size="lg" label="Address 1" placeholder="123 Main St" px="lg" pt="sm" {...form.getInputProps("address1")} />
						<TextInput size="lg" label="Address 2" placeholder="Apt 4B" px="lg" pt="sm" {...form.getInputProps("address2")} />
						<TextInput size="lg" label="Address 3" placeholder="Suite 5" px="lg" pt="sm" {...form.getInputProps("address3")} />
						<TextInput withAsterisk size="lg" label="Postcode" placeholder="AB12 3CD" px="lg" pt="sm" {...form.getInputProps("postcode")} />
					</Stack>
				</Stepper.Step>
				<Stepper.Step label="User Details" description="Contact Details">
					<Stack align="stretch" gap={0}>
						<TextInput size="lg" label="Description" placeholder="Tell us about yourself" px="lg" pt="sm" {...form.getInputProps("description")} />
						<TextInput withAsterisk size="lg" label="Email" placeholder="johndoe@email.com" px="lg" pt="sm" {...form.getInputProps("email")} />
						<TextInput withAsterisk size="lg" label="Telephone" placeholder="+441234567890" px="lg" pt="sm" {...form.getInputProps("telephone")} />
						<PasswordInput withAsterisk size="lg" label="Password" placeholder="Password" px="lg" pt="sm" {...form.getInputProps("password")} />
						<FileInput withAsterisk size="lg" label="Profile Image" placeholder="Upload your profile image" px="lg" pt="sm" {...form.getInputProps("profileImage")} />
						<Button fullWidth type="submit" loading={registerMutation.isPending}>Register</Button>
					</Stack>
				</Stepper.Step>
			</Stepper>
		</form>
	)
}

export default RegisterCard;