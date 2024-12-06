import {FC} from "react";
import {Furniture} from "../../types/furniture.ts";
import {Button, Card, Text, Divider, Stack, Title, Image, Group, Avatar, Anchor} from "@mantine/core";
import {Carousel} from "@mantine/carousel";
import classes from "./FurnitureCard.module.css";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {User} from "../../types/auth.ts";
import {auth} from "../../queries/auth.ts";
import {IconEdit, IconLocation, IconTrash} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import EditFurnitureForm from "./EditFurnitureForm.tsx";
import {furniture as furnitureQuery} from "../../queries/furniture.ts";
import FurnitureModal from "./FurnitureModal.tsx";

interface FurnitureCardProps {
	furniture: Furniture;
}

const FurnitureCard: FC<FurnitureCardProps> = ({furniture}) => {
	const {data: userData} = useQuery<User>({
		queryKey: auth.userDetailOptions.key,
		queryFn: auth.userDetailOptions.fn,
		staleTime: auth.userDetailOptions.stale,
	})
	const queryClient = useQueryClient();
	const deleteFurnitureMutation = useMutation({
		mutationKey: furnitureQuery.deleteFurnitureMutOptions.key,
		mutationFn: async (id: number) => await furnitureQuery.deleteFurnitureMutOptions.fn(id),
		onSuccess: async () => await queryClient.invalidateQueries({queryKey: ["furniture.all"], refetchType: "all"}),
	})

	const viewFurnitureModal = () => modals.open({
		title: `${furniture.make} ${furniture.model} - Details`,
		centered: true,
		size: "lg",
		radius: "sm",
		styles: {
			title: {
				fontSize: "var(--mantine-h1-font-size)",
				fontWeight: "var(--mantine-h1-font-weight)",
				lineHeight: "var(--mantine-h1-line-height)",
			}
		},
		children: <FurnitureModal furniture={furniture}/>
	})

	const editFurnitureModal = () => modals.open({
		title: "Edit Furniture",
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
		children: <EditFurnitureForm furniture={furniture}/>
	})

	return (
		<Card withBorder>
			<Card.Section>
				<Carousel withControls withIndicators={false} classNames={classes} h="300">
					{furniture.images.map(({imageUrl}, index) => (
						<Carousel.Slide key={index}>
							<Image src={imageUrl} alt={`${furniture.make} ${furniture.model}`} h="300"/>
						</Carousel.Slide>
					))}
				</Carousel>
			</Card.Section>
			<Card.Section>
				<Divider/>
			</Card.Section>
			<Card.Section>
				<Stack align="stretch" p="sm">
					<Group justify="space-between" align="flex-start">
						<Stack gap={0}>
							<Title>{`${furniture.make} ${furniture.model}`}</Title>
							<Text size="xl">{furniture.type} - {furniture.year}</Text>
							<Group gap="sm"><IconLocation size={20}/>
								<Text size="xl"><Anchor target="_blank" rel="noopener noreferrer"
								                        href={`https://www.google.com/maps/?q=${encodeURIComponent(furniture.location)}`}>
									{furniture.location}
								</Anchor></Text>
							</Group>
						</Stack>
						<Stack gap={0} align="flex-end">
							<Avatar size="lg" radius="sm" src={furniture.user.profileImageUrl}/>
							<Text size="xl">{furniture.user.username}</Text>
						</Stack>
					</Group>
					<Button.Group>
						<Button fullWidth onClick={viewFurnitureModal} size="lg">View More Details</Button>
						{userData?.id === furniture.userId && (
							<>
								<Button color="blue" size="lg" onClick={editFurnitureModal}><IconEdit/></Button>
								<Button color="red" size="lg"
								        onClick={() => modals.openConfirmModal({
									        title: "Delete Furniture",
									        children: "Are you sure you want to delete this furniture?",
									        labels: {
										        confirm: "Delete",
										        cancel: "Cancel",
									        },
									        onConfirm: () => deleteFurnitureMutation.mutate(furniture.id),
									        centered: true,
								        })}><IconTrash/></Button>
							</>
						)}
					</Button.Group>
				</Stack>
			</Card.Section>
		</Card>
	)
}

export default FurnitureCard;