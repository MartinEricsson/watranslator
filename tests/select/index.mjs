import { testRunner } from "../test-utils.mjs";
import testSelect from "./select-test.mjs";
import testTypedSelect from "./select-typed-test.mjs";
import testSelectReference from "./select-typed-reference-test.mjs";

try {
    const results = await Promise.all([
        testRunner(testSelect, "select", true),
        testRunner(testTypedSelect, "select-typed", true),
        testRunner(testSelectReference, "select-typed-reference", true)
    ]);

    if (results.includes(false)) {
        throw new Error("One or more tests failed");
    }
} catch (e) {
    console.error("Test failed:", e);
    process.exit(1);
}
