import { testRunner } from '../test-utils.mjs';
import testSIMDI16x8Compare from './simd-i16x8-compare-test.mjs';

try {
    await testRunner(testSIMDI16x8Compare, "simd-i16x8-compare", true);
} catch (error) {
    console.error(`Test failed: ${error.message}`);
    process.exit(1);
}
