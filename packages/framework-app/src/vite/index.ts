import * as pathe from "pathe";
import { installPhoton } from "@photonjs/core/vite";
import type { Plugin } from "vite";

const virtualClientEntry = "virtual:framework-app:entry-client";
const virtualServerEntry = "virtual:framework-app:entry-server";

function myFrameworkPlugin(): Plugin {
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
		},
		configEnvironment(name) {
			if (name === "ssr") {
				return {
					build: {
						outDir: "./dist/server",
						emptyOutDir: false,
						rollupOptions: {
							input: {
								index: virtualServerEntry,
							},
						},
						manifest: true,
						ssrManifest: true,
					},
				};
			}

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

function photonPlugin(): Array<Plugin> {
	return installPhoton("framework-app", {
		fullInstall: true,
		resolveMiddlewares() {
			return "@repo/framework-app/universal-middleware";
		},
	});
}

function frameworkPlugin(): Array<Plugin> {
	return [myFrameworkPlugin(), ...photonPlugin()];
}

export { frameworkPlugin };
