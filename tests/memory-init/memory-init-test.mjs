import assert from 'assert';
import { readTestData } from '../test-utils.mjs';

async function testMemoryInit(debug = false) {
  try {
    const { wasmBuffer, ast } = await readTestData('memory-init/memory-init.wat', debug);
    
    if (debug) {
      console.log('AST created:');
      console.log(JSON.stringify(ast, null, 2));
    }
    
    // Instantiate the WebAssembly module to test it
    if (debug) console.log('Instantiating WebAssembly module...');
    const wasmModule = await WebAssembly.instantiate(wasmBuffer);
    const instance = wasmModule.instance;
    
    // Get exported functions and memory
    const { init, readByte, dropSegment, memory } = instance.exports;
    
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
    console.log('✅ Initial memory contents are correct (active segment initialized properly)');
    
    // Test 1: Initialize a region with data from the passive segment
    if (debug) console.log('\nRunning memory.init(100, 0, 5)...');
    init(100, 0, 5); // Copy first 5 bytes from passive segment to position 100-104
    
    // Expected values from passive data segment (first 5 bytes: 0xAA, 0xBB, 0xCC, 0xDD, 0xEE)
    const expectedAfterInit = [0xAA, 0xBB, 0xCC, 0xDD, 0xEE];
    
    // Verify the memory was initialized correctly
    if (debug) console.log('Verifying memory after init operation:');
    for (let i = 0; i < 5; i++) {
      const expected = expectedAfterInit[i];
      const actual = memoryView[100 + i];
      assert.strictEqual(actual, expected, 
        `Byte at offset ${100 + i} after init should be ${expected.toString(16)}`);
      if (debug) console.log(`Byte at offset ${100 + i} after init: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.init correctly initialized memory from passive data segment');
    
    // Test 2: Initialize a region from the middle of the passive segment
    if (debug) console.log('\nRunning memory.init(200, 5, 5)...');
    init(200, 5, 5); // Copy 5 bytes from offset 5 in the passive segment to position 200-204
    
    // Expected values from passive data segment (bytes 5-9: 0xFF, 0x11, 0x22, 0x33, 0x44)
    const expectedAfterPartialInit = [0xFF, 0x11, 0x22, 0x33, 0x44];
    
    // Verify the memory was initialized correctly
    if (debug) console.log('Verifying memory after partial init operation:');
    for (let i = 0; i < 5; i++) {
      const expected = expectedAfterPartialInit[i];
      const actual = memoryView[200 + i];
      assert.strictEqual(actual, expected, 
        `Byte at offset ${200 + i} after partial init should be ${expected.toString(16)}`);
      if (debug) console.log(`Byte at offset ${200 + i} after partial init: 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ memory.init correctly initialized memory from offset in passive data segment');
    
    // Test 3: Read the values using the exported readByte function
    if (debug) console.log('\nReading bytes using exported readByte function:');
    for (let i = 0; i < 5; i++) {
      const expected = expectedAfterInit[i];
      const actual = readByte(100 + i);
      assert.strictEqual(actual, expected, 
        `readByte(${100 + i}) should return ${expected.toString(16)}`);
      if (debug) console.log(`readByte(${100 + i}): 0x${actual.toString(16).padStart(2, '0')} ✓`);
    }
    console.log('✅ readByte function correctly reads memory after initialization');
    
    // Test 4: Try data.drop functionality
    if (debug) console.log('\nDropping data segment with data.drop...');
    dropSegment();
    console.log('✅ data.drop executed successfully');
    
    // Note: After dropping a segment, using it with memory.init would trap at runtime
    // We don't test the trap case here since it would abort the program
    
    console.log('\nAll memory.init tests passed successfully! ✓');
    return true;
  } catch (error) {
    console.error('❌ Error during memory initialization tests:', error);
    console.error(error.stack);
    return false;
  }
}

export default testMemoryInit;