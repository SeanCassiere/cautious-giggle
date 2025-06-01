// Adapted from Remix's HMR setup: https://github.com/remix-run/react-router/blob/main/packages/react-router-dev/vite/plugin.ts
// HMR resources from Dan Abramov: https://github.com/facebook/react/issues/16604#issuecomment-528663101
import { virtualClientEntry, virtualInjectHmrRuntime } from "./virtual-modules";
import type { Plugin } from "vite";

export function frameworkHmrPlugin(): Plugin {
	return {
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
				`import RefreshRuntime from "/@react-refresh"`,
				"RefreshRuntime.injectIntoGlobalHook(window)",
				"window.$RefreshReg$ = () => {}",
				"window.$RefreshSig$ = () => (type) => type",
				"window.__vite_plugin_react_preamble_installed__ = true",
				`import("${virtualClientEntry.id}")`,
			].join("\n");
		},
	};
}
