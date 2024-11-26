import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider, createRouter} from "@tanstack/react-router";
import {routeTree} from "./routeTree.gen"
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

export const queryClient = new QueryClient()

const router = createRouter({
	routeTree,
	context: {
		queryClient
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const rootEl = document.getElementById('root');
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router}/>
			</QueryClientProvider>
		</React.StrictMode>
	);
}
