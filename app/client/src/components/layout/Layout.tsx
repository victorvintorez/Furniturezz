import "@mantine/core/styles.css";
import {AppShell, MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import {FC, PropsWithChildren} from "react";
import Header from "./Header.tsx";
import {theme} from "../../helpers/theme.ts";

const Layout: FC<PropsWithChildren> = ({children}) => {
	return (
		<MantineProvider theme={theme}>
			<ModalsProvider>
				<AppShell header={{height: 80}}>
					<AppShell.Header>
						<Header/>
					</AppShell.Header>
					<AppShell.Navbar>

					</AppShell.Navbar>
					<AppShell.Main>
						{children}
					</AppShell.Main>
				</AppShell>
			</ModalsProvider>
		</MantineProvider>
	)
}

export default Layout;