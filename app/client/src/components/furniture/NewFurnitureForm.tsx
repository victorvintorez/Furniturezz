import {Button, FileInput, Stack, Stepper, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {furniture} from "../../queries/furniture.ts";
import {AddFurnitureFormValues} from "../../types/furniture.ts";
import {modals} from "@mantine/modals";
import {useState} from "react";

const NewFurnitureForm = () => {
	const form = useForm<AddFurnitureFormValues>({
		mode: "uncontrolled",
		initialValues: {
			make: "",
			model: "",
			color: "",
			type: "",
			location: "",
			year: "",
			video: null,
			images: [],
		},
		validate: (values) => {
			if (step === 0) {
				return {
					furnitureModel: values.model.length === 0 ? "Furniture model is required" : null,
					furnitureColor: values.color.length === 0 ? "Furniture color is required" : null,
					furnitureType: values.type.length === 0 ? "Furniture type is required" : null,
					location: values.location.length === 0 ? "Location is required" : null,
					year: values.year.length === 0 ? "Year is required" : null,
				}
			} else {
				return {
					video: values.video === null ? "Video is required" : null,
					images: values.images.length === 0 ? "Images are required" : null,
				}
			}
		}
	});

	const [step, setStep] = useState(0);
	const nextStep = () => setStep((currentStep) => form.validate().hasErrors ? currentStep : currentStep + 1);
	const prevStep = () => setStep((currentStep) => currentStep - 1);

	const queryClient = useQueryClient();
	const addFurnitureMutation = useMutation({
		mutationKey: furniture.addFurnitureMutOptions.key,
		mutationFn: async (values: AddFurnitureFormValues) => await furniture.addFurnitureMutOptions.fn(values),
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: ["furniture.all"], refetchType: "all"});
			return modals.closeAll();
		}
	});

	return (
		<form onSubmit={form.onSubmit((values) => addFurnitureMutation.mutate(values))}>
			<Stepper active={step} allowNextStepsSelect={false} pt="md" styles={{
				stepBody: {
					display: "none",
				},
				steps: {
					paddingInline: "var(--mantine-spacing-lg)",
				},
			}}>
				<Stepper.Step>
					<Stack align="stretch" gap={0}>
						<TextInput withAsterisk size="lg" label="Furniture Make" placeholder="IDEA" px="lg" pt="sm"
						           key={form.key("make")} {...form.getInputProps("make")} />
						<TextInput withAsterisk size="lg" label="Furniture Model" placeholder="Iris" px="lg" pt="sm"
						           key={form.key("model")} {...form.getInputProps("model")} />
						<TextInput withAsterisk size="lg" label="Furniture Color" placeholder="Black" px="lg" pt="sm"
						           key={form.key("color")} {...form.getInputProps("color")} />
						<TextInput withAsterisk size="lg" label="Furniture Type" placeholder="Chair" px="lg" pt="sm"
						           key={form.key("type")} {...form.getInputProps("type")} />
						<TextInput withAsterisk size="lg" label="Location" placeholder="Pentwyn, Cardiff" px="lg"
						           pt="sm"
						           key={form.key("location")} {...form.getInputProps("location")} />
						<TextInput withAsterisk size="lg" label="Year" placeholder="2009" px="lg" pt="sm" pb="sm"
						           key={form.key("year")} {...form.getInputProps("year")} />
						<Button fullWidth size="lg" onClick={nextStep}>Next Page</Button>
					</Stack>
				</Stepper.Step>
				<Stepper.Step>
					<FileInput size="lg" label="Video" placeholder="Upload a video" px="lg" pt="sm" pb="sm"
					           key={form.key("video")} {...form.getInputProps("video")} />
					<FileInput withAsterisk size="lg" label="Images" placeholder="Upload images" multiple px="lg"
					           pt="sm"
					           pb="sm"
					           key={form.key("images")} {...form.getInputProps("images")} />
					<Button.Group>
						<Button fullWidth size="lg" onClick={prevStep}>Previous Page</Button>
						<Button fullWidth size="lg" type="submit" loading={addFurnitureMutation.isPending}>Add
							Furniture</Button>
					</Button.Group>
				</Stepper.Step>
			</Stepper>
		</form>
	)
}

export default NewFurnitureForm;