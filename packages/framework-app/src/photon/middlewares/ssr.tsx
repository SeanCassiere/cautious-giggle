import { enhance } from "@universal-middleware/core";
import { renderToString } from "react-dom/server";

const HMR_CODE = [
	`import { injectIntoGlobalHook } from "/@react-refresh";`,
	`injectIntoGlobalHook(window);`,
	`window.$RefreshReg$ = () => {};`,
	`window.$RefreshSig$ = () => (type) => type;`,
].join("\n");

const CLIENT_ENTRY_SCRIPT = `<script type="module" src="/src/entry-client.tsx"></script>`;

export const ssrMiddleware = enhance(
	async (request: Request) => {
		console.info("[app] SSR Middleware invoked for request:", request.url);

		// @ts-expect-error some
		const App = await import("virtual:framework-app:app.tsx").then(
			(mod) => mod.default
		);

		let appHtml = renderToString(<App />, {});

		appHtml = `<!DOCTYPE html>` + appHtml;

		// Find the start of the <head> tag and add the HMR script if in development mode
		const headStartIndex = appHtml.indexOf("<head>");
		if (headStartIndex === -1) {
			const error = "Could not find <head> tag in rendered HTML.";
			console.error(error);
			return new Response(error, {
				status: 500,
			});
		}

		const hmrScript = `<script type="module">${HMR_CODE}</script>`;

		// prettier-ignore
		const htmlWithHMR = appHtml.slice(0, headStartIndex + 6) + hmrScript + appHtml.slice(headStartIndex + 6);

		// Now we have the HTML with the HMR script injected into the <head>
		appHtml = htmlWithHMR;

		// Find the end of the </body> tag and add a script tag for hydration
		const bodyEndIndex = appHtml.indexOf("</body>");

		if (bodyEndIndex === -1) {
			const error = "Could not find </body> tag in rendered HTML.";
			console.error(error);
			return new Response(error, {
				status: 500,
			});
		}

		// prettier-ignore
		appHtml = appHtml.slice(0, bodyEndIndex) + CLIENT_ENTRY_SCRIPT + appHtml.slice(bodyEndIndex);

		return new Response(appHtml, {
			status: 200,
			headers: {
				"Content-Type": "text/html",
			},
		});
	},
	// enhance() adds meta data (a Universal Middleware in itself is just a Request => Response function)
	{
		name: "awesome-framework:ssr",
		path: "/**",
		method: "GET",
	}
);
