function createVirtualId(name: string) {
	return `virtual:repo-framework-lib/${name}`;
}

export function createVirtualModule(name: string) {
	const id = createVirtualId(name);
	return {
		id,
		resolvedId: `\0${id}`,
		url: `/@id/__x00__${id}`,
	};
}

type VirtualModule = ReturnType<typeof createVirtualModule>;

// prettier-ignore
export const virtualInjectHmrRuntime = createVirtualModule("inject-hmr-runtime");
export const virtualHmrRuntime = createVirtualModule("hmr-runtime");

export const virtualClientEntry: VirtualModule = {
	id: createVirtualId("entry-client"),
	resolvedId: "",
	url: "/src/entry-client.tsx",
};

export const virtualServerEntryId = "virtual:repo-framework-lib:entry-server";
