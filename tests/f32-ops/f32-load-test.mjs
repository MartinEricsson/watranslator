import { readTestData } from '../test-utils.mjs';

async function testF32Load(debug = false) {
  // Read the WAT file
  const {wasmBuffer} = await readTestData('f32-ops/f32-load-test.wat', debug);

  // Instantiate the WebAssembly module
  const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
  
  // Test f32.load
  if (typeof instance.exports.load_float === 'function') {
    console.log('\nTesting f32.load:');
    
    // Memory should be initialized with [1.0, 2.0, 3.0, 4.0]
    const testCases = [
      { addr: 0, expected: 1.0 },   // First float (offset 0)
      { addr: 4, expected: 2.0 },   // Second float (offset 4)
      { addr: 8, expected: 3.0 },   // Third float (offset 8)
      { addr: 12, expected: 4.0 }   // Fourth float (offset 12)
    ];
    
    let results = [];
    for (const test of testCases) {
      const result = instance.exports.load_float(test.addr);
      const resultRes = Math.abs(result - test.expected) < 0.00001;
      results.push(resultRes);
      console.assert(resultRes, `❌ load_float(${test.addr}) should return ${test.expected}, got ${result}`);
      if(debug) console.log(`load_float(${test.addr}) = ${result}, expected: ${test.expected} - ${resultRes ? '✅' : '❌'}`);
    }
    
    const allTestsPassed = results.every(result => result);
        if (allTestsPassed) {
            console.log("✅ All f32 load tests passed!");
            return true;
        } else {
            console.error("❌ Some f32 load tests failed.");
            return false;
        }
  } else {
    console.error('❌ f32.load test failed: load_float function not found in exports');
    return false; // Test failed
  }
}

export default testF32Load;