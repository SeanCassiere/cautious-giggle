import * as pathe from "pathe";
import { installPhoton } from "@photonjs/core/vite";
import type { Plugin } from "vite";

const virtualAppClient = "virtual:framework-app:entry-client.tsx";
const virtualAppExport = "virtual:framework-app:app.tsx";

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
					},
				};
			}

			if (name === "client") {
				return {
					build: {
						rollupOptions: {
							input: {
								index: virtualAppClient,
							},
						},
						outDir: "./dist/client",
					},
				};
			}

			return undefined;
		},
		resolveId(id) {
			if (id === virtualAppExport) {
				return pathe.join(root, "src", "app.tsx");
			}

			if (id === virtualAppClient) {
				return pathe.join(root, "src", "entry-client.tsx");
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
