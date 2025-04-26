import assert from 'assert';
import { readTestData } from '../test-utils.mjs';

async function testMemoryFill(debug = false) {
  try {
    const { wasmBuffer, ast } = await readTestData('memory-fill/memory-fill.wat', debug);
    
    if (debug) {
      console.log('AST created:');
      console.log(JSON.stringify(ast, null, 2));
    }
    
    // Instantiate the WebAssembly module to test it
    if (debug) console.log('Instantiating WebAssembly module...');
    const wasmModule = await WebAssembly.instantiate(wasmBuffer);
    const instance = wasmModule.instance;
    
    // Get exported functions and memory
    const { fill, readByte, memory, copy, init } = instance.exports;
    
    // Create a view into the memory
    const memoryView = new Uint8Array(memory.buffer);
    
    // First, verify initial data is correct (bytes 0-9 should be 1-10)
    if (debug) console.log('\nVerifying initial memory contents:');
    for (let i = 0; i < 10; i++) {
      const expected = i + 1;
      const actual = memoryView[i];
      assert.strictEqual(actual, expected, `Initial byte at offset ${i} should be ${expected}`);
      if (debug) console.log(`Initial byte at offset ${i}: ${actual} ✓`);
    }
    console.log('✅ Initial memory contents are correct');
    
    // Test 1: Fill 5 bytes from position 2 with value 0xFF
    if (debug) console.log('\nRunning memory.fill(2, 0xFF, 5)...');
    fill(2, 0xFF, 5);
    
    // Verify the memory was filled correctly
    // Bytes 0-1 should be unchanged (1, 2)
    // Bytes 2-6 should be 0xFF
    // Bytes 7-9 should be unchanged (8, 9, 10)
    if (debug) console.log('Verifying memory after fill operation:');
    
    const expectedAfterFill = [1, 2, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 8, 9, 10];
    for (let i = 0; i < 10; i++) {
      const expected = expectedAfterFill[i];
      const actual = memoryView[i];
      assert.strictEqual(actual, expected, `Byte at offset ${i} after fill should be ${expected.toString(16)}`);
      if (debug) console.log(`Byte at offset ${i} after fill: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.fill correctly filled the specified region');
    
    // Test 2: Fill with 0 (clear a region) starting at position 5 for 3 bytes
    if (debug) console.log('\nRunning memory.fill(5, 0, 3)...');
    fill(5, 0, 3);
    
    // Verify the memory was cleared correctly
    // Bytes 0-1 should be unchanged (1, 2)
    // Bytes 2-4 should be 0xFF
    // Bytes 5-7 should be 0x00
    // Bytes 8-9 should be unchanged (9, 10)
    if (debug) console.log('Verifying memory after second fill operation:');
    
    const expectedAfterClear = [1, 2, 0xFF, 0xFF, 0xFF, 0, 0, 0, 9, 10];
    for (let i = 0; i < 10; i++) {
      const expected = expectedAfterClear[i];
      const actual = memoryView[i];
      assert.strictEqual(actual, expected, `Byte at offset ${i} after clear should be ${expected.toString(16)}`);
      if (debug) console.log(`Byte at offset ${i} after clear: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.fill correctly cleared the specified region');
    
    // Test 3: Check that we can use the exported readByte function
    if (debug) console.log('\nTesting through exported readByte function:');
    assert.strictEqual(readByte(0), 1, 'readByte(0) should return 1');
    assert.strictEqual(readByte(2), 0xFF, 'readByte(2) should return 0xFF');
    assert.strictEqual(readByte(5), 0, 'readByte(5) should return 0');
    console.log('✅ readByte function correctly reads memory');
    
    // Test filling a large segment (to ensure it handles larger sizes)
    const LARGE_FILL_SIZE = 1000;
    const LARGE_FILL_VALUE = 0xAA;
    const LARGE_FILL_OFFSET = 100;
    
    if (debug) console.log(`\nRunning memory.fill(${LARGE_FILL_OFFSET}, 0x${LARGE_FILL_VALUE.toString(16)}, ${LARGE_FILL_SIZE})...`);
    fill(LARGE_FILL_OFFSET, LARGE_FILL_VALUE, LARGE_FILL_SIZE);
    
    // Check a few positions to verify the large fill
    if (debug) console.log('Verifying large memory fill:');
    for (let i = 0; i < 5; i++) {
      const offset = LARGE_FILL_OFFSET + i * 200;
      if (offset < LARGE_FILL_OFFSET + LARGE_FILL_SIZE) {
        assert.strictEqual(memoryView[offset], LARGE_FILL_VALUE, 
          `Byte at offset ${offset} should be ${LARGE_FILL_VALUE.toString(16)}`);
        if (debug) console.log(`Byte at offset ${offset}: 0x${memoryView[offset].toString(16).padStart(2, '0')} ✓`);
      }
    }
    console.log('✅ memory.fill correctly handled a large fill operation');
    
    // Test memory.copy functionality
    if (debug) console.log('\nTesting memory.copy functionality:');
    
    // Reset a portion of memory to known values for copy test
    fill(50, 10, 5); // Fill positions 50-54 with values 10
    fill(51, 20, 1); // Set position 51 to 20
    fill(52, 30, 1); // Set position 52 to 30
    fill(53, 40, 1); // Set position 53 to 40
    fill(54, 50, 1); // Set position 54 to 50
    
    // Verify the source region before copy
    if (debug) console.log('Source region before copy:');
    for (let i = 0; i < 5; i++) {
      const actual = readByte(50 + i);
      if (debug) console.log(`Byte at offset ${50 + i}: 0x${actual.toString(16).padStart(2, '0')}`);
    }
    
    // Test 1: Copy bytes from position 50-54 to position 20
    if (debug) console.log('\nRunning memory.copy(20, 50, 5)...');
    copy(20, 50, 5);
    
    // Verify the destination region after copy
    if (debug) console.log('Destination region after copy:');
    for (let i = 0; i < 5; i++) {
      const expected = readByte(50 + i);
      const actual = readByte(20 + i);
      assert.strictEqual(actual, expected, `Byte at offset ${20 + i} after copy should be ${expected.toString(16)}`);
      if (debug) console.log(`Byte at offset ${20 + i} after copy: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.copy correctly copied non-overlapping regions');
    
    // Test 2: Test overlapping copies (copy upward)
    // First, set up a sequence of bytes
    for (let i = 0; i < 10; i++) {
      fill(100 + i, i + 1, 1); // Fill positions 100-109 with values 1-10
    }
    
    // Copy with overlapping regions (copy upward)
    if (debug) console.log('\nTesting overlapping memory.copy (upward)...');
    copy(103, 100, 5); // Copy from 100-104 to 103-107
    
    // Verify the result - should correctly handle overlapping regions
    const expectedUpward = [1, 2, 3, 1, 2, 3, 4, 5, 9, 10]; // Values at positions 100-109
    if (debug) console.log('Memory after overlapping copy (upward):');
    for (let i = 0; i < 10; i++) {
      const actual = readByte(100 + i);
      assert.strictEqual(actual, expectedUpward[i], 
        `Byte at offset ${100 + i} after overlapping copy should be ${expectedUpward[i]}`);
      if (debug) console.log(`Byte at offset ${100 + i}: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.copy correctly handled overlapping regions (upward)');
    
    // Test 3: Test overlapping copies (copy downward)
    // Reset the sequence
    for (let i = 0; i < 10; i++) {
      fill(200 + i, i + 1, 1); // Fill positions 200-209 with values 1-10
    }
    
    // Copy with overlapping regions (copy downward)
    if (debug) console.log('\nTesting overlapping memory.copy (downward)...');
    copy(200, 203, 5); // Copy from 203-207 to 200-204
    
    // Verify the result - should correctly handle overlapping regions
    const expectedDownward = [4, 5, 6, 7, 8, 6, 7, 8, 9, 10]; // Values at positions 200-209
    if (debug) console.log('Memory after overlapping copy (downward):');
    for (let i = 0; i < 10; i++) {
      const actual = readByte(200 + i);
      assert.strictEqual(actual, expectedDownward[i], 
        `Byte at offset ${200 + i} after overlapping copy should be ${expectedDownward[i]}`);
      if (debug) console.log(`Byte at offset ${200 + i}: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.copy correctly handled overlapping regions (downward)');
    
    // Test memory.init functionality
    if (debug) console.log('\nTesting memory.init functionality:');
    
    // Clear destination region for init test
    fill(300, 0, 10); 
    
    // Test 1: Initialize a region with data from the passive segment
    if (debug) console.log('\nRunning memory.init(300, 0, 5)...');
    init(300, 0, 5); // Copy first 5 bytes from passive segment to position 300-304
    
    // Expected values from passive data segment (first 5 bytes: 0xAA, 0xBB, 0xCC, 0xDD, 0xEE)
    const expectedAfterInit = [0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0, 0, 0, 0, 0];
    
    // Verify the memory was initialized correctly
    if (debug) console.log('Verifying memory after init operation:');
    for (let i = 0; i < 10; i++) {
      const expected = expectedAfterInit[i];
      const actual = memoryView[300 + i];
      assert.strictEqual(actual, expected, 
        `Byte at offset ${300 + i} after init should be ${expected.toString(16)}`);
      if (debug) console.log(`Byte at offset ${300 + i} after init: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.init correctly initialized memory from passive data segment');
    
    // Test 2: Initialize a region from the middle of the passive segment
    if (debug) console.log('\nRunning memory.init(310, 5, 5)...');
    init(310, 5, 5); // Copy 5 bytes from offset 5 in the passive segment to position 310-314
    
    // Expected values from passive data segment (bytes 5-9: 0xFF, 0x11, 0x22, 0x33, 0x44)
    const expectedAfterPartialInit = [0xFF, 0x11, 0x22, 0x33, 0x44];
    
    // Verify the memory was initialized correctly
    if (debug) console.log('Verifying memory after partial init operation:');
    for (let i = 0; i < 5; i++) {
      const expected = expectedAfterPartialInit[i];
      const actual = memoryView[310 + i];
      assert.strictEqual(actual, expected, 
        `Byte at offset ${310 + i} after partial init should be ${expected.toString(16)}`);
      if (debug) console.log(`Byte at offset ${310 + i} after partial init: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.init correctly initialized memory from offset in passive data segment');
    
    console.log('\nAll memory.fill, memory.copy, and memory.init tests passed successfully! ✓');

    return true;
  } catch (error) {
    console.error('❌ Error during memory tests:', error);
    console.error(error.stack);
    return false;
  }
}

export default testMemoryFill;