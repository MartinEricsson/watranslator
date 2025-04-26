import { testRunner } from '../test-utils.mjs';
import testSIMDi8x16Compare from './simd-i8x16-compare-test.mjs';

try {
    await testRunner(testSIMDi8x16Compare, "simd-i8x16-compare", true);
} catch (error) {
    console.error(`Test failed: ${error.message}`);
    process.exit(1);
}
