import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./app";

startTransition(() => {
	console.info("[app] Starting hydration process...");
	hydrateRoot(document, <App />);
});
