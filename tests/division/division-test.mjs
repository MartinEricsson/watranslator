import { readTestData } from '../test-utils.mjs';

async function testDivision(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('division/division.wat', debug);
        
        // Try to use WebAssembly API if available
        if (typeof WebAssembly !== 'undefined') {
            if(debug) console.log('Testing WebAssembly instantiation...');
            
            // Using synchronous API for simplicity in this test
            const wasmModule = new WebAssembly.Module(wasmBuffer);
            const instance = new WebAssembly.Instance(wasmModule);
            
            // Check for exported functions
            if(debug) console.log('Exported functions:', Object.keys(instance.exports));
            
            // Test signed division
            if (typeof instance.exports.divide_signed === 'function') {
                console.log('\nTesting signed division (i32.div_s):');
                const testCasesSigned = [
                    { a: 10, b: 2, expected: 5 },      // 10 / 2 = 5
                    { a: -10, b: 2, expected: -5 },    // -10 / 2 = -5
                    { a: 10, b: -2, expected: -5 },    // 10 / -2 = -5
                    { a: -10, b: -2, expected: 5 },    // -10 / -2 = 5
                    { a: 7, b: 2, expected: 3 }        // 7 / 2 = 3 (integer division truncates)
                ];
                
                let testsPassed = true;
                for (const test of testCasesSigned) {
                    const result = instance.exports.divide_signed(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`divide_signed(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ Signed division test: divide_signed function works correctly!');
                } else {
                    console.error('❌ Signed division test failed: divide_signed function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ Signed division test failed: divide_signed function not found in exports');
                return false;
            }
            
            // Test unsigned division
            if (typeof instance.exports.divide_unsigned === 'function') {
                console.log('\nTesting unsigned division (i32.div_u):');
                const testCasesUnsigned = [
                    { a: 10, b: 2, expected: 5 },       // 10 / 2 = 5
                    { a: 4294967295, b: 2, expected: 2147483647 }, // max uint32 / 2
                    { a: 7, b: 2, expected: 3 }         // 7 / 2 = 3 (integer division truncates)
                ];
                
                let testsPassed = true;
                for (const test of testCasesUnsigned) {
                    const result = instance.exports.divide_unsigned(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`divide_unsigned(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ Unsigned division test: divide_unsigned function works correctly!');
                } else {
                    console.error('❌ Unsigned division test failed: divide_unsigned function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ Unsigned division test failed: divide_unsigned function not found in exports');
                return false;
            }
            
            console.log('\n✅ All division tests passed!');
        }
        
        return true;
    } catch (error) {
        console.error('Error during division test:', error);
        return false;
    }
}

export default testDivision;