import * as pathe from "pathe";
import type { Plugin } from "vite";
import { virtualClientEntry, virtualServerEntryId } from "./virtual-modules";

export function myFrameworkPlugin(): Plugin {
	let root = process.cwd();

	return {
		name: "repo-framework-lib:my-framework",
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
		},
		configEnvironment(name) {
			if (name === "client") {
				return {
					build: {
						rollupOptions: {
							input: {
								index: virtualClientEntry.id,
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
			if (id === virtualClientEntry.id) {
				return pathe.join(root, "src", "entry-client.tsx");
			}

			if (id === virtualServerEntryId) {
				return pathe.join(root, "src", "entry-server.tsx");
			}

			return undefined;
		},
	};
}
