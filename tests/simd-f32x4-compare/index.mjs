import { testRunner } from "../test-utils.mjs";
import testSIMDf32x4Compare from "./simd-f32x4-compare-test.mjs";

try {
    const result = await testRunner(testSIMDf32x4Compare, "simd-f32x4-compare", true);
    if (!result) {
        throw new Error("SIMD f32x4 comparison tests failed");
    }
    console.log("SIMD f32x4 comparison tests passed");
}
catch (error) {
    console.error(`Test failed: ${error.message}`);
    process.exit(1);
}