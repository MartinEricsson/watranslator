import { readTestData } from '../test-utils.mjs';

async function testEarlyReturn(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('early-return/early-return.wat', debug);

        // Try to use WebAssembly API if available
        if (typeof WebAssembly !== 'undefined') {
            if (debug) console.log('Testing WebAssembly instantiation...');

            // Using synchronous API for simplicity in this test
            const wasmModule = new WebAssembly.Module(wasmBuffer);
            const instance = new WebAssembly.Instance(wasmModule);

            // Check for exported functions
            if (debug) console.log('Exported functions:', Object.keys(instance.exports));

            // Test the early_return function
            if (typeof instance.exports.early_return === 'function') {
                // Test cases for early_return function
                const testCases = [
                    { input: 3, expected: 0 },    // x < 5, should return 0 (early return)
                    { input: 5, expected: 10 },   // x = 5, should return x * 2 = 10
                    { input: 8, expected: 16 }    // x > 5, should return x * 2 = 16
                ];

                let allTestsPassed = true;
                for (const test of testCases) {
                    const result = instance.exports.early_return(test.input);
                    const passed = result === test.expected;
                    console.log(`early_return(${test.input}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) allTestsPassed = false;
                }

                if (allTestsPassed) {
                    console.log('✅ Early return test: function works correctly!');
                } else {
                    console.error('❌ Early return test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ Early return test failed: early_return function not found in exports');
                return false;
            }

            console.log('✅ All early return tests passed!');
        }

        return true;
    } catch (error) {
        console.error('Error during early return test:', error);
        return false;
    }
}

export default testEarlyReturn;