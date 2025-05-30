import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import { frameworkPlugin } from "@repo/framework-app/vite";

export default defineConfig({
	plugins: [
		frameworkPlugin(),
		// react()
	],
});
