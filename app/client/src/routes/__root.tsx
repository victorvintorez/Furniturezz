import {createRootRouteWithContext, Outlet} from "@tanstack/react-router"
import Layout from "../components/layout/Layout.tsx";
import React from "react";
import {QueryClient} from "@tanstack/react-query";
import {auth} from "../queries/auth.ts";

const TanStackRouterDevtools = process.env.NODE_ENV === "development" ?
	React.lazy(() => import("@tanstack/router-devtools")
		.then((res) => ({default: res.TanStackRouterDevtools})))
	: () => null;
const ReactQueryDevtools = process.env.NODE_ENV === "development" ?
	React.lazy(() => import("@tanstack/react-query-devtools")
		.then((res) => ({default: res.ReactQueryDevtools})))
	: () => null;


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	component: () => (
		<>
			<Layout>
				<Outlet/>
			</Layout>
			<TanStackRouterDevtools position="bottom-right" toggleButtonProps={{style: {right: 75}}}/>
			<ReactQueryDevtools buttonPosition="bottom-right" position="bottom"/>
		</>
	),
	beforeLoad: async ({context: {queryClient}}) =>
		await queryClient.ensureQueryData({
			queryKey: auth.userDetailOptions.key,
			queryFn: auth.userDetailOptions.fn,
			staleTime: auth.userDetailOptions.stale,
		})
})