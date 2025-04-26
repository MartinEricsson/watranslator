import { readTestData } from '../test-utils.mjs';

async function testF32Store(debug = false) {
  try {
    // Read the WAT file
    const {wasmBuffer} = await readTestData('f32-ops/f32-store-test.wat', debug);

    // Instantiate the WebAssembly module
    const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
    
    // Get the memory
    const memory = instance.exports.memory;
    
    console.log('\nTesting f32.store:');
    
    // Test cases for store operations
    const testCases = [
      { addr: 0, value: 1.5 },
      { addr: 4, value: -2.25 },
      { addr: 8, value: 3.14159 },
      { addr: 12, value: 0.0 }
    ];
    
    let results = [];
    
    // Test direct store and load operations
    for (const test of testCases) {
      // Use the store function to write a value to memory
      instance.exports.store_float(test.addr, test.value);
      
      // Read it back using the load function
      const result = instance.exports.load_float(test.addr);
      
      // Compare with a small epsilon for floating point comparison
      const equalityResult = Math.abs(result - test.value) < 0.00001;
      results.push(equalityResult);
      
      console.log(`Store/Load at address ${test.addr}: stored ${test.value}, loaded ${result} - ${equalityResult ? '✅' : '❌'}`);
    }
    
    // Test combined store and load function
    for (const test of testCases) {
      // Use the store_and_load function that combines both operations
      const result = instance.exports.store_and_load(test.addr, test.value);
      
      // Compare with a small epsilon for floating point comparison
      const equalityResult = Math.abs(result - test.value) < 0.00001;
      results.push(equalityResult);
      
      console.log(`store_and_load at address ${test.addr}: value ${test.value}, result ${result} - ${equalityResult ? '✅' : '❌'}`);
    }
    
    // Test that we can read the raw memory buffer and get the expected bit patterns
    console.log('\nVerifying memory contents through raw buffer:');
    
    // Create a Float32Array view of the memory
    const floatView = new Float32Array(memory.buffer);
    
    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];
      const addr = test.addr / 4; // Convert byte address to float index
      const memValue = floatView[addr];
      
      // Compare with a small epsilon for floating point comparison
      const equalityResult = Math.abs(memValue - test.value) < 0.00001;
      results.push(equalityResult);
      
      console.log(`Raw memory at float index ${addr}: expected ${test.value}, found ${memValue} - ${equalityResult ? '✅' : '❌'}`);
    }
    
    const allTestsPassed = results.every(result => result);
    if (allTestsPassed) {
      console.log("\n✅ All f32.store tests passed!");
      return true;
    } else {
      console.error("\n❌ Some f32.store tests failed.");
      return false;
    }
  } catch (error) {
    console.error('Error during f32.store test:', error);
    return false;
  }
}

export default testF32Store;