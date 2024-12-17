import {FC, useEffect, useRef} from "react";
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
	Button, Loader, Anchor
} from "@mantine/core";
import {Link} from "../Link.tsx";
import {
	IconChevronDown, IconLogin,
	IconLogout,
	IconMenu2,
	IconMoon,
	IconSun,
	IconSunMoon,
	IconUser, IconX
} from "@tabler/icons-react";
import Icon from "../../assets/chair-logo.svg";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {auth} from "../../queries/auth.ts";
import {User} from "../../types/auth.ts";
import {modals} from "@mantine/modals";
import LoginForm from "../auth/LoginForm.tsx";
import {useToggle} from "@mantine/hooks";
import RegisterForm from "../auth/RegisterForm.tsx";
import UserCard from "../UserCard.tsx";

type HeaderProps = {
	navbarOpened: boolean;
	toggleNavbar: () => void;
}

const Header: FC<HeaderProps> = ({toggleNavbar, navbarOpened}) => {
	const firstRender = useRef(true);
	const [authType, toggleAuthType] = useToggle<"login" | "register">(["login", "register"]);
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

	const authModal = () => modals.open({
		title: authType === "login" ? "Login" : "Register",
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
		children: <>
			<Text size="lg">Or,{" "}
				<Anchor component="button"
				        onClick={() => toggleAuthType()}>{authType === "login" ? "register" : "login"}</Anchor>
			</Text>
			{authType === "login" ? <LoginForm/> : <RegisterForm/>}
		</>
	})

	const userModal = () => modals.open({
		title: "Profile",
		centered: true,
		size: "md",
		radius: "sm",
		styles: {
			title: {
				fontSize: "var(--mantine-h2-font-size)",
				fontWeight: "var(--mantine-h2-font-weight)",
				lineHeight: "var(--mantine-h2-line-height)",
			}
		},
		children: <UserCard/>
	})

	useEffect(() => {
		if (!firstRender.current) {
			modals.closeAll();
			authModal();
			return
		} else {
			firstRender.current = false;
		}
	}, [authType])

	return (
		<AppShell.Header>
			<Flex direction="row" justify="space-between" align="center" px="sm" h={80}>
				<Link.Button to="/" search={{
					searchText: undefined,
					make: undefined,
					model: undefined,
					color: undefined,
					type: undefined,
					location: undefined,
					year: undefined,
				}} variant="transparent" h="min-content" p="xs">
					<Group>
						<Avatar src={Icon} size="lg" style={{rotate: "-30deg"}}/>
						<Title visibleFrom="lg" style={{fontFamily: "Iosevka Etoile"}}>Furniturezz</Title>
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
									<Text size="xl"
									      style={{overflow: "hidden", textOverflow: "ellipsis"}}>{data.username}</Text>
								</Button>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Item onClick={() => userModal()} leftSection={<IconUser/>}><Text
									size="lg">Profile</Text></Menu.Item>
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
						<Button loading={isPending} size="lg" variant="subtle"
						        leftSection={<IconLogin/>} onClick={authModal}><Text size="xl">Login</Text></Button>
					)}
					<ActionIcon variant="transparent" onClick={toggleColorScheme} size="lg"
					            mr="sm">{colorScheme === "dark" ?
						<IconMoon/> : colorScheme === "light" ? <IconSun/> : <IconSunMoon/>}</ActionIcon>
					<ActionIcon variant="transparent" onClick={toggleNavbar} size="lg" mr="sm"
					            hiddenFrom="lg">{navbarOpened ? <IconX/> :
						<IconMenu2/>}</ActionIcon>
				</Group>
			</Flex>
		</AppShell.Header>
	)
}

export default Header;