import {
	Button,
	FileInput,
	PasswordInput,
	Select,
	Stack,
	Stepper,
	TextInput,
} from "@mantine/core";
import { formats } from "../../utils/formats.ts";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "../../queries/auth.ts";
import type { RegisterFormValues } from "../../types/auth.ts";
import { useState } from "react";
import { modals } from "@mantine/modals";

const RegisterForm = () => {
	const form = useForm<RegisterFormValues>({
		mode: "uncontrolled",
		initialValues: {
			username: "",
			password: "",
			email: "",
			telephone: "",
			profileImage: null,
			title: "",
			firstName: "",
			lastName: "",
			gender: "",
			description: "",
			address1: "",
			address2: "",
			address3: "",
			postcode: "",
		},
		validate: (values) => {
			if (step === 0) {
				return {
					username:
						values.username.length === 0 ? "Username is required" : null,
					email: !/^\S+@\S+$/.test(values.email) ? "Invalid email" : null,
					telephone: !formats.IsUkTelephone.test(values.telephone)
						? "Invalid telephone number"
						: null,
					password: !formats.IsValidPassword.test(values.password)
						? "Password must be at least 8 characters long and include letters, numbers, and special characters"
						: null,
					profileImage:
						values.profileImage === null ? "Profile image is required" : null,
				};
			} else if (step === 1) {
				return {
					firstName:
						values.firstName.length === 0 ? "First name is required" : null,
					lastName:
						values.lastName.length === 0 ? "Last name is required" : null,
				};
			} else {
				return {
					postcode: !formats.IsUkPostcode.test(values.postcode)
						? "Invalid postcode"
						: null,
				};
			}
		},
	});

	const [step, setStep] = useState(0);
	const nextStep = () =>
		setStep((currentStep) =>
			form.validate().hasErrors ? currentStep : currentStep + 1,
		);
	const prevStep = () => setStep((currentStep) => currentStep - 1);

	const queryClient = useQueryClient();
	const registerMutation = useMutation({
		mutationKey: auth.registerMutOptions.key,
		mutationFn: async (values: RegisterFormValues) =>
			await auth.registerMutOptions.fn(values),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["auth.user"],
				refetchType: "all",
			});
			return modals.closeAll();
		},
	});

	return (
		<form onSubmit={form.onSubmit((values) => registerMutation.mutate(values))}>
			<Stepper
				active={step}
				allowNextStepsSelect={false}
				pt="md"
				styles={{
					stepBody: {
						display: "none",
					},
					steps: {
						paddingInline: "var(--mantine-spacing-lg)",
					},
				}}
			>
				<Stepper.Step>
					<Stack align="stretch" gap={0}>
						<TextInput
							withAsterisk
							size="lg"
							label="Username"
							placeholder="johndoe"
							px="lg"
							pt="sm"
							key={form.key("username")}
							{...form.getInputProps("username")}
						/>
						<PasswordInput
							withAsterisk
							size="lg"
							label="Password"
							placeholder="Password"
							px="lg"
							pt="sm"
							key={form.key("password")}
							{...form.getInputProps("password")}
						/>
						<TextInput
							withAsterisk
							size="lg"
							label="Email"
							placeholder="johndoe@email.com"
							px="lg"
							pt="sm"
							key={form.key("email")}
							{...form.getInputProps("email")}
						/>
						<TextInput
							withAsterisk
							size="lg"
							label="Telephone"
							placeholder="+441234567890"
							px="lg"
							pt="sm"
							key={form.key("telephone")}
							{...form.getInputProps("telephone")}
						/>
						<FileInput
							withAsterisk
							size="lg"
							label="Profile Image"
							placeholder="Upload your profile image"
							px="lg"
							pt="sm"
							pb="sm"
							key={form.key("profileImage")}
							{...form.getInputProps("profileImage")}
						/>
						<Button fullWidth size="lg" onClick={nextStep}>
							Next Page
						</Button>
					</Stack>
				</Stepper.Step>
				<Stepper.Step>
					<Stack align="stretch" gap={0}>
						<Select
							withAsterisk
							size="lg"
							label="Title"
							data={[
								"Mr",
								"Mrs",
								"Miss",
								"Ms",
								"Dr",
								"Prof",
								"Rev",
								"Lord",
								"Lady",
								"Not Listed",
							]}
							px="lg"
							pt="sm"
							key={form.key("title")}
							{...form.getInputProps("title")}
						/>
						<TextInput
							withAsterisk
							size="lg"
							label="First Name"
							placeholder="John"
							px="lg"
							pt="sm"
							key={form.key("firstName")}
							{...form.getInputProps("firstName")}
						/>
						<TextInput
							withAsterisk
							size="lg"
							label="Last Name"
							placeholder="Doe"
							px="lg"
							pt="sm"
							key={form.key("lastName")}
							{...form.getInputProps("lastName")}
						/>
						<Select
							withAsterisk
							size="lg"
							label="Gender"
							data={["Male", "Female", "Non-Binary", "Not Listed"]}
							px="lg"
							pb="sm"
							pt="sm"
							key={form.key("gender")}
							{...form.getInputProps("gender")}
						/>
						<TextInput
							size="lg"
							label="Description"
							placeholder="Tell us about yourself"
							px="lg"
							pt="sm"
							pb="sm"
							key={form.key("description")}
							{...form.getInputProps("description")}
						/>
						<Button.Group>
							<Button fullWidth size="lg" onClick={prevStep}>
								Previous Page
							</Button>
							<Button fullWidth size="lg" onClick={nextStep}>
								Next Page
							</Button>
						</Button.Group>
					</Stack>
				</Stepper.Step>
				<Stepper.Step>
					<Stack align="stretch" gap={0}>
						<TextInput
							withAsterisk
							size="lg"
							label="Address 1"
							placeholder="123 Main St"
							px="lg"
							pt="sm"
							{...form.getInputProps("address1")}
						/>
						<TextInput
							size="lg"
							label="Address 2"
							placeholder="Apt 4B"
							px="lg"
							pt="sm"
							{...form.getInputProps("address2")}
						/>
						<TextInput
							size="lg"
							label="Address 3"
							placeholder="Suite 5"
							px="lg"
							pt="sm"
							{...form.getInputProps("address3")}
						/>
						<TextInput
							withAsterisk
							size="lg"
							label="Postcode"
							placeholder="AB12 3CD"
							px="lg"
							pt="sm"
							pb="sm"
							{...form.getInputProps("postcode")}
						/>
						<Button.Group>
							<Button fullWidth size="lg" onClick={prevStep}>
								Previous Page
							</Button>
							<Button
								fullWidth
								size="lg"
								type="submit"
								loading={registerMutation.isPending}
							>
								Register
							</Button>
						</Button.Group>
					</Stack>
				</Stepper.Step>
			</Stepper>
		</form>
	);
};

export default RegisterForm;
