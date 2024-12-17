import {createFileRoute} from '@tanstack/react-router'
import {SimpleGrid} from "@mantine/core";
import NewFurnitureCard from "../components/furniture/NewFurnitureCard.tsx";
import {auth} from "../queries/auth.ts";
import {useQuery} from "@tanstack/react-query";
import {User} from "../types/auth.ts";
import {Furniture, FurnitureFilterOptions} from "../types/furniture.ts";
import {furniture} from "../queries/furniture.ts";
import FurnitureCard from "../components/furniture/FurnitureCard.tsx";
import uFuzzy from "@leeoniya/ufuzzy";
import {useMemo} from "react";

const Index = () => {
	const search = Route.useSearch<FurnitureFilterOptions>()
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

	const filterFurniture = (furniture: Furniture[] | undefined) => {
		if (!furniture) return [];

		const filteredFurniture: Furniture[] = [];

		if (search.searchText) {
			const haystack = furniture.map(furniture => `${furniture.make}¦${furniture.model}¦${furniture.color}¦${furniture.type}¦${furniture.location}¦${furniture.year}`);
			const fuzzy = new uFuzzy({});
			const result = fuzzy.filter(haystack, search.searchText);
			result?.map((id) => {
				console.log(id);
				const furniture = filteredFurniture.find(furniture => furniture.id === id);
				if (furniture) {
					filteredFurniture.push(furniture);
				}
			});
		}

		if (search.make) {
			filteredFurniture.filter(furniture => furniture.make === search.make);
		}

		if (search.model) {
			filteredFurniture.filter(furniture => furniture.model === search.model);
		}

		if (search.color) {
			filteredFurniture.filter(furniture => furniture.color === search.color);
		}

		if (search.type) {
			filteredFurniture.filter(furniture => furniture.type === search.type);
		}

		if (search.location) {
			filteredFurniture.filter(furniture => furniture.location === search.location);
		}

		if (search.year) {
			filteredFurniture.filter(furniture => furniture.year === search.year);
		}

		console.log(filteredFurniture.length);
		return furnitureData ?? [];
	}

	const filteredFurniture: Furniture[] = useMemo((): Furniture[] => filterFurniture(furnitureData), [furnitureData])

	return (
		<SimpleGrid cols={{base: 1, "48rem": 2, "62rem": 2, "75rem": 2, "88rem": 4}} type="container" spacing="lg">
			{userData && <NewFurnitureCard/>}
			{furnitureData && filteredFurniture.map((furniture, i) => (
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
	}),
	validateSearch: (search): FurnitureFilterOptions => {
		return {
			searchText: search.searchText as string || undefined,
			make: search.make as string || undefined,
			model: search.model as string || undefined,
			color: search.color as string || undefined,
			type: search.type as string || undefined,
			location: search.location as string || undefined,
			year: search.year as string || undefined,
		}
	}
})
