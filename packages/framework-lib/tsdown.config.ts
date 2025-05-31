import { defineConfig } from "tsdown";
import * as fsp from "node:fs/promises";

const external = ["./static/refresh-utils.cjs"];

export default defineConfig({
	entry: [
		"./src/vite/index.ts",
		"./src/photon/entries/prod.ts",
		"./src/photon/entries/dev.ts",
	],
	dts: true,
	format: ["esm"],
	external: ["virtual:repo-framework-lib:entry-server", ...external],
	plugins: [
		{
			name: "copy",
			async buildEnd() {
				await fsp.mkdir("./dist/vite/static", { recursive: true });
				await fsp.copyFile(
					"./src/vite/static/react-refresh-utils.cjs",
					"./dist/vite/static/react-refresh-utils.cjs"
				);
			},
		},
	],
});
