import {createRootRoute, Outlet} from "@tanstack/react-router"
import Layout from "../components/layout/Layout.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import {getUserDetails} from "../queries/auth.ts";

const TanStackRouterDevtools = process.env.NODE_ENV === "development" ? React.lazy(() => import("@tanstack/router-devtools").then((res) => ({default: res.TanStackRouterDevtools}))) : () => null;
const ReactQueryDevtools = process.env.NODE_ENV === "development" ? React.lazy(() => import("@tanstack/react-query-devtools").then((res) => ({default: res.ReactQueryDevtools}))) : () => null;

export const queryClient = new QueryClient()

export const Route = createRootRoute({
	component: () => (
		<QueryClientProvider client={queryClient}>
			<Layout>
				<Outlet/>
			</Layout>
			<TanStackRouterDevtools position="bottom-right" toggleButtonProps={{style: {right: 75}}}/>
			<ReactQueryDevtools buttonPosition="bottom-right" position="right"/>
		</QueryClientProvider>
	),
	beforeLoad: async () => await queryClient.ensureQueryData({
		queryKey: ["auth.user"],
		queryFn: async () => await getUserDetails()
	})
})