import { apiMiddleware } from "../middlewares/api";
import { ssrMiddleware } from "../middlewares/ssr";
import type { UniversalMiddleware } from "@universal-middleware/core";

export default [
	apiMiddleware,
	ssrMiddleware,
] satisfies Array<UniversalMiddleware>;
