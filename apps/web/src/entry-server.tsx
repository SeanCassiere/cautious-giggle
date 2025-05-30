import { StrictMode } from "react";
import { Router } from "wouter";
import App from "./app";

export default function Render({
	pathname,
	ssrContext,
}: {
	pathname: string;
	ssrContext: { redirectTo?: string };
}) {
	return (
		<StrictMode>
			<Router ssrPath={pathname} ssrContext={ssrContext}>
				<App />
			</Router>
		</StrictMode>
	);
}
