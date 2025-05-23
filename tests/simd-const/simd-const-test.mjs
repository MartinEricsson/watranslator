import { readTestData, logger } from '../test-utils.mjs';

async function testSIMDConst(debug = false) {
    const log = logger(debug);
    log('Running SIMD v128.const test...');

    try {
        const { wasmBuffer } = await readTestData('simd-const/simd-const.wat', debug);
        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
        const { 
            v128_const, v128_const_mixed, v128_const_i16x8, v128_const_i32x4,
            v128_const_i64x2, v128_const_f32x4, v128_const_f64x2, v128_const_i64x2_signed_bit,
            v128_const_i64x2_max, v128_const_i64x2_min, v128_const_i64x2_alternating,
            v128_const_i64x2_32bit_boundary
        } = instance.exports; // Generated by 🤖

        // Test v128.const with all lanes set to 1
        const result1 = v128_const();
        log(`v128.const test with all 1s: ${result1 === 1 ? 'PASSED' : 'FAILED'}`);
        if (result1 !== 1) {
            throw new Error(`v128.const failed: expected 1, got ${result1}`);
        }

        // Test v128.const with mixed values (0-15)
        const result2 = v128_const_mixed();
        log(`v128.const test with mixed values: ${result2 === 4 ? 'PASSED' : 'FAILED'}`);
        if (result2 !== 4) {
            throw new Error(`v128.const mixed failed: expected 4, got ${result2}`);
        }

        // Test v128.const with i16x8 format
        const result3 = v128_const_i16x8();
        log(`v128.const i16x8 test: ${result3 === 3 ? 'PASSED' : 'FAILED'}`);
        if (result3 !== 3) {
            throw new Error(`v128.const i16x8 failed: expected 3, got ${result3}`);
        }

        // Test v128.const with i32x4 format
        const result4 = v128_const_i32x4();
        log(`v128.const i32x4 test: ${result4 === 20 ? 'PASSED' : 'FAILED'}`);
        if (result4 !== 20) {
            throw new Error(`v128.const i32x4 failed: expected 20, got ${result4}`);
        }

        // Test v128.const with i64x2 format
        const result5 = v128_const_i64x2();
        log(`v128.const i64x2 test: ${result5 === 200n ? 'PASSED' : 'FAILED'}`);
        if (result5 !== 200n) {
            throw new Error(`v128.const i64x2 failed: expected 200n, got ${result5}`);
        }

        // Test v128.const with i64x2 format signed bit
        const resultSigned = v128_const_i64x2_signed_bit();
        const minInt64 = BigInt('-9223372036854775808'); // 0x8000000000000000
        log(`v128.const i64x2 signed bit test: ${resultSigned === minInt64 ? 'PASSED' : 'FAILED'}`);
        if (resultSigned !== minInt64) {
            throw new Error(`v128.const i64x2 signed bit failed: expected ${minInt64}, got ${resultSigned}`);
        } // Generated by 🤖

        // Test v128.const with i64x2 maximum value
        const maxInt64 = BigInt('0x7FFFFFFFFFFFFFFF');
        const resultMax = v128_const_i64x2_max();
        log(`v128.const i64x2 max value test: ${resultMax === maxInt64 ? 'PASSED' : 'FAILED'}`);
        if (resultMax !== maxInt64) {
            throw new Error(`v128.const i64x2 max value failed: expected ${maxInt64}, got ${resultMax}`);
        }

        // Test v128.const with i64x2 minimum value
        const resultMin = v128_const_i64x2_min();
        log(`v128.const i64x2 min value test: ${resultMin === minInt64 ? 'PASSED' : 'FAILED'}`);
        if (resultMin !== minInt64) {
            throw new Error(`v128.const i64x2 min value failed: expected ${minInt64}, got ${resultMin}`);
        }

        // Test v128.const with alternating bit pattern
        // In two's complement, 0xAAAAAAAAAAAAAAAA is interpreted as a negative number
        const alternatingPattern = BigInt('-6148914691236517206'); // 0xAAAAAAAAAAAAAAAA as signed
        const resultAlt = v128_const_i64x2_alternating();
        log(`v128.const i64x2 alternating pattern test: ${resultAlt === alternatingPattern ? 'PASSED' : 'FAILED'}`);
        if (resultAlt !== alternatingPattern) {
            throw new Error(`v128.const i64x2 alternating pattern failed: expected ${alternatingPattern}, got ${resultAlt}`);
        } // Generated by 🤖

        // Test v128.const with 32-bit boundary value
        const boundary32Bit = BigInt('0xFFFFFFFF');
        const resultBoundary = v128_const_i64x2_32bit_boundary();
        log(`v128.const i64x2 32-bit boundary test: ${resultBoundary === boundary32Bit ? 'PASSED' : 'FAILED'}`);
        if (resultBoundary !== boundary32Bit) {
            throw new Error(`v128.const i64x2 32-bit boundary failed: expected ${boundary32Bit}, got ${resultBoundary}`);
        } // Generated by 🤖

        // Test v128.const with f32x4 format
        const result6 = v128_const_f32x4();
        log(`v128.const f32x4 test: ${result6 === 3.0 ? 'PASSED' : 'FAILED'}`);
        if (result6 !== 3.0) {
            throw new Error(`v128.const f32x4 failed: expected 3.0, got ${result6}`);
        }

        // Test v128.const with f64x2 format
        const result7 = v128_const_f64x2();
        log(`v128.const f64x2 test: ${result7 === 2.5 ? 'PASSED' : 'FAILED'}`);
        if (result7 !== 2.5) {
            throw new Error(`v128.const f64x2 failed: expected 2.5, got ${result7}`);
        }

        log('All SIMD v128.const tests passed!'); // Generated by 🤖
        // Generated by 🤖
        return true;
    } catch (error) {
        console.error('Error during SIMD v128.const test:', error);
        return false;
    }
}

export default testSIMDConst;
