import {Card, Title, Center, Divider, Container, Button, Stack, UnstyledButton, Text} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import NewFurnitureForm from "./NewFurnitureForm.tsx";

const NewFurnitureCard = () => {
	const newFurnitureModal = () => modals.open({
		title: "Add New Furniture",
		centered: true,
		size: "lg",
		radius: "sm",
		styles: {
			title: {
				fontSize: "var(--mantine-h2-font-size)",
				fontWeight: "var(--mantine-h2-font-weight)",
				lineHeight: "var(--mantine-h2-line-height)",
			}
		},
		children: <NewFurnitureForm/>
	})

	return (
		<Card withBorder>
			<Card.Section>
				<UnstyledButton h="300" w="100%" onClick={newFurnitureModal}>
					<Container h="300" w="100%">
						<Center h="100%">
							<IconPlus size="48"/>
						</Center>
					</Container>
				</UnstyledButton>
			</Card.Section>
			<Card.Section>
				<Divider/>
			</Card.Section>
			<Card.Section style={{height: "100%"}}>
				<Stack align="stretch" justify="space-between" p="sm" style={{height: "100%"}}>
					<Stack gap={0}>
						<Title>New Furniture</Title>
						<Text size="xl">Upload your furniture Today!</Text>
					</Stack>
					<Button onClick={newFurnitureModal} size="lg">Add Furniture Listing</Button>
				</Stack>
			</Card.Section>
		</Card>
	)
}

export default NewFurnitureCard;