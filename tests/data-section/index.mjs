import { testRunner } from "../test-utils.mjs";
import testDataSection from "./data-section-test.mjs";
import testDataSectionEscapes from "./escapes-test.mjs";

try {
	const results = await Promise.all([
		testRunner(testDataSection, "data-section", true),
		testRunner(testDataSectionEscapes, "data-section-escapes", true),
	]);
	if (results.includes(false)) {
		throw new Error("One or more tests failed");
	}
} catch (e) {
	console.error("Test failed:", e);
	process.exit(1);
}
