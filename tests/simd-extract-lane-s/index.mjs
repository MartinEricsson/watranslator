import simdExtractLaneSTest from './simd-extract-lane-s-test.mjs';
import { testRunner } from '../test-utils.mjs';
try {
    const results = await Promise.all([
        testRunner(simdExtractLaneSTest, 'simd-extract-lane-s', true),
    ]);
    if (results.includes(false)) {
        throw new Error('One or more tests failed');
    }
} catch (e) {
    console.error('Test failed:', e);
    process.exit(1);
}
