import { installPhoton } from "@photonjs/core/vite";
import type { Plugin } from "vite";

export function photonPlugin(): Array<Plugin> {
	return installPhoton("framework-lib", {
		fullInstall: true,
		resolveMiddlewares() {
			return "@repo/framework-lib/universal-middleware";
		},
		hmr: "prefer-restart",
	});
}
