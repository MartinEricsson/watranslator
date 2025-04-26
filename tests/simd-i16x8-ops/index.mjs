import { testRunner } from "../test-utils.mjs";
import testSIMDi16x8Ops from "./simd-i16x8-ops-test.mjs";

try {
    await testRunner(testSIMDi16x8Ops, "simd-i16x8-ops", true);
}
catch (error) {
    console.error(`Test failed: ${error.message}`);
    process.exit(1);
}