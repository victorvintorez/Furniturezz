import {FC} from "react";
import {
	Flex,
	Title,
	useMantineColorScheme,
	ActionIcon,
	Group,
	Avatar,
	Text,
	AppShell,
	Menu,
	Button, Loader
} from "@mantine/core";
import {Link} from "../Link.tsx";
import {IconChevronDown, IconLogin, IconLogout, IconMoon, IconSun, IconSunMoon, IconUser} from "@tabler/icons-react";
import Icon from "../../assets/chair-logo.svg";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {auth} from "../../queries/auth.ts";
import {User} from "../../types/auth.ts";

const Header: FC = () => {
	const {colorScheme, toggleColorScheme} = useMantineColorScheme();
	const {data, isPending} = useQuery<User, boolean>({
		queryKey: auth.userDetailOptions.key,
		queryFn: auth.userDetailOptions.fn,
		staleTime: auth.userDetailOptions.stale,
	})
	const queryClient = useQueryClient();
	const logoutMutation = useMutation({
		mutationKey: auth.logoutMutOptions.key,
		mutationFn: auth.logoutMutOptions.fn,
		onSuccess: async () => await queryClient.invalidateQueries({queryKey: ["auth.user"], refetchType: "all"})
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
					{isPending ? (
						"Loading..."
					) : data ? (
						<Menu trigger="click-hover" arrowPosition="center" radius="xs" withArrow>
							<Menu.Target>
								<Button variant="subtle" size="lg" radius="xs" pl="0" pr="md"
								        leftSection={
									        <Avatar size="lg" radius="xs" src={data.profileImageUrl}/>
								        }
								        rightSection={
									        <IconChevronDown/>
								        }>
									<Text size="xl">{data.username}</Text>
								</Button>
							</Menu.Target>

							<Menu.Dropdown>
								<Link.MenuItem to="/user" leftSection={<IconUser/>}><Text
									size="lg">Profile</Text></Link.MenuItem>
								<Menu.Item onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}
								           closeMenuOnClick leftSection={<IconLogout/>}>
									{logoutMutation.isPending ?
										<Loader/> :
										<Text size="lg">Logout</Text>
									}
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
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