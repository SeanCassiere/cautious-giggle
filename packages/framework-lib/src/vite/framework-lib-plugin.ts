import * as pathe from "pathe";
import type { Plugin } from "vite";

const virtualClientEntry = "virtual:framework-app:entry-client";
const virtualServerEntry = "virtual:framework-app:entry-server";

export function myFrameworkPlugin(): Plugin {
	let root = process.cwd();

	return {
		name: "@repo/framework-app",
		sharedDuringBuild: true,
		config() {
			return {
				ssr: {},
				builder: {
					async buildApp(builder) {
						await builder.build(builder.environments.client);
						await builder.build(builder.environments.ssr);
					},
				},
			};
		},
		configResolved(config) {
			root = config.root;
			console.log(`Framework app plugin initialized with root: ${root}`);
		},
		configEnvironment(name) {
			if (name === "client") {
				return {
					build: {
						rollupOptions: {
							input: {
								index: virtualClientEntry,
							},
						},
						outDir: "./dist/client",
						manifest: true,
						ssrManifest: true,
					},
				};
			}

			if (name === "ssr") {
				return {
					build: {
						outDir: "./dist/server",
						emptyOutDir: false,
					},
				};
			}

			return undefined;
		},
		resolveId(id) {
			if (id === virtualClientEntry) {
				return pathe.join(root, "src", "entry-client.tsx");
			}

			if (id === virtualServerEntry) {
				return pathe.join(root, "src", "entry-server.tsx");
			}

			return undefined;
		},
	};
}
