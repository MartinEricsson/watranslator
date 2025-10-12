import { testRunner } from "../test-utils.mjs";
import testRemainder from "./remainder-test.mjs";

try {
	const results = await Promise.all([
		testRunner(testRemainder, "remainder", true),
	]);
	if (results.includes(false)) {
		throw new Error("One or more tests failed");
	}
} catch (e) {
	console.error("Test failed:", e);
	process.exit(1);
}
