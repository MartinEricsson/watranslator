import { testRunner } from "../test-utils.mjs";
import testSIMDI64x2Ops from "./simd-i64x2-ops-test.mjs";

// Run the test
try {
    await testRunner(testSIMDI64x2Ops, { debug: true });
} catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
}