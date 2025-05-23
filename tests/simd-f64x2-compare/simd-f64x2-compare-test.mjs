// filepath: /Users/martinericsson/dev/fes-compiler/tests/simd-f64x2-compare/simd-f64x2-compare-test.mjs
import { readTestData, logger } from '../test-utils.mjs';

async function testSIMDF64x2Compare(debug = false) {
    const log = logger(debug);
    try {
        const { wasmBuffer } = await readTestData('simd-f64x2-compare/simd-f64x2-compare.wat', debug);
        log('SIMD f64x2 compare test WAT file loaded successfully');
        
        const { instance } = await WebAssembly.instantiate(wasmBuffer);
        log('SIMD f64x2 compare test WASM module instantiated successfully');
        
        // Test f64x2.eq
        const eqResult = instance.exports.test_f64x2_eq();
        log(`f64x2.eq test: got ${eqResult}, expected -1`);
        if (eqResult !== -1) {
            throw new Error(`f64x2.eq test failed: expected -1, got ${eqResult}`);
        }
        
        // Test f64x2.ne
        const neResult = instance.exports.test_f64x2_ne();
        log(`f64x2.ne test: got ${neResult}, expected -1`);
        if (neResult !== -1) {
            throw new Error(`f64x2.ne test failed: expected -1, got ${neResult}`);
        }
        
        // Test f64x2.lt
        const ltResult = instance.exports.test_f64x2_lt();
        log(`f64x2.lt test: got ${ltResult}, expected -1`);
        if (ltResult !== -1) {
            throw new Error(`f64x2.lt test failed: expected -1, got ${ltResult}`);
        }
        
        // Test f64x2.gt
        const gtResult = instance.exports.test_f64x2_gt();
        log(`f64x2.gt test: got ${gtResult}, expected -2`);
        if (gtResult !== -2) {
            throw new Error(`f64x2.gt test failed: expected -2, got ${gtResult}`);
        }
        
        // Test f64x2.le
        const leResult = instance.exports.test_f64x2_le();
        log(`f64x2.le test: got ${leResult}, expected -2`);
        if (leResult !== -2) {
            throw new Error(`f64x2.le test failed: expected -2, got ${leResult}`);
        }
        
        // Test f64x2.ge
        const geResult = instance.exports.test_f64x2_ge();
        log(`f64x2.ge test: got ${geResult}, expected -2`);
        if (geResult !== -2) {
            throw new Error(`f64x2.ge test failed: expected -2, got ${geResult}`);
        }
        
        log('All SIMD f64x2 comparison tests passed!');
        return true;
    } catch (error) {
        console.error('Error during SIMD f64x2 comparison test:', error);
        return false;
    }
}

export default testSIMDF64x2Compare;
// Generated by 🤖
