import {FC} from "react";
import {Flex, Title, useMantineColorScheme, ActionIcon, Group, Avatar, Text, AppShell} from "@mantine/core";
import {Link} from "../Link.tsx";
import {IconLogin, IconMoon, IconSun, IconSunMoon} from "@tabler/icons-react";
import Icon from "../../assets/chair-logo.svg";
import {useQuery} from "@tanstack/react-query";
import {User} from "../../types/auth.ts";

const Header: FC = () => {
	const {colorScheme, toggleColorScheme} = useMantineColorScheme();
	const {isPending, data} = useQuery<boolean, boolean, User>({
		queryKey: ["auth.user"], queryFn: async () => {
			if (!document.cookie.includes("session=")) return null;
			const res = await fetch("/api/user/");
			if (!res.ok) throw new Error("Failed to fetch user data");
			return res.json();
		}
	})

	return (
		<AppShell.Header>
			<Flex direction="row" justify="space-between" align="center" px="sm">
				<Link.Button to="/" variant="transparent" h="min-content" p="xs">
					<Group>
						<Avatar src={Icon} size="lg" style={{rotate: "-30deg"}}/>
						<Title style={{fontFamily: "Iosevka Etoile"}}>Furniturezz</Title>
					</Group>
				</Link.Button>
				<Group>
					{data ? (
						<>{data.username}</>
					) : (
						<Link.Button loading={isPending} to="/auth" size="lg" variant="subtle"
						             leftSection={<IconLogin/>}><Text size="xl">Login</Text></Link.Button>
					)}
					<ActionIcon variant="transparent" onClick={toggleColorScheme} size="lg"
					            mr="sm">{colorScheme === "dark" ?
						<IconMoon/> : colorScheme === "light" ? <IconSun/> : <IconSunMoon/>}</ActionIcon>
				</Group>
			</Flex>
		</AppShell.Header>
	)
}

export default Header;