import { testRunner } from "../test-utils.mjs";
import testAtomicAlignment from "./atomic-alignment-test.mjs";
import testAtomicOps from "./atomic-ops-test.mjs";

try {
	const results = await Promise.all([
		testRunner(testAtomicOps, "atomic-ops", true),
		testRunner(testAtomicAlignment, "atomic-alignment", true),
	]);
	if (results.includes(false)) {
		throw new Error("One or more tests failed");
	}
} catch (e) {
	console.error("❌ Test failed:", e);
	process.exit(1);
}
