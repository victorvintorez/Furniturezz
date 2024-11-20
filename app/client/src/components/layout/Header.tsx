import {FC} from "react";
import {Flex, Title, useMantineColorScheme, ActionIcon, Group, Avatar, Text} from "@mantine/core";
import {Link} from "../Link.tsx";
import {IconLogin, IconMoon, IconSun, IconSunMoon} from "@tabler/icons-react";
import Icon from "../../assets/chair-logo.svg";

const Header: FC = () => {
	const {colorScheme, toggleColorScheme} = useMantineColorScheme();
	const {isLoggedIn, user} = {isLoggedIn: false, user: null};

	return (
		<Flex direction="row" justify="space-between" align="center" px="sm">
			<Link.Button to="/" variant="transparent" h="min-content" p="xs">
				<Group>
					<Avatar src={Icon} size="lg" style={{rotate: "-30deg"}}/>
					<Title style={{fontFamily: "Iosevka Etoile"}}>Furniturezz</Title>
				</Group>
			</Link.Button>
			{isLoggedIn ? (
				<>{user}</>
			) : (
				<Group>
					<Link.Button to="/auth" size="lg" variant="subtle"
					             leftSection={<IconLogin/>}><Text size="xl">Login</Text></Link.Button>
					<ActionIcon variant="transparent" onClick={toggleColorScheme} size="lg"
					            mr="sm">{colorScheme === "dark" ?
						<IconMoon/> : colorScheme === "light" ? <IconSun/> : <IconSunMoon/>}</ActionIcon>
				</Group>
			)}
		</Flex>
	)
}

export default Header;