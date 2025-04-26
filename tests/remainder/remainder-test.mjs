import { readTestData } from '../test-utils.mjs';

async function testRemainder(debug = false) {
    try {
        const { wasmBuffer, ast } = await readTestData('remainder/remainder.wat', debug);

        if (debug) console.log('AST created:');
        if (debug) console.log(JSON.stringify(ast, null, 2));

        // Try to use WebAssembly API if available
        if (typeof WebAssembly !== 'undefined') {
            if (debug) console.log('Testing WebAssembly instantiation...');

            // Using synchronous API for simplicity in this test
            const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

            // Check for exported functions
            console.log('Exported functions:', Object.keys(instance.exports));

            // Test signed remainder
            if (typeof instance.exports.remainder_signed === 'function') {
                console.log('\nTesting signed remainder (i32.rem_s):');
                const testCasesSigned = [
                    { a: 10, b: 3, expected: 1 },      // 10 % 3 = 1
                    { a: -10, b: 3, expected: -1 },    // -10 % 3 = -1
                    { a: 10, b: -3, expected: 1 },     // 10 % -3 = 1
                    { a: -10, b: -3, expected: -1 },   // -10 % -3 = -1
                    { a: 7, b: 4, expected: 3 }        // 7 % 4 = 3
                ];

                let testsPassed = true;
                for (const test of testCasesSigned) {
                    const result = instance.exports.remainder_signed(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`remainder_signed(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }

                if (testsPassed) {
                    console.log('✅ Signed remainder test: remainder_signed function works correctly!');
                } else {
                    console.error('❌ Signed remainder test failed: remainder_signed function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ Signed remainder test failed: remainder_signed function not found in exports');
                return false;
            }

            // Test unsigned remainder
            if (typeof instance.exports.remainder_unsigned === 'function') {
                console.log('\nTesting unsigned remainder (i32.rem_u):');
                const testCasesUnsigned = [
                    { a: 10, b: 3, expected: 1 },      // 10 % 3 = 1
                    { a: 7, b: 4, expected: 3 },       // 7 % 4 = 3
                    { a: 4294967295, b: 10, expected: 5 } // max uint32 % 10 = 5
                ];

                let testsPassed = true;
                for (const test of testCasesUnsigned) {
                    const result = instance.exports.remainder_unsigned(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`remainder_unsigned(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }

                if (testsPassed) {
                    console.log('✅ Unsigned remainder test: remainder_unsigned function works correctly!');
                } else {
                    console.error('❌ Unsigned remainder test failed: remainder_unsigned function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ Unsigned remainder test failed: remainder_unsigned function not found in exports');
                return false;
            }

            console.log('\n✅ All remainder tests passed!');
        }

        return true;
    } catch (error) {
        console.error('Error during remainder test:', error);
        return false;
    }
}

export default testRemainder;