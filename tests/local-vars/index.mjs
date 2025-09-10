import { testRunner } from "../test-utils.mjs";
import testLocalVariables from "./local-vars-test.mjs";

try {
	const results = await Promise.all([
		testRunner(testLocalVariables, "local-vars", true),
	]);
	if (results.includes(false)) {
		throw new Error("One or more tests failed");
	}
} catch (e) {
	console.error("Test failed:", e);
	process.exit(1);
}
