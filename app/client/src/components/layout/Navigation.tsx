import {AppShell, Button, ButtonGroup, Divider, TextInput} from "@mantine/core";
import {FC} from "react";
import {IconSearch, IconTrash} from "@tabler/icons-react";

const Navigation: FC = () => {
	return (
		<AppShell.Navbar>
			<AppShell.Section>
				<TextInput leftSection={<IconSearch/>} size="md" p="xs"/>
			</AppShell.Section>
			<Divider/>
			<AppShell.Section grow>
				{/* Filter component goes here */}
			</AppShell.Section>
			<Divider/>
			<AppShell.Section>
				<ButtonGroup p="xs">
					<Button fullWidth size="md">Search</Button>
					<Button color="red.9" size="md"><IconTrash/></Button>
				</ButtonGroup>
			</AppShell.Section>
		</AppShell.Navbar>
	)
}

export default Navigation;