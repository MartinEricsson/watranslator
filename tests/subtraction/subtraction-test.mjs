import { readTestData } from '../test-utils.mjs';

async function testSubtraction(debug = false) {
    try {
        const { wasmBuffer, ast } = await readTestData('subtraction/subtraction.wat', debug);
        
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
            
            // Test the subtract function
            if (typeof instance.exports.subtract === 'function') {
                // Test cases for subtract function
                const testCases = [
                    { a: 10, b: 5, expected: 5 },     // 10 - 5 = 5
                    { a: 20, b: 8, expected: 12 },    // 20 - 8 = 12
                    { a: 5, b: 10, expected: -5 },    // 5 - 10 = -5
                    { a: 0, b: 0, expected: 0 }       // 0 - 0 = 0
                ];
                
                let testsPassed = true;
                for (const test of testCases) {
                    const result = instance.exports.subtract(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`subtract(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ Subtraction test: subtract function works correctly!');
                } else {
                    console.error('❌ Subtraction test failed: subtract function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ Subtraction test failed: subtract function not found in exports');
                return false;
            }
            
            console.log('✅ All subtraction tests passed!');
        }
        
        return true;
    } catch (error) {
        console.error('Error during subtraction test:', error);
        return false;
    }
}

export default testSubtraction;