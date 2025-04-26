import { readTestData } from '../test-utils.mjs';

async function testLocalVariables(debug = false) {
    try {
        const { wasmBuffer, ast } = await readTestData('local-vars/local-vars.wat', debug);

        if(debug) console.log('AST created:');
        if(debug) console.log(JSON.stringify(ast, null, 2));

        // Try to use WebAssembly API if available
        if (typeof WebAssembly !== 'undefined') {
            if(debug) console.log('Testing WebAssembly instantiation...');

            // Using synchronous API for simplicity in this test
            const wasmModule = new WebAssembly.Module(wasmBuffer);
            const instance = new WebAssembly.Instance(wasmModule);

            // Check for exported functions
            if(debug) console.log('Exported functions:', Object.keys(instance.exports));

            // Try to call the addAndDouble function
            if (typeof instance.exports.addAndDouble === 'function') {
                const result = instance.exports.addAndDouble(5, 7);
                console.log(`Result of addAndDouble(5, 7): ${result}`);

                // Expected result is (5 + 7) * 2 = 24
                if (result === 24) {
                    console.log('✅ Local variables test: Function works correctly!');
                } else {
                    console.error(`❌ Local variables test failed: Expected 24, got ${result}`);
                    return false;
                }
            } else {
                console.error('❌ Local variables test failed: addAndDouble function not found in exports');
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error during local variables test:', error);
        return false;
    }
}

export default testLocalVariables;