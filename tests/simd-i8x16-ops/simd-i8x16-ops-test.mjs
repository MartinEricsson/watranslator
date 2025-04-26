// filepath: /Users/martinericsson/dev/fes-compiler/tests/simd-i8x16-ops/simd-i8x16-ops-test.mjs
import { readTestData, logger } from '../test-utils.mjs';

async function testSIMDi8x16Ops(debug = false) {
    const log = logger(debug);
    try {
        const { wasmBuffer } = await readTestData('simd-i8x16-ops/simd-i8x16-ops.wat', debug);
        log('SIMD i8x16 operations test WAT file loaded successfully');
        
        const { instance } = await WebAssembly.instantiate(wasmBuffer);
        log('SIMD i8x16 operations test WASM module instantiated successfully');
        
        // Test i8x16.abs
        const absResult = instance.exports.test_i8x16_abs();
        log(`test_i8x16_abs: got ${absResult}, expected 5`);
        if (absResult !== 5) {
            throw new Error(`i8x16.abs test failed: expected 5, got ${absResult}`);
        }
        
        // Test i8x16.neg
        const negResult = instance.exports.test_i8x16_neg();
        log(`test_i8x16_neg: got ${negResult}, expected -5`);
        if (negResult !== -5) {
            throw new Error(`i8x16.neg test failed: expected -5, got ${negResult}`);
        }
        
        // Test i8x16.popcnt
        const popcntResult = instance.exports.test_i8x16_popcnt();
        log(`test_i8x16_popcnt: got ${popcntResult}, expected 1`);
        if (popcntResult !== 1) {
            throw new Error(`i8x16.popcnt test failed: expected 1, got ${popcntResult}`);
        }
        
        // Test i8x16.all_true
        const allTrueResult = instance.exports.test_i8x16_all_true();
        log(`test_i8x16_all_true: got ${allTrueResult}, expected 1`);
        if (allTrueResult !== 1) {
            throw new Error(`i8x16.all_true test failed: expected 1, got ${allTrueResult}`);
        }
        
        // Test i8x16.bitmask
        const bitmaskResult = instance.exports.test_i8x16_bitmask();
        log(`test_i8x16_bitmask: got ${bitmaskResult}, expected 5`);
        if (bitmaskResult !== 5) {
            throw new Error(`i8x16.bitmask test failed: expected 5, got ${bitmaskResult}`);
        }
        
        // Test i8x16.narrow_i16x8_s
        const narrowSResult = instance.exports.test_i8x16_narrow_i16x8_s();
        log(`test_i8x16_narrow_i16x8_s: got ${narrowSResult}, expected -128`);
        if (narrowSResult !== -128) {
            throw new Error(`i8x16.narrow_i16x8_s test failed: expected -128, got ${narrowSResult}`);
        }
        
        // Test i8x16.narrow_i16x8_u
        const narrowUResult = instance.exports.test_i8x16_narrow_i16x8_u();
        log(`test_i8x16_narrow_i16x8_u: got ${narrowUResult}, expected 200`);
        if (narrowUResult !== 200) {
            throw new Error(`i8x16.narrow_i16x8_u test failed: expected 200, got ${narrowUResult}`);
        }
        
        // Test i8x16.shl
        const shlResult = instance.exports.test_i8x16_shl();
        log(`test_i8x16_shl: got ${shlResult}, expected 4`);
        if (shlResult !== 4) {
            throw new Error(`i8x16.shl test failed: expected 4, got ${shlResult}`);
        }
        
        // Test i8x16.shr_s
        const shrSResult = instance.exports.test_i8x16_shr_s();
        log(`test_i8x16_shr_s: got ${shrSResult}, expected -64`);
        if (shrSResult !== -64) {
            throw new Error(`i8x16.shr_s test failed: expected -64, got ${shrSResult}`);
        }
        
        // Test i8x16.shr_u
        const shrUResult = instance.exports.test_i8x16_shr_u();
        log(`test_i8x16_shr_u: got ${shrUResult}, expected 64`);
        if (shrUResult !== 64) {
            throw new Error(`i8x16.shr_u test failed: expected 64, got ${shrUResult}`);
        }
        
        // Test i8x16.add
        const addResult = instance.exports.test_i8x16_add();
        log(`test_i8x16_add: got ${addResult}, expected 15`);
        if (addResult !== 15) {
            throw new Error(`i8x16.add test failed: expected 15, got ${addResult}`);
        }
        
        // Test i8x16.add_sat_s
        const addSatSResult = instance.exports.test_i8x16_add_sat_s();
        log(`test_i8x16_add_sat_s: got ${addSatSResult}, expected 127`);
        if (addSatSResult !== 127) {
            throw new Error(`i8x16.add_sat_s test failed: expected 127, got ${addSatSResult}`);
        }
        
        // Test i8x16.add_sat_u
        const addSatUResult = instance.exports.test_i8x16_add_sat_u();
        log(`test_i8x16_add_sat_u: got ${addSatUResult}, expected -1`);
        if (addSatUResult !== -1) {
            throw new Error(`i8x16.add_sat_u test failed: expected -1, got ${addSatUResult}`);
        }
        
        // Test i8x16.sub
        const subResult = instance.exports.test_i8x16_sub();
        log(`test_i8x16_sub: got ${subResult}, expected 15`);
        if (subResult !== 15) {
            throw new Error(`i8x16.sub test failed: expected 15, got ${subResult}`);
        }
        
        // Test i8x16.sub_sat_s
        const subSatSResult = instance.exports.test_i8x16_sub_sat_s();
        log(`test_i8x16_sub_sat_s: got ${subSatSResult}, expected -128`);
        if (subSatSResult !== -128) {
            throw new Error(`i8x16.sub_sat_s test failed: expected -128, got ${subSatSResult}`);
        }
        
        // Test i8x16.sub_sat_u
        const subSatUResult = instance.exports.test_i8x16_sub_sat_u();
        log(`test_i8x16_sub_sat_u: got ${subSatUResult}, expected 0`);
        if (subSatUResult !== 0) {
            throw new Error(`i8x16.sub_sat_u test failed: expected 0, got ${subSatUResult}`);
        }
        
        // Test i8x16.min_s
        const minSResult = instance.exports.test_i8x16_min_s();
        log(`test_i8x16_min_s: got ${minSResult}, expected -10`);
        if (minSResult !== -10) {
            throw new Error(`i8x16.min_s test failed: expected -10, got ${minSResult}`);
        }
        
        // Test i8x16.min_u
        const minUResult = instance.exports.test_i8x16_min_u();
        log(`test_i8x16_min_u: got ${minUResult}, expected 10`);
        if (minUResult !== 10) {
            throw new Error(`i8x16.min_u test failed: expected 10, got ${minUResult}`);
        }
        
        // Test i8x16.max_s
        const maxSResult = instance.exports.test_i8x16_max_s();
        log(`test_i8x16_max_s: got ${maxSResult}, expected 10`);
        if (maxSResult !== 10) {
            throw new Error(`i8x16.max_s test failed: expected 10, got ${maxSResult}`);
        }
        
        // Test i8x16.max_u
        const maxUResult = instance.exports.test_i8x16_max_u();
        log(`test_i8x16_max_u: got ${maxUResult}, expected -10`);
        if (maxUResult !== -10) {
            throw new Error(`i8x16.max_u test failed: expected -10, got ${maxUResult}`);
        }
        
        // Test i8x16.avgr_u
        const avgrUResult = instance.exports.test_i8x16_avgr_u();
        log(`test_i8x16_avgr_u: got ${avgrUResult}, expected 15`);
        if (avgrUResult !== 15) {
            throw new Error(`i8x16.avgr_u test failed: expected 15, got ${avgrUResult}`);
        }
        
        console.log('✅ All SIMD i8x16 operations tests passed!');
        return true;
    } catch (err) {
        console.error('❌ SIMD i8x16 operations test failed:', err);
        return false;
    }
} // Generated by 🤖

export default testSIMDi8x16Ops;
