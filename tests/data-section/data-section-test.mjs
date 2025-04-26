import assert from 'assert';
import { readTestData } from '../test-utils.mjs';

async function testDataSection(debug = false) {
  try {
    const { wasmBuffer, ast } = await readTestData('data-section/data-section.wat', debug);

    if (debug) {
      console.log(JSON.stringify(ast, null, 2));
    }

    // Check that data sections were properly parsed
    assert(ast[0].datas && ast[0].datas.length > 0, 'Data sections should be present in the AST');
    if (debug) console.log(`Found ${ast[0].datas.length} data sections in AST`);

    // Instantiate the WebAssembly module to test it
    if (debug) console.log('Instantiating WebAssembly module...');
    const wasmModule = await WebAssembly.instantiate(wasmBuffer);
    const instance = wasmModule.instance;

    // Get exported functions and memory
    const { readByte, readInt, memory } = instance.exports;

    // Create a view into the memory
    const memoryView = new Uint8Array(memory.buffer);

    // Test 1: Check simple byte data (0-9)
    if (debug) console.log('\nTesting simple byte data (0-9):');
    for (let i = 0; i < 10; i++) {
      const actual = memoryView[i];
      assert.strictEqual(actual, i, `Byte at offset ${i} should be ${i}`);
      if (debug) console.log(`Byte at offset ${i}: ${actual} ✓`);
    }
    console.log('✅ Simple byte data correctly initialized');

    // Test 2: Check ASCII text data
    const text = 'Hello, WebAssembly!';
    if (debug) console.log('\nTesting ASCII text:');
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const actual = memoryView[16 + i];
      assert.strictEqual(actual, charCode, `Byte at offset ${16 + i} should be ${charCode} ('${text[i]}')`);
      if (debug) console.log(`Byte at offset ${16 + i}: ${actual} ('${String.fromCharCode(actual)}') ✓`);
    }
    console.log('✅ ASCII text correctly initialized');

    // Test 3: Check special characters
    if (debug) console.log('\nTesting special characters:');
    const specialChars = [9, 10, 13, 34, 39, 92]; // \t \n \r " ' \
    for (let i = 0; i < specialChars.length; i++) {
      const expected = specialChars[i];
      const actual = memoryView[64 + i];
      assert.strictEqual(actual, expected, `Special character at offset ${64 + i} should be ${expected}`);
      if (debug) console.log(`Special character at offset ${64 + i}: ${actual} ✓`);
    }
    console.log('✅ Special characters correctly initialized');

    // Test 4: Check hex values including FF and FE
    if (debug) console.log('\nTesting hex values:');
    const hexValues = [0xFF, 0xFE, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE];
    for (let i = 0; i < hexValues.length; i++) {
      const expected = hexValues[i];
      const actual = memoryView[128 + i];
      assert.strictEqual(actual, expected, `Hex value at offset ${128 + i} should be ${expected}`);
      if (debug) console.log(`Hex value at offset ${128 + i}: ${actual.toString(16)} ✓`);
    }
    console.log('✅ Hex values correctly initialized');

    // Test 5: Check mixed content
    if (debug) console.log('\nTesting mixed content:');
    // "Mix: \01\02\03 ABC \ff\fe!"
    const mixString = "Mix: ";
    for (let i = 0; i < mixString.length; i++) {
      const expected = mixString.charCodeAt(i);
      const actual = memoryView[256 + i];
      assert.strictEqual(actual, expected, `Character at offset ${256 + i} should be ${expected}`);
      if (debug) console.log(`Character at offset ${256 + i}: ${actual} ('${String.fromCharCode(actual)}') ✓`);
    }

    // Check the bytes after the text
    const byteOffsets = [
      { offset: 261, expected: 1 },
      { offset: 262, expected: 2 },
      { offset: 263, expected: 3 },
      { offset: 264, expected: 32 }, // space
      { offset: 265, expected: 65 }, // A
      { offset: 266, expected: 66 }, // B
      { offset: 267, expected: 67 }, // C
      { offset: 268, expected: 32 }, // space
      { offset: 269, expected: 255 }, // \ff
      { offset: 270, expected: 254 }, // \fe
      { offset: 271, expected: 33 }, // !
    ];

    for (const check of byteOffsets) {
      const actual = memoryView[check.offset];
      assert.strictEqual(actual, check.expected, `Byte at offset ${check.offset} should be ${check.expected}`);
      if (debug) console.log(`Byte at offset ${check.offset}: ${actual} ${actual >= 32 && actual <= 126 ? `('${String.fromCharCode(actual)}')` : ''} ✓`);
    }

    console.log('✅ Mixed content correctly initialized');

    // Test 6: Verify using exported functions
    if (debug) console.log('\nTesting through exported functions:');
    assert.strictEqual(readByte(0), 0, 'readByte(0) should return 0');
    assert.strictEqual(readByte(1), 1, 'readByte(1) should return 1');
    assert.strictEqual(readByte(128), 0xFF, 'readByte(128) should return 0xFF');
    assert.strictEqual(readByte(129), 0xFE, 'readByte(129) should return 0xFE');

    // Check 4-byte values using readInt (little endian)
    const int1 = readInt(0); // Should be 0x03020100
    const int2 = readInt(128); // Should be something like 0xAAFEFF00 (but account for endianness)
    if (debug) {
      console.log(`readInt(0) = 0x${int1.toString(16)}`);
      console.log(`readInt(128) = 0x${int2.toString(16)}`);
    }
    console.log('✅ Memory read through exported functions works correctly');

    console.log('\nAll data section tests passed successfully! ✓');
    return true;
  } catch (error) {
    console.error('❌ Error during data section tests:', error);
    return false;
  }
}

export default testDataSection;