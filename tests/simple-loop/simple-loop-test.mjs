import { readTestData } from '../test-utils.mjs';

async function testSimpleLoop(debug = false) {
    try {
        const { wasmBuffer, ast } = await readTestData('simple-loop/simple-loop.wat', debug);

        if (debug) console.log('AST created:');
        if (debug) console.log(JSON.stringify(ast, null, 2));

        // Try to use WebAssembly API if available
        if (typeof WebAssembly !== 'undefined') {
            if (debug) console.log('Testing WebAssembly instantiation...');

            // Using synchronous API for simplicity
            const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

            // Check for exported functions
            if (debug) console.log('Exported functions:', Object.keys(instance.exports));

            // Test the countToN function
            if (typeof instance.exports.countToN === 'function') {
                // Test cases
                const testCases = [
                    { n: 5, expected: 15 },    // 1 + 2 + 3 + 4 + 5 = 15
                    { n: 10, expected: 55 },   // 1 + 2 + ... + 10 = 55
                    { n: 1, expected: 1 }      // Just 1
                ];

                let testsPassed = true;
                for (const test of testCases) {
                    const result = instance.exports.countToN(test.n);
                    const passed = result === test.expected;
                    console.log(`countToN(${test.n}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }

                if (testsPassed) {
                    console.log('✅ Loop test: countToN function works correctly!');
                } else {
                    console.error('❌ Loop test failed: countToN function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ Loop test failed: countToN function not found in exports');
                return false;
            }

            console.log('✅ Simple loop test passed!');
        }

        return true;
    } catch (error) {
        console.error('Error during simple loop test:', error);
        return false;
    }
}

export default testSimpleLoop;