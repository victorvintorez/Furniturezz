import {createRootRoute, Outlet} from "@tanstack/react-router"
import {TanStackRouterDevtools} from "@tanstack/router-devtools"
import Layout from "../components/layout/Layout.tsx";

export const Route = createRootRoute({
	component: () => (
		<>
			<Layout>
				<Outlet/>
			</Layout>
			<TanStackRouterDevtools/>
		</>
	)
})