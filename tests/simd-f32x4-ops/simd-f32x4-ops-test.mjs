// Generated by 🤖
import { readTestData, logger } from '../test-utils.mjs';

async function testSIMDf32x4Ops(debug = false) {
  const log = logger(debug);
  try {
    const { wasmBuffer } = await readTestData('simd-f32x4-ops/simd-f32x4-ops.wat', debug);
    log('SIMD f32x4 operations test WAT file loaded successfully');
    
    const { instance } = await WebAssembly.instantiate(wasmBuffer);
    log('SIMD f32x4 operations test WASM module instantiated successfully');
    
    const tests = [
      // Rounding operations
      { name: "f32x4.ceil", fn: "f32x4_ceil_test", expected: 1.0, allowError: 0.0001 },
      { name: "f32x4.floor", fn: "f32x4_floor_test", expected: 18.0, allowError: 0.0001 },
      { name: "f32x4.trunc", fn: "f32x4_trunc_test", expected: 18.0, allowError: 0.0001 },
      { name: "f32x4.nearest", fn: "f32x4_nearest_test", expected: 18.0, allowError: 0.0001 },
      
      // Unary operations
      { name: "f32x4.abs", fn: "f32x4_abs_test", expected: 1.0, allowError: 0.0001 },
      { name: "f32x4.neg", fn: "f32x4_neg_test", expected: -1.0, allowError: 0.0001 },
      { name: "f32x4.sqrt", fn: "f32x4_sqrt_test", expected: 1.0, allowError: 0.0001 },
      
      // Binary operations
      { name: "f32x4.add", fn: "f32x4_add_test", expected: 6.0, allowError: 0.0001 },
      { name: "f32x4.sub", fn: "f32x4_sub_test", expected: 4.0, allowError: 0.0001 },
      { name: "f32x4.mul", fn: "f32x4_mul_test", expected: 5.0, allowError: 0.0001 },
      { name: "f32x4.div", fn: "f32x4_div_test", expected: 5.0, allowError: 0.0001 },
      
      // Min/max operations
      { name: "f32x4.min", fn: "f32x4_min_test", expected: -1.0, allowError: 0.0001 },
      { name: "f32x4.max", fn: "f32x4_max_test", expected: 1.0, allowError: 0.0001 },
      { name: "f32x4.pmin", fn: "f32x4_pmin_test", expected: -1.0, allowError: 0.0001 },
      { name: "f32x4.pmax", fn: "f32x4_pmax_test", expected: 1.0, allowError: 0.0001 }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
      const result = instance.exports[test.fn]();
      const isClose = Math.abs(result - test.expected) <= test.allowError;
      
      log(`${test.name} test: expected ${test.expected}, got ${result}`);
      
      if (isClose) {
        log(`✅ ${test.name} test passed!`);
        passed++;
      } else {
        log(`❌ ${test.name} test failed! Expected: ${test.expected}, Got: ${result}`);
        failed++;
        throw new Error(`${test.name} test failed! Expected: ${test.expected}, Got: ${result}`);
      }
    }
    
    log(`Tests completed: ${passed} passed, ${failed} failed`);
    return failed === 0;
  } catch (error) {
    log(`Error in SIMD f32x4 operations test: ${error.message}`, "ERROR");
    return false;
  }
}

export default testSIMDf32x4Ops;
