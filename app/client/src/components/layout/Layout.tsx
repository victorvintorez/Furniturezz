import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/carousel/styles.css";
import {AppShell, MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import {FC, PropsWithChildren} from "react";
import Header from "./Header.tsx";
import {theme} from "../../utils/theme.ts";
import Navigation from "./Navigation.tsx";
import MainContent from "./MainContent.tsx";
import {useDisclosure} from "@mantine/hooks";

const Layout: FC<PropsWithChildren> = ({children}) => {
	const [navbarOpened, {toggle: toggleNavbar}] = useDisclosure(false);

	return (
		<MantineProvider theme={theme}>
			<ModalsProvider>
				<AppShell withBorder header={{height: 80}} navbar={{
					width: 350,
					breakpoint: "lg",
					collapsed: {desktop: false, mobile: !navbarOpened},
				}}>
					<Header navbarOpened={navbarOpened} toggleNavbar={toggleNavbar}/>
					<Navigation/>
					<MainContent>
						{children}
					</MainContent>
				</AppShell>
			</ModalsProvider>
		</MantineProvider>
	)
}

export default Layout;