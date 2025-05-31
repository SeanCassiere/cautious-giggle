import type { Plugin } from "vite";
import { myFrameworkPlugin } from "./framework-lib-plugin";
import { photonPlugin } from "./photon-plugin";
import { hmrPlugin } from "./hmr-plugin";

function frameworkPlugin(): Array<Plugin> {
	return [...hmrPlugin(), myFrameworkPlugin(), ...photonPlugin()];
}

export { frameworkPlugin };
