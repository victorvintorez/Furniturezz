import {FC} from "react";
import {Furniture} from "../../types/furniture.ts";
import {
	Anchor,
	Text,
	Avatar,
	Center,
	Divider,
	Group,
	Stack,
	Title,
	AspectRatio,
	ColorSwatch,
	Button, Tooltip
} from "@mantine/core";

interface FurnitureModalProps {
	furniture: Furniture;
}

const FurnitureModal: FC<FurnitureModalProps> = ({furniture}) => {
	return (
		<Stack gap="md">
			<Center>
				<AspectRatio ratio={16 / 9}>
					<video height="300" controls src={furniture.videoUrl}/>
				</AspectRatio>
			</Center>
			<Divider/>
			<Stack gap={0}>
				<Group gap="sm">
					<Text size="xl">Furniture Color: {furniture.color}</Text>
					<ColorSwatch color={furniture.color}/>
				</Group>
				<Text size="xl">Furniture Type: {furniture.type}</Text>
				<Text size="xl">Furniture Year: {furniture.year}</Text>
				<Text size="xl">Furniture Location:
					<Anchor target="_blank" rel="noopener noreferrer"
					        href={`https://www.google.com/maps/?q=${encodeURIComponent(furniture.location)}`}>
						{` ${furniture.location}`}
					</Anchor>
				</Text>
			</Stack>
			<Divider/>
			<Group gap="sm" align="stretch" justify="space-between">
				<Stack gap={0} align="flex-start">
					<Title order={2}>{furniture.user.username}</Title>
					<Text size="xl">{furniture.user.description}</Text>
				</Stack>
				<Stack gap={0} align="flex-end">
					<Avatar size="xl" radius="sm" src={furniture.user.profileImageUrl}/>
				</Stack>
			</Group>
			<Button.Group>
				<Tooltip label="Click to copy telephone number" position="bottom">
					<Button fullWidth size="xl" variant="transparent"
					        onClick={() => navigator.clipboard.writeText(furniture.user.telephone)}>
						<Stack gap={0} p="md">
							<Text size="lg">Call Seller:</Text>
							<Text size="lg">{furniture.user.telephone}</Text>
						</Stack>
					</Button>
				</Tooltip>
				<Tooltip label="Click to copy email address" position="bottom">
					<Button fullWidth size="xl" variant="transparent"
					        onClick={() => navigator.clipboard.writeText(furniture.user.email)}>
						<Stack gap={0} p="md">
							<Text size="lg">Email Seller:</Text>
							<Text size="lg">{furniture.user.email}</Text>
						</Stack>
					</Button>
				</Tooltip>
			</Button.Group>
		</Stack>
	)
}

export default FurnitureModal;