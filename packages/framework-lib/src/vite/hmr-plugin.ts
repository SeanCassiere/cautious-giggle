// Adapted from Remix's HMR setup: https://github.com/remix-run/react-router/blob/main/packages/react-router-dev/vite/plugin.ts
// HMR resources from Dan Abramov: https://github.com/facebook/react/issues/16604#issuecomment-528663101
import * as pathe from "pathe";
import * as fsp from "node:fs/promises";
import * as babel from "@babel/core";
import * as vite from "vite";
import {
	createVirtualModule,
	virtualClientEntry,
	virtualHmrRuntime,
	virtualInjectHmrRuntime,
} from "./virtual-modules";
// import { generate, traverse } from "./babel";
import type { Plugin } from "vite";

export function hmrPlugin(): Array<Plugin> {
	let root = process.cwd();
	let viteCommand: vite.ResolvedConfig["command"];

	return [
		{
			name: "repo-framework-lib:inject-hmr-runtime",
			enforce: "pre",
			resolveId(id) {
				if (id === virtualInjectHmrRuntime.id) {
					return virtualInjectHmrRuntime.resolvedId;
				}
			},
			async load(id) {
				if (id !== virtualInjectHmrRuntime.resolvedId) {
					return;
				}

				return [
					`import RefreshRuntime from "${virtualHmrRuntime.id}"`,
					"RefreshRuntime.injectIntoGlobalHook(window)",
					"window.$RefreshReg$ = () => {}",
					"window.$RefreshSig$ = () => (type) => type",
					"window.__vite_plugin_react_preamble_installed__ = true",
					`import("${virtualClientEntry.id}")`,
				].join("\n");
			},
			configResolved(config) {
				root = config.root;
				viteCommand = config.command;
			},
		},
		{
			name: "repo-framework-lib:hmr-runtime",
			enforce: "pre",
			resolveId(id) {
				if (id === virtualHmrRuntime.id) {
					return virtualHmrRuntime.resolvedId;
				}
			},
			async load(id) {
				if (id !== virtualHmrRuntime.resolvedId) {
					return;
				}

				const reactRefreshDir = pathe.dirname(
					require.resolve("react-refresh/package.json")
				);
				const reactRefreshRuntimePath = pathe.join(
					reactRefreshDir,
					"cjs/react-refresh-runtime.development.js"
				);

				const content = [
					"const exports = {}",
					await fsp.readFile(reactRefreshRuntimePath, "utf-8"),

					await fsp.readFile(
						require.resolve("./static/react-refresh-utils.cjs"),
						"utf-8"
					),
					"export default exports",
				].join("\n");

				return content;
			},
		},
		{
			name: "repo-framework-lib:react-refresh-babel",
			async transform(code, id, options) {
				if (!viteCommand || viteCommand !== "serve") return;
				if (id.includes("/node_modules/") || id.includes("/dist/")) return;

				const [filepath] = id.split("?");
				const extensionsRE = /\.(jsx?|tsx?|md?)$/;
				if (!extensionsRE.test(filepath)) return;

				const devRuntime = "react/jsx-dev-runtime";
				const ssr = options?.ssr === true;
				const isJSX = filepath.endsWith("x");
				const useFastRefresh = !ssr && (isJSX || code.includes(devRuntime));
				if (!useFastRefresh) return;

				const result = await babel.transformAsync(code, {
					babelrc: false,
					configFile: false,
					filename: id,
					sourceFileName: filepath,
					parserOpts: {
						sourceType: "module",
						allowAwaitOutsideFunction: true,
					},
					plugins: [[require("react-refresh/babel"), { skipEnvCheck: true }]],
					sourceMaps: true,
				});

				if (result === null) return;

				code = result.code!;

				const refreshContentRE = /\$Refresh(?:Reg|Sig)\$\(/;
				if (refreshContentRE.test(code)) {
					code = addRefreshWrapper(code, id);
				}

				return { code, map: result.map };
			},
		},
		{
			name: "repo-framework-lib:hmr-updates",
			async handleHotUpdate({ server, modules, file, read }) {
				console.debug("handleHotUpdate() file\n---", JSON.stringify(file));

				const hmrEvent = { route: null };

				// modules.forEach((mod) => {
				// 	// console.debug("-----");
				// 	// console.debug("handleHotUpdate() mod\n", mod.id);
				// 	if (mod.id) {
				// 		const foundModule = server.moduleGraph.getModuleById(mod.id);
				// 		// console.debug("handleHotUpdate() foundModule\n", foundModule);
				// 		if (foundModule) {
				// 			server.moduleGraph.invalidateModule(foundModule);
				// 		}
				// 	}
				// 	// console.debug("-----");
				// });
				// [
				// 	pathe.join(root, "src", "entry-server.tsx"),
				// 	pathe.join(root, "src", "entry-client.tsx"),
				// ].forEach((virtualId) => {
				// 	const module = server.moduleGraph.getModuleById(virtualId);
				// 	console.debug(
				// 		"---\n",
				// 		"handleHotUpdate() virtual module",
				// 		virtualId,
				// 		"\n",
				// 		module
				// 	);
				// 	if (module) {
				// 		server.moduleGraph.invalidateModule(module);
				// 	}
				// });

				// invalidateVirtualModules(server);

				server.hot.send({
					type: "custom",
					event: "repo-framework-lib:hmr",
					data: hmrEvent,
				});

				return modules;
			},
		},
		{
			name: "repo-framework-lib:server-to-trigger-client-hmr",
			hotUpdate({ server, modules }) {
				if (this.environment.name !== "ssr" && modules.length === 0) {
					return;
				}

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const clientModules: Array<any> = []; //
				//  let clientModules = uniqueNodes(
				//   modules.flatMap((mod) =>
				//     getParentClientNodes(server.environments.client.moduleGraph, mod)
				//   )
				// );

				for (const clientModule of clientModules) {
					server.environments.client.reloadModule(clientModule);
				}
			},
		},
	];
}

const virtual = {
	serverManifest: createVirtualModule("server-manifest"),
	browserManifest: virtualClientEntry,
};

function invalidateVirtualModules(viteDevServer: vite.ViteDevServer) {
	Object.values(virtual).forEach((virtualMod) => {
		console.log("virtualMod", virtualMod);
		const mod = viteDevServer.moduleGraph.getModuleById(virtualMod.resolvedId);
		console.log("mod", mod);
		if (mod) {
			viteDevServer.moduleGraph.invalidateModule(mod);
		}
	});
}

function addRefreshWrapper(code: string, id: string): string {
	const REACT_REFRESH_HEADER = `
import RefreshRuntime from "${virtualHmrRuntime.id}";

const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;

if (import.meta.hot && !inWebWorker) {
  if (!window.__vite_plugin_react_preamble_installed__) {
    throw new Error(
      "React HMR Vite plugin can't detect preamble. Something is wrong."
    );
  }

  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    RefreshRuntime.register(type, __SOURCE__ + " " + id)
  };
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
};`.replaceAll("\n", ""); // Header is all on one line so source maps aren't affected

	const REACT_REFRESH_FOOTER = `
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh(__SOURCE__, currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(currentExports, nextExports, []);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}`;

	return (
		REACT_REFRESH_HEADER.replaceAll("__SOURCE__", JSON.stringify(id)) +
		code +
		REACT_REFRESH_FOOTER.replaceAll("__SOURCE__", JSON.stringify(id))
	);
}
