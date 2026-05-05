import { testRunner } from "../test-utils.mjs";
import testF32F64Memarg from "./f32-f64-memarg-test.mjs";
import testI64Load from "./i64-load-test.mjs";
import testI64LoadDefaultAlign from "./i64-load-default-align-test.mjs";
import testMemoryLoad from "./memory-load-test.mjs";

try {
	const results = await Promise.all([
		testRunner(testMemoryLoad, "memory-load", true),
		testRunner(testI64Load, "i64-load", true),
		testRunner(testI64LoadDefaultAlign, "i64-load-default-align", true),
		testRunner(testF32F64Memarg, "f32-f64-memarg", true),
	]);
	if (results.includes(false)) {
		throw new Error("One or more tests failed");
	}
} catch (e) {
	console.error("Test failed:", e);
	process.exit(1);
}
