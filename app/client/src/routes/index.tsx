import {createFileRoute} from '@tanstack/react-router'
import {SimpleGrid} from "@mantine/core";
import NewFurnitureCard from "../components/furniture/NewFurnitureCard.tsx";
import {auth} from "../queries/auth.ts";
import {useQuery} from "@tanstack/react-query";
import {User} from "../types/auth.ts";
import {Furniture} from "../types/furniture.ts";
import {furniture} from "../queries/furniture.ts";
import FurnitureCard from "../components/furniture/FurnitureCard.tsx";

const Index = () => {
	const {data: userData} = useQuery<User>({
		queryKey: auth.userDetailOptions.key,
		queryFn: auth.userDetailOptions.fn,
		staleTime: auth.userDetailOptions.stale,
	})
	const {data: furnitureData} = useQuery<Furniture[]>({
		queryKey: furniture.getAllFurnitureOptions.key,
		queryFn: furniture.getAllFurnitureOptions.fn,
		staleTime: furniture.getAllFurnitureOptions.stale,
	})

	return (
		<SimpleGrid cols={{base: 1, "48em": 2, "62em": 2, "75em": 2, "88em": 4}} type="container" spacing="lg">
			{userData && <NewFurnitureCard/>}
			{furnitureData && furnitureData.map((furniture, i) => (
				<FurnitureCard key={i} furniture={furniture}/>
			))}
		</SimpleGrid>
	)
}

export const Route = createFileRoute('/')({
	component: Index,
	loader: async ({context: {queryClient}}) => queryClient.ensureQueryData({
		queryKey: furniture.getAllFurnitureOptions.key,
		queryFn: furniture.getAllFurnitureOptions.fn,
		staleTime: furniture.getAllFurnitureOptions.stale,
	})
})
