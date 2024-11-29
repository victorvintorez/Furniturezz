import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 3000,
		proxy: {
			"^/api": {
				target: "http://localhost:8000",
			},
			"^/upload": {
				target: "http://localhost:8000",
			}
		}
	},
	plugins: [react(), TanStackRouterVite({
		autoCodeSplitting: true,
	})],
});
