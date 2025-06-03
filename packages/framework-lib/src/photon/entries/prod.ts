import { enhance } from "@universal-middleware/core";
import sirv from "@universal-middleware/sirv";
import { apiMiddleware } from "../middlewares/api";
import { ssrMiddleware } from "../middlewares/ssr";
import type { UniversalMiddleware } from "@universal-middleware/core";

export default [
	enhance(sirv("dist/client"), { name: "sirv" }),
	apiMiddleware,
	ssrMiddleware,
] satisfies Array<UniversalMiddleware>;
