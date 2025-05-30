// Will be moved to @photonjs/hono
import { apply, serve } from "@photonjs/core/hono";
import awesomeFramework from "@repo/framework-app/universal-middleware";
import { Hono } from "hono";

async function startServer() {
	const app = new Hono();

	apply(
		app,
		// Adds the framework's middlewares
		awesomeFramework
	);

	return serve(app);
}

export default await startServer();
