import { readTestData } from '../test-utils.mjs';
import assert from 'assert';

async function testBitManipulation(debug = false) {
  try {
    const { wasmBuffer } = await readTestData('bit-manipulation/bit-manipulation.wat', debug);

    // Import the compiled WASM module
    const wasmModule = await WebAssembly.instantiate(wasmBuffer);
    const { and, or, xor, shl, shr_s, shr_u, rotl, rotr } = wasmModule.instance.exports;

    console.log('Testing bit manipulation operations...');

    // Test i32.and
    console.log('Testing i32.and:');
    assert.strictEqual(and(0, 0), 0);
    assert.strictEqual(and(0, 1), 0);
    assert.strictEqual(and(1, 0), 0);
    assert.strictEqual(and(1, 1), 1);
    assert.strictEqual(and(0b1100, 0b1010), 0b1000);
    assert.strictEqual(and(0xFFFF, 0xFF00), 0xFF00);
    console.log('✅ i32.and tests passed!');

    // Test i32.or
    console.log('Testing i32.or:');
    assert.strictEqual(or(0, 0), 0);
    assert.strictEqual(or(0, 1), 1);
    assert.strictEqual(or(1, 0), 1);
    assert.strictEqual(or(1, 1), 1);
    assert.strictEqual(or(0b1100, 0b1010), 0b1110);
    assert.strictEqual(or(0xF000, 0x0F00), 0xFF00);
    console.log('✅ i32.or tests passed!');

    // Test i32.xor
    console.log('Testing i32.xor:');
    assert.strictEqual(xor(0, 0), 0);
    assert.strictEqual(xor(0, 1), 1);
    assert.strictEqual(xor(1, 0), 1);
    assert.strictEqual(xor(1, 1), 0);
    assert.strictEqual(xor(0b1100, 0b1010), 0b0110);
    assert.strictEqual(xor(0xFF00, 0xF0F0), 0x0FF0);
    console.log('✅ i32.xor tests passed!');

    // Test i32.shl (shift left)
    console.log('Testing i32.shl:');
    assert.strictEqual(shl(1, 0), 1);
    assert.strictEqual(shl(1, 1), 2);
    assert.strictEqual(shl(1, 2), 4);
    assert.strictEqual(shl(1, 3), 8);
    assert.strictEqual(shl(1, 4), 16);
    assert.strictEqual(shl(0b1010, 1), 0b10100);
    assert.strictEqual(shl(0b1, 31), -2147483648); // Highest bit set (sign bit)
    console.log('✅ i32.shl tests passed!');

    // Test i32.shr_s (arithmetic shift right - signed)
    console.log('Testing i32.shr_s:');
    assert.strictEqual(shr_s(16, 2), 4);
    assert.strictEqual(shr_s(16, 4), 1);
    assert.strictEqual(shr_s(-16, 2), -4); // Sign is preserved
    assert.strictEqual(shr_s(-16, 4), -1);
    assert.strictEqual(shr_s(-2147483648, 31), -1); // Shifting sign bit preserves sign
    console.log('✅ i32.shr_s tests passed!');

    // Test i32.shr_u (logical shift right - unsigned)
    console.log('Testing i32.shr_u:');
    assert.strictEqual(shr_u(16, 2), 4);
    assert.strictEqual(shr_u(16, 4), 1);
    assert.strictEqual(shr_u(-16, 1), 2147483640); // Treats value as unsigned
    assert.strictEqual(shr_u(-2147483648, 31), 1); // Highest bit becomes 1, rest 0
    console.log('✅ i32.shr_u tests passed!');

    // Test i32.rotl
    console.log('Testing i32.rotl:');
    assert.strictEqual(rotl(0b1, 1), 0b10);
    assert.strictEqual(rotl(0b1, 31), -2147483648);  // Highest bit set (0x80000000)
    assert.strictEqual(rotl(0b1, 32), 0b1);   // Full rotation
    assert.strictEqual(rotl(0xF0000000, 4), 0x0000000F);
    console.log('✅ i32.rotl tests passed!');

    // Test i32.rotr
    console.log('Testing i32.rotr:');
    assert.strictEqual(rotr(0b10, 1), 0b1);
    assert.strictEqual(rotr(0b10, 31), 4);  // Full rotation minus 1
    assert.strictEqual(rotr(0b1, 32), 0b1);   // Full rotation
    assert.strictEqual(rotr(0x0000000F, 4), -268435456);
    console.log('✅ i32.rotr tests passed!');

    console.log('✅ All bit manipulation tests passed successfully!');

    return true;
  } catch (error) {
    console.error('❌ Error during bit manipulation tests:', error);
    return false;
  }
}

export default testBitManipulation;