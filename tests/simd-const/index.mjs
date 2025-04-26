import testSIMDConst from "./simd-const-test.mjs";
import testSIMDConstError from "./simd-const-error-test.mjs";
import { testRunner } from "../test-utils.mjs";

try {
    const results = await Promise.all([
        testRunner(testSIMDConst, "simd-const", true),
        //testRunner(testSIMDConstError, "simd-const-error", true),
    ]);
    if (results.includes(false)) {
        throw new Error("One or more tests failed");
    }
}
catch (e) {
    console.error("Test failed:", e);
    process.exit(1);
}