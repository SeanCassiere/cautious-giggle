import { enhance } from "@universal-middleware/core";
// @ts-expect-error export is not typed
import { renderToReadableStream } from "react-dom/server.edge";

// const HMR_CODE = [
// 	`import { injectIntoGlobalHook } from "/@react-refresh";`,
// 	`injectIntoGlobalHook(window);`,
// 	`window.$RefreshReg$ = () => {};`,
// 	`window.$RefreshSig$ = () => (type) => type;`,
// ].join("\n");

export const ssrMiddleware = enhance(
	async (request: Request) => {
		console.info("[lib] SSR Middleware invoked for request:", request.url);

		const url = new URL(request.url);
		const pathname = url.href.replace(url.origin, "");

		// @ts-expect-error server-side entry point
		const App = await import("virtual:framework-lib:entry-server")
			.then((mod) => mod.default)
			.catch((error) => {
				console.error("[lib] Error loading App component:", error);
				throw new Error("Failed to load App component");
			});

		const ssrContext = {};

		const stream = await renderToReadableStream(
			<App pathname={pathname} ssrContext={ssrContext} />,
			{
				bootstrapModules: ["/src/entry-client.tsx"],
			}
		);

		return new Response(stream, {
			headers: { "content-type": "text/html" },
		});
	},
	// enhance() adds meta data (a Universal Middleware in itself is just a Request => Response function)
	{
		name: "awesome-framework:ssr",
		path: "/**",
		method: "GET",
	}
);
