import { testRunner } from "../test-utils.mjs";
import testCompilation from "./test-compiler.mjs";

try {
	const results = await Promise.all([
		testRunner(testCompilation, "compiler", true),
	]);

	if (results.includes(false)) {
		throw new Error("One or more tests failed");
	}
} catch (e) {
	console.error("Test failed:", e);
	process.exit(1);
}
