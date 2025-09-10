import { testRunner } from "../test-utils.mjs";
import testGlobalVariables from "./global-variables-test.mjs";

try {
	const results = await Promise.all([
		testRunner(testGlobalVariables, "global-variables", true),
	]);
	if (results.includes(false)) {
		throw new Error("One or more tests failed");
	}
} catch (e) {
	console.error("Test failed:", e);
	process.exit(1);
}
