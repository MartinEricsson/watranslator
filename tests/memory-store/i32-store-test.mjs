import assert from 'assert';
import { readTestData } from '../test-utils.mjs';

// Test that the i32.store instruction works correctly
async function testI32Store(debug = false) {
  try {
    const { wasmBuffer } = await readTestData('memory-store/i32-store-test.wat', debug);

    // Instantiate the WebAssembly module
    const module = await WebAssembly.instantiate(wasmBuffer);
    console.log('WebAssembly module instantiated');

    const instance = module.instance;
    if (debug) console.log('Available exports:', Object.keys(instance.exports));

    // Get the exported functions and memory
    const { store, load, memory } = instance.exports;
    console.log('Functions retrieved:', { store: typeof store, load: typeof load, memory: typeof memory });

    // Make sure memory is accessible
    if (!memory) {
      throw new Error('Memory not exported from module');
    }

    // Test store and load
    const testValue = 0x12345678;
    const address = 0; // Address 0 should be aligned for i32

    // Store a value
    store(address, testValue);
    console.log(`Stored value 0x${testValue.toString(16)} at address ${address}`);

    // Load the stored value
    const loadedValue = load(address);
    console.log(`Loaded value from address ${address}: 0x${loadedValue.toString(16)}`);

    // Verify the loaded value matches what we stored
    assert.strictEqual(loadedValue, testValue, 'Stored and loaded values should match');

    console.log('✓ i32.store test passed!');
    return true;
  } catch (error) {
    console.error('❌ i32.store test failed:', error);
    throw error;
  }
}

export default testI32Store;
