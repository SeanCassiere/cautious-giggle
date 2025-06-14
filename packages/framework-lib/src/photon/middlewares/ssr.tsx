import { enhance } from "@universal-middleware/core";
// @ts-expect-error export is not typed
import { renderToReadableStream } from "react-dom/server.edge";
import { virtualInjectHmrRuntime } from "../../vite/virtual-modules";

export const ssrMiddleware = enhance(
	async (request: Request) => {
		const url = new URL(request.url);
		const pathname = url.href.replace(url.origin, "");

		// @ts-expect-error virtual module import
		const App = await import("virtual:repo-framework-lib:entry-server")
			.then((mod) => mod.default)
			.catch((error) => {
				console.error("[lib] Error loading App component:", error);
				throw new Error("Failed to load App component");
			});

		const ssrContext = {};

		const stream = await renderToReadableStream(
			<App pathname={pathname} ssrContext={ssrContext} />,
			{
				bootstrapModules: [
					virtualInjectHmrRuntime.url,
					// "/src/entry-client.tsx",
				],
			}
		);

		return new Response(stream, {
			headers: { "content-type": "text/html" },
		});
	},
	// enhance() adds meta data (a Universal Middleware in itself is just a Request => Response function)
	{
		name: "repo-framework-lib:ssr",
		path: "/**",
		method: "GET",
	}
);
