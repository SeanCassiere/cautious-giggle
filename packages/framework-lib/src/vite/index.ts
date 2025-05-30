import type { Plugin } from "vite";
import { myFrameworkPlugin } from "./framework-lib-plugin";
import { photonPlugin } from "./photon-plugin";

function frameworkPlugin(): Array<Plugin> {
	return [myFrameworkPlugin(), ...photonPlugin()];
}

export { frameworkPlugin };
