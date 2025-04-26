import { readTestData } from '../test-utils.mjs';

async function testF64Store(debug = false) {
  try {
    // Read the WAT file
    const {wasmBuffer} = await readTestData('f64-math-and-ops/f64-store-test.wat', debug);

    // Instantiate the WebAssembly module
    const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
    
    // Get the memory
    const memory = instance.exports.memory;
    
    console.log('\nTesting f64.store:');
    
    // Test cases for store operations
    const testCases = [
      { addr: 0, value: 1.5 },
      { addr: 8, value: -2.25 },
      { addr: 16, value: 3.14159265359 },
      { addr: 24, value: 0.0 }
    ];
    
    let results = [];
    
    // Test direct store and load operations
    for (const test of testCases) {
      // Use the store function to write a value to memory
      instance.exports.store_f64(test.addr, test.value);
      
      // Read it back using the load function
      const result = instance.exports.load_f64(test.addr);
      
      // Compare with a small epsilon for floating point comparison
      const equalityResult = Math.abs(result - test.value) < 0.00000001;
      results.push(equalityResult);
      
      console.log(`Store/Load at address ${test.addr}: stored ${test.value}, loaded ${result} - ${equalityResult ? '✅' : '❌'}`);
    }
    
    // Test combined store and load function
    for (const test of testCases) {
      // Use the store_and_load function that combines both operations
      const result = instance.exports.store_and_load(test.addr, test.value);
      
      // Compare with a small epsilon for floating point comparison
      const equalityResult = Math.abs(result - test.value) < 0.00000001;
      results.push(equalityResult);
      
      console.log(`store_and_load at address ${test.addr}: value ${test.value}, result ${result} - ${equalityResult ? '✅' : '❌'}`);
    }
    
    // Test that we can read the raw memory buffer and get the expected bit patterns
    console.log('\nVerifying memory contents through raw buffer:');
    
    // Create a Float64Array view of the memory
    const floatView = new Float64Array(memory.buffer);
    
    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];
      const addr = test.addr / 8; // Convert byte address to float index
      const memValue = floatView[addr];
      
      // Compare with a small epsilon for floating point comparison
      const equalityResult = Math.abs(memValue - test.value) < 0.00000001;
      results.push(equalityResult);
      
      console.log(`Raw memory at float index ${addr}: expected ${test.value}, found ${memValue} - ${equalityResult ? '✅' : '❌'}`);
    }
    
    const allTestsPassed = results.every(result => result);
    if (allTestsPassed) {
      console.log("\n✅ All f64.store tests passed!");
      return true;
    } else {
      console.error("\n❌ Some f64.store tests failed.");
      return false;
    }
  } catch (error) {
    console.error('Error during f64.store test:', error);
    return false;
  }
}

export default testF64Store;