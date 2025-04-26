import { testRunner } from "../test-utils.mjs";
import testSIMDi8x16Ops from "./simd-i8x16-ops-test.mjs";

try {
    await testRunner(testSIMDi8x16Ops, "simd-i8x16-ops", true);
}
catch (error) {
    console.error(`Test failed: ${error.message}`);
    process.exit(1);
}