// Generated by 🤖
import { readTestData, logger } from '../test-utils.mjs';
import assert from 'node:assert';

async function testImportedFunction(debug = false) {
  const log = logger(debug);
  try {
    const { wasmBuffer, ast } = await readTestData('imported-functions/imported-functions.wat', debug);

    // Create imports object with the required functions and globals
    const importObject = {
      env: {
        add: (a, b) => a + b,
        factor: 2
      }
    };

    log('Testing WebAssembly instantiation with imports...');

    // Instantiate the module with imports
    const wasmModule = await WebAssembly.instantiate(wasmBuffer, importObject);
    const instance = wasmModule.instance;

    // Test the multiply function that uses both imported function and global
    const result = instance.exports.multiply(5, 3);

    // Expected: (5 + 3) * 2 = 16
    assert.strictEqual(result, 16, 'multiply function should return 16 for inputs 5 and 3');

    // Test with different values
    const result2 = instance.exports.multiply(10, 7);

    // Expected: (10 + 7) * 2 = 34
    assert.strictEqual(result2, 34, 'multiply function should return 34 for inputs 10 and 7');

    return true;
  } catch (e) {
    log(`Error in imported functions test:${e.message}`, 'error');
    return false;
  }
}

export default testImportedFunction;