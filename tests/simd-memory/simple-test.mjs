import testSIMDMemorySimple from './simd-memory-simple-test.mjs';
import { testRunner } from '../test-utils.mjs';

try {
    const result = await testRunner(testSIMDMemorySimple, 'simd-memory-simple', true);
    if (!result) {
        throw new Error('Simple SIMD memory test failed');
    }
}
catch (error) {
    console.error('Error during simple SIMD memory test:', error);
    process.exit(1);
}
// Generated by 🤖
