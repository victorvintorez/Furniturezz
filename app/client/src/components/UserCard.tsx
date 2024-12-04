import {FC} from "react";
import {Avatar, Text, Group, Stack, SimpleGrid, Center} from "@mantine/core";
import {useQuery} from "@tanstack/react-query";
import {auth} from "../queries/auth.ts";
import {User} from "../types/auth.ts";

const UserCard: FC = () => {
	const {data, isPending, error} = useQuery<User>({
		queryKey: auth.userDetailOptions.key,
		queryFn: auth.userDetailOptions.fn,
		staleTime: auth.userDetailOptions.stale,
	});

	if (isPending) return <Text>Loading...</Text>;
	if (error) return <Text>Error loading user details</Text>;

	return (
		<SimpleGrid cols={2}>
			<Center>
				<Avatar src={data.profileImageUrl} size="xl" radius="sm"/>
			</Center>
			<Group>
				<Text>Username: {data.username}</Text>
				<Text>Email: {data.email}</Text>
				<Text>Telephone: {data.telephone}</Text>
				{data.description && <Text>Profile Description: {data.description}</Text>}
			</Group>
			<Group>
				<Text>Full Name: {data.title} {data.firstName} {data.lastName}</Text>
			</Group>
			<Stack gap={0}>
				<Text>{data.address1}</Text>
				<Text>{data.address2}</Text>
				<Text>{data.address3}</Text>
				<Text>{data.postcode}</Text>
			</Stack>
		</SimpleGrid>
	);
}

export default UserCard;