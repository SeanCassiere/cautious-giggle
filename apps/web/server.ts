// Will be moved to @photonjs/hono
import { apply, serve } from "@photonjs/core/hono";
import awesomeFramework from "@repo/framework-lib/universal-middleware";
import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";

function startServer() {
	const app = new Hono();

	console.info("[app] Starting hono server...");

	app.use(poweredBy());

	apply(
		app,
		// Adds the framework's middlewares
		awesomeFramework
	);

	return serve(app);
}

export default startServer();
