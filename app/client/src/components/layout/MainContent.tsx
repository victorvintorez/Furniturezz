import {AppShell, Container, useComputedColorScheme} from "@mantine/core";
import {FC, PropsWithChildren} from "react";

const MainContent: FC<PropsWithChildren> = ({children}) => {
	const colorScheme = useComputedColorScheme();

	return (
		<AppShell.Main
			style={(theme) => ({backgroundColor: colorScheme === "light" ? theme.colors.gray[1] : theme.colors.dark[8]})}>
			<Container fluid py="md">
				{children}
			</Container>
		</AppShell.Main>
	)
}

export default MainContent;