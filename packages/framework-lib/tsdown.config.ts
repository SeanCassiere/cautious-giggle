import { defineConfig } from "tsdown";

export default defineConfig({
	entry: [
		"./src/vite/index.ts",
		"./src/photon/entries/prod.ts",
		"./src/photon/entries/dev.ts",
	],
	dts: true,
	format: ["esm"],
	external: ["virtual:repo-framework-lib:entry-server"],
});
