import "@mantine/core/styles.css";
import {AppShell, MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import {FC, PropsWithChildren} from "react";
import Header from "./Header.tsx";
import {theme} from "../../helpers/theme.ts";
import Navigation from "./Navigation.tsx";
import {useLocation} from "@tanstack/react-router";
import MainContent from "./MainContent.tsx";

const Layout: FC<PropsWithChildren> = ({children}) => {
	const location = useLocation();

	return (
		<MantineProvider theme={theme}>
			<ModalsProvider>
				<AppShell withBorder header={{height: 80}} navbar={{
					width: 300,
					breakpoint: "lg",
					collapsed: {desktop: location.pathname !== "/", mobile: location.pathname !== "/"}
				}}>
					<Header/>
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