import testSIMDi32x4Compare from "./simd-i32x4-compare-test.mjs";
import { testRunner } from "../test-utils.mjs";

try {
    await testRunner(testSIMDi32x4Compare, "simd-i32x4-compare", true);
}
catch (error) {
    console.error(`Test failed: ${error.message}`);
    process.exit(1);
}