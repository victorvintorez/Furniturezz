import {FC, useState} from "react";
import {Furniture, EditFurnitureFormValues} from "../../types/furniture.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {Button, FileInput, Stack, Stepper, TextInput} from "@mantine/core";
import {furniture as furnitureQuery} from "../../queries/furniture.ts";

interface FurnitureCardProps {
	furniture: Furniture;
}

const EditFurnitureForm: FC<FurnitureCardProps> = ({furniture}) => {
	const form = useForm<EditFurnitureFormValues>({
		mode: "uncontrolled",
		initialValues: {
			make: null,
			model: null,
			color: null,
			type: null,
			location: null,
			year: null,
			video: null,
			images: null,
		}
	});

	const [step, setStep] = useState(0);
	const nextStep = () => setStep((currentStep) => form.validate().hasErrors ? currentStep : currentStep + 1);
	const prevStep = () => setStep((currentStep) => currentStep - 1);

	const queryClient = useQueryClient();
	const editFurnitureMutation = useMutation({
		mutationKey: furnitureQuery.editFurnitureMutOptions.key,
		mutationFn: async (values: EditFurnitureFormValues) => await furnitureQuery.editFurnitureMutOptions.fn(furniture.id, values),
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: ["furniture.all"], refetchType: "all"});
			return modals.closeAll();
		}
	});

	return (
		<form onSubmit={form.onSubmit((values) => editFurnitureMutation.mutate(values))}>
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
						<TextInput withAsterisk size="lg" label="Furniture Make" placeholder={furniture.make} px="lg"
						           pt="sm"
						           key={form.key("make")} {...form.getInputProps("make")} />
						<TextInput withAsterisk size="lg" label="Furniture Model" placeholder={furniture.model} px="lg"
						           pt="sm"
						           key={form.key("model")} {...form.getInputProps("model")} />
						<TextInput withAsterisk size="lg" label="Furniture Color" placeholder={furniture.color} px="lg"
						           pt="sm"
						           key={form.key("color")} {...form.getInputProps("color")} />
						<TextInput withAsterisk size="lg" label="Furniture Type" placeholder={furniture.type} px="lg"
						           pt="sm"
						           key={form.key("type")} {...form.getInputProps("type")} />
						<TextInput withAsterisk size="lg" label="Location" placeholder={furniture.location} px="lg"
						           pt="sm"
						           key={form.key("location")} {...form.getInputProps("location")} />
						<TextInput withAsterisk size="lg" label="Year" placeholder={furniture.year} px="lg" pt="sm"
						           pb="sm"
						           key={form.key("year")} {...form.getInputProps("year")} />
						<Button fullWidth size="lg" onClick={nextStep}>Next Page</Button>
					</Stack>
				</Stepper.Step>
				<Stepper.Step>
					<FileInput size="lg" label="Video" placeholder="Upload a new video" px="lg" pt="sm" pb="sm"
					           key={form.key("video")} {...form.getInputProps("video")} />
					<FileInput withAsterisk size="lg" label="Images" placeholder="Upload new images" multiple px="lg"
					           pt="sm"
					           pb="sm"
					           key={form.key("images")} {...form.getInputProps("images")} />
					<Button.Group>
						<Button fullWidth size="lg" onClick={prevStep}>Previous Page</Button>
						<Button fullWidth size="lg" type="submit" loading={editFurnitureMutation.isPending}>Add
							Furniture</Button>
					</Button.Group>
				</Stepper.Step>
			</Stepper>
		</form>
	)
}

export default EditFurnitureForm;