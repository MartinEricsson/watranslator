import assert from 'assert';
import { readTestData } from '../test-utils.mjs';

async function testGlobalVariables(debug = false) {
  try {
    const { wasmBuffer, ast } = await readTestData('global-variables/global-variables.wat', debug);

    if (debug) {
      console.log('AST created:');
      console.log(JSON.stringify(ast, null, 2));
    }

    // Try to instantiate the module
    if (typeof WebAssembly !== 'undefined') {
      if (debug) console.log('Testing WebAssembly instantiation...');

      // Instantiate the module
      const wasmModule = await WebAssembly.instantiate(wasmBuffer);
      const instance = wasmModule.instance;

      // Check for exported functions and globals
      const exports = instance.exports;
      if (debug) console.log('Module exports:', Object.keys(exports));

      // Test 1: Access immutable global
      const answer = exports.getAnswer();
      if (debug) console.log(`Answer value: ${answer}`);
      assert.strictEqual(answer, 42, 'Immutable global value should be 42');
      console.log('✅ Immutable global access works correctly');

      // Test 2: Access exported global directly
      const answerGlobal = exports.answer.value;
      assert.strictEqual(answerGlobal, 42, 'Exported global value should be 42');
      console.log('✅ Direct global export works correctly');

      // Test 3: Modify mutable global
      const counterBefore = exports.incrementCounter();
      if (debug) console.log(`Counter after first increment: ${counterBefore}`);
      assert.strictEqual(counterBefore, 1, 'Counter should be incremented to 1');

      const counterAfter = exports.incrementCounter();
      if (debug) console.log(`Counter after second increment: ${counterAfter}`);
      assert.strictEqual(counterAfter, 2, 'Counter should be incremented to 2');
      console.log('✅ Mutable global modification works correctly');

      // Test 4: Float global and conversion
      const fahrenheit = exports.celsiusToFahrenheit();
      if (debug) console.log(`22.5°C = ${fahrenheit}°F`);
      assert.ok(Math.abs(fahrenheit - 72.5) < 0.01, 'Fahrenheit conversion should be approximately 72.5°F');
      console.log('✅ Float globals work correctly');

      // Test 5: Update mutable float global
      exports.setTemperature(30);
      const newFahrenheit = exports.celsiusToFahrenheit();
      if (debug) console.log(`After update: 30°C = ${newFahrenheit}°F`);
      assert.ok(Math.abs(newFahrenheit - 86) < 0.01, 'Updated temperature conversion should be 86°F');

      // Check the exported global value was updated
      const tempGlobal = exports.temperature.value;
      assert.ok(Math.abs(tempGlobal - 30) < 0.01, 'Exported temperature global should be updated to 30');
      console.log('✅ Updating exported mutable global works correctly');

      console.log('All global variable tests passed! ✓');
      return true;
    } else {
      console.error('❌ WebAssembly not available');
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

export default testGlobalVariables;