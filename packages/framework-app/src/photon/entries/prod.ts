import type { UniversalMiddleware } from "@universal-middleware/core";
import { apiMiddleware } from "../middlewares/api";
import { ssrMiddleware } from "../middlewares/ssr";

export default [
	apiMiddleware,
	ssrMiddleware,
] satisfies Array<UniversalMiddleware>;
