// Generated by 🤖
import testSIMDf64x2Ops from './simd-f64x2-ops-test.mjs';
import { testRunner } from '../test-utils.mjs';

try {
    const results = await Promise.all([
        testRunner(testSIMDf64x2Ops, 'simd-f64x2-ops', true),
    ]);
    if (results.includes(false)) {
        throw new Error('One or more tests failed');
    }
} catch (e) {
    console.error('Test failed:', e);
    process.exit(1);
}
