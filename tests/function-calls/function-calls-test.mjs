import { readTestData } from '../test-utils.mjs';

async function testFunctionCalls(debug = true) {
    try {
        const { wasmBuffer } = await readTestData('function-calls/function-calls.wat', debug);
        const {instance} = await WebAssembly.instantiate(wasmBuffer, {});

        // Try to use WebAssembly API if available
        if (typeof WebAssembly !== 'undefined') {
            if (debug) console.log('Testing WebAssembly instantiation...');

            // Check for exported functions
            if (debug) console.log('Exported functions:', Object.keys(instance.exports));
            if (typeof instance.exports.multiplyAndAdd === 'function') {
                const result = instance.exports.multiplyAndAdd(5, 7, 3);
                console.log(`Result of multiplyAndAdd(5, 7, 3): ${result}`);
                // Expected result is (5 * 7) + 3 = 38
                if (result === 38) {
                    console.log('✅ Function calls test: Function works correctly!');
                } else {
                    console.error(`❌ Function calls test failed: Expected 38, got ${result}`);
                    return false;
                }
            }
            else {
                console.error('❌ Function calls test failed: multiplyAndAdd function not found in exports');
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error during function calls test:', error);
        return false;
    }
}

export default testFunctionCalls;