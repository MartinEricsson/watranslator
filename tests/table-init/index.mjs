import { testRunner } from "../test-utils.mjs";
import testTableInit from "./table-init-test.mjs";

try {
    const results = await Promise.all([
        testRunner(testTableInit, "table-init", true)
    ]);

    if (results.includes(false)) {
        throw new Error("One or more tests failed");
    }
}
catch (e) {
    console.error("Test failed:", e);
    process.exit(1);
}