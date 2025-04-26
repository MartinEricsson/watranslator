import { readTestData, logger } from '../test-utils.mjs';

// Test for i64x2 comparison operations
async function testSIMDI64x2Compare(debug = false) {
    const log = logger(debug);
    try {
        const { wasmBuffer } = await readTestData('simd-i64x2-compare/simd-i64x2-compare.wat', debug);
        log('SIMD i64x2 comparison test WAT file loaded successfully');
        
        const { instance } = await WebAssembly.instantiate(wasmBuffer);
        log('SIMD i64x2 comparison test WASM module instantiated successfully');
        
        // Test i64x2.eq
        const eqTrueResult = instance.exports.test_i64x2_eq_true();
        log(`i64x2.eq true test: got ${eqTrueResult}, expected -1`);
        if (eqTrueResult !== -1) {
            throw new Error(`i64x2.eq true test failed: expected -1, got ${eqTrueResult}`);
        }
        
        const eqFalseResult = instance.exports.test_i64x2_eq_false();
        log(`i64x2.eq false test: got ${eqFalseResult}, expected 0`);
        if (eqFalseResult !== 0) {
            throw new Error(`i64x2.eq false test failed: expected 0, got ${eqFalseResult}`);
        }
        
        // Test i64x2.ne
        const neTrueResult = instance.exports.test_i64x2_ne_true();
        log(`i64x2.ne true test: got ${neTrueResult}, expected -1`);
        if (neTrueResult !== -1) {
            throw new Error(`i64x2.ne true test failed: expected -1, got ${neTrueResult}`);
        }
        
        const neFalseResult = instance.exports.test_i64x2_ne_false();
        log(`i64x2.ne false test: got ${neFalseResult}, expected 0`);
        if (neFalseResult !== 0) {
            throw new Error(`i64x2.ne false test failed: expected 0, got ${neFalseResult}`);
        }
        
        // Test i64x2.lt_s
        const ltTrueResult = instance.exports.test_i64x2_lt_s_true();
        log(`i64x2.lt_s true test: got ${ltTrueResult}, expected -1`);
        if (ltTrueResult !== -1) {
            throw new Error(`i64x2.lt_s true test failed: expected -1, got ${ltTrueResult}`);
        }
        
        const ltFalseResult = instance.exports.test_i64x2_lt_s_false();
        log(`i64x2.lt_s false test: got ${ltFalseResult}, expected 0`);
        if (ltFalseResult !== 0) {
            throw new Error(`i64x2.lt_s false test failed: expected 0, got ${ltFalseResult}`);
        }
        
        // Test i64x2.gt_s
        const gtTrueResult = instance.exports.test_i64x2_gt_s_true();
        log(`i64x2.gt_s true test: got ${gtTrueResult}, expected -1`);
        if (gtTrueResult !== -1) {
            throw new Error(`i64x2.gt_s true test failed: expected -1, got ${gtTrueResult}`);
        }
        
        const gtFalseResult = instance.exports.test_i64x2_gt_s_false();
        log(`i64x2.gt_s false test: got ${gtFalseResult}, expected 0`);
        if (gtFalseResult !== 0) {
            throw new Error(`i64x2.gt_s false test failed: expected 0, got ${gtFalseResult}`);
        }
        
        // Test i64x2.le_s
        const leTrueLtResult = instance.exports.test_i64x2_le_s_true_lt();
        log(`i64x2.le_s true (lt) test: got ${leTrueLtResult}, expected -1`);
        if (leTrueLtResult !== -1) {
            throw new Error(`i64x2.le_s true (lt) test failed: expected -1, got ${leTrueLtResult}`);
        }
        
        const leTrueEqResult = instance.exports.test_i64x2_le_s_true_eq();
        log(`i64x2.le_s true (eq) test: got ${leTrueEqResult}, expected -1`);
        if (leTrueEqResult !== -1) {
            throw new Error(`i64x2.le_s true (eq) test failed: expected -1, got ${leTrueEqResult}`);
        }
        
        const leFalseResult = instance.exports.test_i64x2_le_s_false();
        log(`i64x2.le_s false test: got ${leFalseResult}, expected 0`);
        if (leFalseResult !== 0) {
            throw new Error(`i64x2.le_s false test failed: expected 0, got ${leFalseResult}`);
        }
        
        // Test i64x2.ge_s
        const geTrueGtResult = instance.exports.test_i64x2_ge_s_true_gt();
        log(`i64x2.ge_s true (gt) test: got ${geTrueGtResult}, expected -1`);
        if (geTrueGtResult !== -1) {
            throw new Error(`i64x2.ge_s true (gt) test failed: expected -1, got ${geTrueGtResult}`);
        }
        
        const geTrueEqResult = instance.exports.test_i64x2_ge_s_true_eq();
        log(`i64x2.ge_s true (eq) test: got ${geTrueEqResult}, expected -1`);
        if (geTrueEqResult !== -1) {
            throw new Error(`i64x2.ge_s true (eq) test failed: expected -1, got ${geTrueEqResult}`);
        }
        
        const geFalseResult = instance.exports.test_i64x2_ge_s_false();
        log(`i64x2.ge_s false test: got ${geFalseResult}, expected 0`);
        if (geFalseResult !== 0) {
            throw new Error(`i64x2.ge_s false test failed: expected 0, got ${geFalseResult}`);
        }
        
        // Test with negative numbers
        const signedResult = instance.exports.test_i64x2_signed_comparison();
        log(`i64x2 signed comparison test: got ${signedResult}, expected -1n`);
        if (signedResult !== -1n) {
            throw new Error(`i64x2 signed comparison test failed: expected -1n, got ${signedResult}`);
        }
        
        log('All SIMD i64x2 comparison tests passed!');
        return true;
    } catch (error) {
        console.error('Error during SIMD i64x2 comparison test:', error);
        return false;
    }
} // Generated by 🤖

export default testSIMDI64x2Compare;
