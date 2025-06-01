import type { Plugin } from "vite";
import { frameworkEntriesPlugin } from "./framework-entries-plugin";
import { photonPlugin } from "./photon-plugin";
import { frameworkHmrPlugin } from "./framework-hmr-plugin";

function frameworkPlugin(): Array<Plugin> {
	return [frameworkHmrPlugin(), frameworkEntriesPlugin(), ...photonPlugin()];
}

export { frameworkPlugin };
