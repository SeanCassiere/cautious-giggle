/// <reference types="@photonjs/core/api" />
import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import { frameworkPlugin } from "@repo/framework-lib/vite";

export default defineConfig({
	photon: {
		server: "./server.ts",
	},
	plugins: [
		frameworkPlugin(),
		// react()
	],
});
