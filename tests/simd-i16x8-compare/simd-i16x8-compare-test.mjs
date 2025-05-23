import { readTestData, logger } from '../test-utils.mjs';

// Test for i16x8 comparison operations
async function testSIMDI16x8Compare(debug = false) {
    const log = logger(debug);
    try {
        const { wasmBuffer } = await readTestData('simd-i16x8-compare/simd-i16x8-compare.wat', debug);
        log('SIMD i16x8 comparison test WAT file loaded successfully');
        
        const { instance } = await WebAssembly.instantiate(wasmBuffer);
        log('SIMD i16x8 comparison test WASM module instantiated successfully');
        
        // Test i16x8.eq (equality)
        const eqResult = instance.exports.i16x8_eq_test();
        log(`i16x8_eq_test: got ${eqResult}, expected -1`);
        if (eqResult !== -1) {
            throw new Error(`i16x8.eq test failed: expected -1, got ${eqResult}`);
        }
        
        // Test i16x8.ne (not equal)
        const neResult = instance.exports.i16x8_ne_test();
        log(`i16x8_ne_test: got ${neResult}, expected -1`);
        if (neResult !== -1) {
            throw new Error(`i16x8.ne test failed: expected -1, got ${neResult}`);
        }
        
        // Test i16x8.lt_s (less than, signed)
        const ltSResult = instance.exports.i16x8_lt_s_test();
        log(`i16x8_lt_s_test: got ${ltSResult}, expected -1`);
        if (ltSResult !== -1) {
            throw new Error(`i16x8.lt_s test failed: expected -1, got ${ltSResult}`);
        }
        
        // Test i16x8.lt_u (less than, unsigned)
        const ltUResult = instance.exports.i16x8_lt_u_test();
        log(`i16x8_lt_u_test: got ${ltUResult}, expected -1`);
        if (ltUResult !== -1) {
            throw new Error(`i16x8.lt_u test failed: expected -1, got ${ltUResult}`);
        }
        
        // Test i16x8.gt_s (greater than, signed)
        const gtSResult = instance.exports.i16x8_gt_s_test();
        log(`i16x8_gt_s_test: got ${gtSResult}, expected -1`);
        if (gtSResult !== -1) {
            throw new Error(`i16x8.gt_s test failed: expected -1, got ${gtSResult}`);
        }
        
        // Test i16x8.gt_u (greater than, unsigned)
        const gtUResult = instance.exports.i16x8_gt_u_test();
        log(`i16x8_gt_u_test: got ${gtUResult}, expected -1`);
        if (gtUResult !== -1) {
            throw new Error(`i16x8.gt_u test failed: expected -1, got ${gtUResult}`);
        }
        
        // Test i16x8.le_s (less than or equal, signed)
        const leSResult = instance.exports.i16x8_le_s_test();
        log(`i16x8_le_s_test: got ${leSResult}, expected -1`);
        if (leSResult !== -1) {
            throw new Error(`i16x8.le_s test failed: expected -1, got ${leSResult}`);
        }
        
        // Test i16x8.le_u (less than or equal, unsigned)
        const leUResult = instance.exports.i16x8_le_u_test();
        log(`i16x8_le_u_test: got ${leUResult}, expected -1`);
        if (leUResult !== -1) {
            throw new Error(`i16x8.le_u test failed: expected -1, got ${leUResult}`);
        }
        
        // Test i16x8.ge_s (greater than or equal, signed)
        const geSResult = instance.exports.i16x8_ge_s_test();
        log(`i16x8_ge_s_test: got ${geSResult}, expected -1`);
        if (geSResult !== -1) {
            throw new Error(`i16x8.ge_s test failed: expected -1, got ${geSResult}`);
        }
        
        // Test i16x8.ge_u (greater than or equal, unsigned)
        const geUResult = instance.exports.i16x8_ge_u_test();
        log(`i16x8_ge_u_test: got ${geUResult}, expected -1`);
        if (geUResult !== -1) {
            throw new Error(`i16x8.ge_u test failed: expected -1, got ${geUResult}`);
        }
        
        log('All SIMD i16x8 comparison tests passed!');
        return true;
    } catch (error) {
        console.error('Error during SIMD i16x8 comparison test:', error);
        return false;
    }
} // Generated by 🤖

export default testSIMDI16x8Compare;
