import { readTestData } from '../test-utils.mjs';

async function testF64Load(debug = false) {
  // Read the WAT file
  const {wasmBuffer} = await readTestData('f64-math-and-ops/f64-load-test.wat', debug);

  // Instantiate the WebAssembly module
  const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
  
  // Test f64.load
  if (typeof instance.exports.load_f64 === 'function') {
    console.log('\nTesting f64.load:');
    
    // Memory should be initialized with [1.0, 2.0, 3.0, 4.0]
    const testCases = [
      { addr: 0, expected: 1.0 },   // First double (offset 0)
      { addr: 8, expected: 2.0 },   // Second double (offset 8)
      { addr: 16, expected: 3.0 },  // Third double (offset 16)
      { addr: 24, expected: 4.0 }   // Fourth double (offset 24)
    ];
    
    let results = [];
    for (const test of testCases) {
      const result = instance.exports.load_f64(test.addr);
      const resultRes = Math.abs(result - test.expected) < 0.00001;
      results.push(resultRes);
      console.assert(resultRes, `❌ load_f64(${test.addr}) should return ${test.expected}, got ${result}`);
      if(debug) console.log(`load_f64(${test.addr}) = ${result}, expected: ${test.expected} - ${resultRes ? '✅' : '❌'}`);
    }
    
    const allTestsPassed = results.every(result => result);
    if (allTestsPassed) {
      console.log("✅ All f64 load tests passed!");
      return true;
    } else {
      console.error("❌ Some f64 load tests failed.");
      return false;
    }
  } else {
    console.error('❌ f64.load test failed: load_f64 function not found in exports');
    return false; // Test failed
  }
}

export default testF64Load;