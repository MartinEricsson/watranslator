// filepath: /Users/martinericsson/dev/fes-compiler/tests/simd-i8x16-compare/simd-i8x16-compare-test.mjs
import { readTestData, logger } from '../test-utils.mjs';

async function testSIMDi8x16Compare(debug = false) {
    const log = logger(debug);
    try {
        const { wasmBuffer } = await readTestData('simd-i8x16-compare/simd-i8x16-compare.wat', debug);
        log('SIMD i8x16 comparison test WAT file loaded successfully');
        
        const { instance } = await WebAssembly.instantiate(wasmBuffer);
        log('SIMD i8x16 comparison test WASM module instantiated successfully');
        
        // Test i8x16.eq - equal comparison
        const eqResult = instance.exports.test_i8x16_eq();
        log(`test_i8x16_eq: got ${eqResult}, expected -1`);
        if (eqResult !== -1) {
            throw new Error(`i8x16.eq test failed: expected -1, got ${eqResult}`);
        }
        
        // Test i8x16.ne - not equal comparison
        const neResult = instance.exports.test_i8x16_ne();
        log(`test_i8x16_ne: got ${neResult}, expected -1`);
        if (neResult !== -1) {
            throw new Error(`i8x16.ne test failed: expected -1, got ${neResult}`);
        }
        
        // Test i8x16.lt_s - less than signed comparison
        const ltSResult = instance.exports.test_i8x16_lt_s();
        log(`test_i8x16_lt_s: got ${ltSResult}, expected -1`);
        if (ltSResult !== -1) {
            throw new Error(`i8x16.lt_s test failed: expected -1, got ${ltSResult}`);
        }
        
        // Test i8x16.lt_u - less than unsigned comparison
        const ltUResult = instance.exports.test_i8x16_lt_u();
        log(`test_i8x16_lt_u: got ${ltUResult}, expected -1`);
        if (ltUResult !== -1) {
            throw new Error(`i8x16.lt_u test failed: expected -1, got ${ltUResult}`);
        }
        
        // Test i8x16.gt_s - greater than signed comparison
        const gtSResult = instance.exports.test_i8x16_gt_s();
        log(`test_i8x16_gt_s: got ${gtSResult}, expected -1`);
        if (gtSResult !== -1) {
            throw new Error(`i8x16.gt_s test failed: expected -1, got ${gtSResult}`);
        }
        
        // Test i8x16.gt_u - greater than unsigned comparison
        const gtUResult = instance.exports.test_i8x16_gt_u();
        log(`test_i8x16_gt_u: got ${gtUResult}, expected 0`);
        if (gtUResult !== 0) {
            throw new Error(`i8x16.gt_u test failed: expected 0, got ${gtUResult}`);
        }
        
        // Test i8x16.le_s - less than or equal signed comparison
        const leSResult = instance.exports.test_i8x16_le_s();
        log(`test_i8x16_le_s: got ${leSResult}, expected -1`);
        if (leSResult !== -1) {
            throw new Error(`i8x16.le_s test failed: expected -1, got ${leSResult}`);
        }
        
        // Test i8x16.le_u - less than or equal unsigned comparison
        const leUResult = instance.exports.test_i8x16_le_u();
        log(`test_i8x16_le_u: got ${leUResult}, expected -1`);
        if (leUResult !== -1) {
            throw new Error(`i8x16.le_u test failed: expected -1, got ${leUResult}`);
        }
        
        // Test i8x16.ge_s - greater than or equal signed comparison
        const geSResult = instance.exports.test_i8x16_ge_s();
        log(`test_i8x16_ge_s: got ${geSResult}, expected -1`);
        if (geSResult !== -1) {
            throw new Error(`i8x16.ge_s test failed: expected -1, got ${geSResult}`);
        }
        
        // Test i8x16.ge_u - greater than or equal unsigned comparison
        const geUResult = instance.exports.test_i8x16_ge_u();
        log(`test_i8x16_ge_u: got ${geUResult}, expected -1`);
        if (geUResult !== -1) {
            throw new Error(`i8x16.ge_u test failed: expected -1, got ${geUResult}`);
        }
        
        return { success: true };
    } catch (error) {
        log(`Error: ${error.message}`);
        return { success: false, error };
    }
} // Generated by 🤖

export default testSIMDi8x16Compare;
