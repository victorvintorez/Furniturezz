import {AppShell, Button, ButtonGroup, Divider, TextInput} from "@mantine/core";
import {FC, useState} from "react";
import {IconSearch, IconTrash} from "@tabler/icons-react";
import {useQuery} from "@tanstack/react-query";
import {Furniture, FurnitureFilterOptions} from "../../types/furniture.ts";
import {furniture} from "../../queries/furniture.ts";
import {useNavigate} from "@tanstack/react-router";

const Navigation: FC = () => {
	const navigate = useNavigate({from: '/'})
	const [searchText, setSearchText] = useState<string>('')
	const {data: furnitureData} = useQuery<Furniture[]>({
		queryKey: furniture.getAllFurnitureOptions.key,
		queryFn: furniture.getAllFurnitureOptions.fn,
		staleTime: furniture.getAllFurnitureOptions.stale,
	})

	return (
		<AppShell.Navbar>
			<AppShell.Section>
				<TextInput leftSection={<IconSearch/>} size="md" p="xs" value={searchText}
				           onChange={(event) => setSearchText(event.currentTarget.value)}/>
			</AppShell.Section>
			<Divider/>
			<AppShell.Section grow>
				{/* Filter component goes here */}
			</AppShell.Section>
			<Divider/>
			<AppShell.Section>
				<ButtonGroup p="xs">
					<Button fullWidth size="md" onClick={() => navigate({
						to: ".",
						search: (prev: FurnitureFilterOptions) => ({
							...prev,
							searchText: searchText === '' ? undefined : searchText,
							make: undefined,
							model: undefined,
							color: undefined,
							type: undefined,
							location: undefined,
							year: undefined,
						})
					})}>Search</Button>
					<Button color="red.9" size="md"><IconTrash/></Button>
				</ButtonGroup>
			</AppShell.Section>
		</AppShell.Navbar>
	)
}

export default Navigation;