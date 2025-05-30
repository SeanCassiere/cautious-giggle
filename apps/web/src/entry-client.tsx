import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./app";
import { Router } from "wouter";

startTransition(() => {
	console.info("[app] Starting hydration process...");
	hydrateRoot(
		document,
		<StrictMode>
			<Router>
				<App />
			</Router>
		</StrictMode>
	);
});
