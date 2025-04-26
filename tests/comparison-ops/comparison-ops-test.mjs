import assert from 'assert';

import { readTestData } from '../test-utils.mjs';

async function testComparisonOps(debug = false) {
  try {
    console.log('Starting comparison operations test...');
    const { wasmBuffer } = await readTestData('comparison-ops/comparison-ops.wat', debug);

    // Import the compiled WASM module
    const wasmModule = await WebAssembly.instantiate(wasmBuffer);
    const { eq, ne, ge_s, ge_u, lt_u, gt_u, le_u, eqz } = wasmModule.instance.exports;

    console.log('Testing comparison operations...');

    // Test i32.eq (equal)
    console.log('Testing i32.eq:');
    assert.strictEqual(eq(0, 0), 1);       // 0 === 0 -> true (1)
    assert.strictEqual(eq(1, 1), 1);       // 1 === 1 -> true (1)
    assert.strictEqual(eq(0, 1), 0);       // 0 === 1 -> false (0)
    assert.strictEqual(eq(-1, -1), 1);     // -1 === -1 -> true (1)
    assert.strictEqual(eq(0x7FFFFFFF, 0x7FFFFFFF), 1); // MAX_INT === MAX_INT -> true (1)
    console.log('✅ i32.eq tests passed!');

    // Test i32.ne (not equal)
    console.log('Testing i32.ne:');
    assert.strictEqual(ne(0, 0), 0);       // 0 !== 0 -> false (0)
    assert.strictEqual(ne(1, 1), 0);       // 1 !== 1 -> false (0)
    assert.strictEqual(ne(0, 1), 1);       // 0 !== 1 -> true (1)
    assert.strictEqual(ne(-1, -1), 0);     // -1 !== -1 -> false (0)
    assert.strictEqual(ne(0x7FFFFFFF, 0x7FFFFFFE), 1); // MAX_INT !== MAX_INT-1 -> true (1)
    console.log('✅ i32.ne tests passed!');

    // Test i32.ge_s (signed greater than or equal)
    console.log('Testing i32.ge_s:');
    assert.strictEqual(ge_s(1, 0), 1);     // 1 >= 0 -> true (1)
    assert.strictEqual(ge_s(0, 0), 1);     // 0 >= 0 -> true (1)
    assert.strictEqual(ge_s(0, 1), 0);     // 0 >= 1 -> false (0)
    assert.strictEqual(ge_s(-1, -2), 1);   // -1 >= -2 -> true (1)
    assert.strictEqual(ge_s(-2, -1), 0);   // -2 >= -1 -> false (0)
    assert.strictEqual(ge_s(-1, 0), 0);    // -1 >= 0 -> false (0)
    console.log('✅ i32.ge_s tests passed!');

    // Test i32.ge_u (unsigned greater than or equal)
    console.log('Testing i32.ge_u:');
    assert.strictEqual(ge_u(1, 0), 1);     // 1 >= 0 -> true (1)
    assert.strictEqual(ge_u(0, 0), 1);     // 0 >= 0 -> true (1)
    assert.strictEqual(ge_u(0, 1), 0);     // 0 >= 1 -> false (0)
    // -1 is 0xFFFFFFFF in two's complement, largest unsigned 32-bit value
    assert.strictEqual(ge_u(-1, 10), 1);   // 0xFFFFFFFF >= 10 -> true (1) 
    assert.strictEqual(ge_u(10, -1), 0);   // 10 >= 0xFFFFFFFF -> false (0)
    console.log('✅ i32.ge_u tests passed!');

    // Test i32.gt_u (unsigned greater than)
    console.log('Testing i32.gt_u:');
    assert.strictEqual(gt_u(1, 0), 1);     // 1 > 0 -> true (1)
    assert.strictEqual(gt_u(0, 0), 0);     // 0 > 0 -> false (0)
    assert.strictEqual(gt_u(0, 1), 0);     // 0 > 1 -> false (0)
    // -1 is 0xFFFFFFFF in two's complement, largest unsigned 32-bit value
    assert.strictEqual(gt_u(-1, 10), 1);   // 0xFFFFFFFF > 10 -> true (1) 
    assert.strictEqual(gt_u(10, -1), 0);   // 10 > 0xFFFFFFFF -> false (0)
    console.log('✅ i32.gt_u tests passed!');

    // Test i32.lt_u (unsigned less than)
    console.log('Testing i32.lt_u:');
    assert.strictEqual(lt_u(0, 1), 1);     // 0 < 1 -> true (1)
    assert.strictEqual(lt_u(1, 0), 0);     // 1 < 0 -> false (0)
    assert.strictEqual(lt_u(0, 0), 0);     // 0 < 0 -> false (0)
    // -1 is 0xFFFFFFFF in two's complement, largest unsigned 32-bit value
    assert.strictEqual(lt_u(10, -1), 1);   // 10 < 0xFFFFFFFF -> true (1)
    assert.strictEqual(lt_u(-1, 10), 0);   // 0xFFFFFFFF < 10 -> false (0)
    console.log('✅ i32.lt_u tests passed!');

    // Test i32.le_u (unsigned less than or equal)
    console.log('Testing i32.le_u:');
    assert.strictEqual(le_u(0, 1), 1);     // 0 <= 1 -> true (1)
    assert.strictEqual(le_u(1, 1), 1);     // 1 <= 1 -> true (1)
    assert.strictEqual(le_u(1, 0), 0);     // 1 <= 0 -> false (0)
    assert.strictEqual(le_u(0, 0), 1);     // 0 <= 0 -> true (1)
    // -1 is 0xFFFFFFFF in two's complement, largest unsigned 32-bit value
    assert.strictEqual(le_u(10, -1), 1);   // 10 <= 0xFFFFFFFF -> true (1)
    assert.strictEqual(le_u(-1, 10), 0);   // 0xFFFFFFFF <= 10 -> false (0)
    assert.strictEqual(le_u(-1, -1), 1);   // 0xFFFFFFFF <= 0xFFFFFFFF -> true (1)
    console.log('✅ i32.le_u tests passed!');

    console.log('Testing i32.eqz:');
    // Test i32.eqz (equal to zero)
    assert.strictEqual(eqz(0), 1);       // 0 == 0 -> true (1)
    assert.strictEqual(eqz(1), 0);       // 1 == 0 -> false (0)
    assert.strictEqual(eqz(-1), 0);      // -1 == 0 -> false (0)
    assert.strictEqual(eqz(0x7FFFFFFF), 0); // MAX_INT == 0 -> false (0)
    assert.strictEqual(eqz(0x80000000), 0); // MIN_INT == 0 -> false (0)
    console.log('✅ i32.eqz tests passed!');

    console.log('✅ All comparison operation tests passed successfully!');

    return true;
  } catch (error) {
    console.error('❌ Error during comparison operation tests:', error);
    console.error(error.stack);
    return false;
  }
}

// Run the test directly if this file is executed
if (process.argv[1].includes('comparison-ops-test.mjs')) {
  const debug = process.argv.includes('debug');
  testComparisonOps(debug).then(result => {
    console.log(`Test ${result ? 'passed' : 'failed'}`);
    process.exit(result ? 0 : 1);
  });
}

export default testComparisonOps;

// Generated by 🤖