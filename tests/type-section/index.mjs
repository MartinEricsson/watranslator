import { testRunner } from "../test-utils.mjs";
import testTypeSectionDedup from "./type-section-dedup-test.mjs";

const results = await Promise.all([
	testRunner(testTypeSectionDedup, "type-section-dedup", true),
]);

if (results.includes(false)) {
	process.exit(1);
}
