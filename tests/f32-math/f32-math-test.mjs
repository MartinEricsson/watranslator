import { readTestData } from '../test-utils.mjs';

// Helper function for approximate float comparison due to precision issues
function isApproximatelyEqual(a, b, epsilon = 0.00001) {
    return Math.abs(a - b) < epsilon;
}

async function testF32MathOperations(debug = false) {
    try {
        const { wasmBuffer, ast } = await readTestData('f32-math/f32-math.wat', debug);
        
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
            
            // Test f32.abs
            if (typeof instance.exports.abs === 'function') {
                console.log('\nTesting f32.abs:');
                const testCasesAbs = [
                    { value: 3.5, expected: 3.5 },
                    { value: -3.5, expected: 3.5 },
                    { value: 0.0, expected: 0.0 },
                    { value: -0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesAbs) {
                    const result = instance.exports.abs(test.value);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`abs(${test.value}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.abs test: works correctly!');
                } else {
                    console.error('❌ f32.abs test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.abs test failed: function not found in exports');
                return false;
            }
            
            // Test f32.neg
            if (typeof instance.exports.neg === 'function') {
                console.log('\nTesting f32.neg:');
                const testCasesNeg = [
                    { value: 3.5, expected: -3.5 },
                    { value: -3.5, expected: 3.5 },
                    { value: 0.0, expected: -0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesNeg) {
                    const result = instance.exports.neg(test.value);
                    
                    // Special case for testing -0.0 vs 0.0
                    if (test.value === 0.0) {
                        const isNegativeZero = Object.is(result, -0);
                        console.log(`neg(${test.value}) = ${result} (negative zero?: ${isNegativeZero}), expected: -0.0 - ${isNegativeZero ? '✅' : '❌'}`);
                        if (!isNegativeZero) testsPassed = false;
                    } else {
                        const passed = isApproximatelyEqual(result, test.expected);
                        console.log(`neg(${test.value}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                        if (!passed) testsPassed = false;
                    }
                }
                
                if (testsPassed) {
                    console.log('✅ f32.neg test: works correctly!');
                } else {
                    console.error('❌ f32.neg test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.neg test failed: function not found in exports');
                return false;
            }
            
            // Test f32.sqrt
            if (typeof instance.exports.sqrt === 'function') {
                console.log('\nTesting f32.sqrt:');
                const testCasesSqrt = [
                    { value: 4.0, expected: 2.0 },
                    { value: 9.0, expected: 3.0 },
                    { value: 2.0, expected: 1.4142135623730951 },
                    { value: 0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesSqrt) {
                    const result = instance.exports.sqrt(test.value);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`sqrt(${test.value}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.sqrt test: works correctly!');
                } else {
                    console.error('❌ f32.sqrt test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.sqrt test failed: function not found in exports');
                return false;
            }
            
            // Test f32.min
            if (typeof instance.exports.min === 'function') {
                console.log('\nTesting f32.min:');
                const testCasesMin = [
                    { a: 3.5, b: 2.5, expected: 2.5 },
                    { a: -1.5, b: 2.5, expected: -1.5 },
                    { a: 0.0, b: -0.0, expected: -0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesMin) {
                    const result = instance.exports.min(test.a, test.b);
                    
                    // Special case for testing -0.0
                    if (test.expected === -0.0) {
                        const isNegativeZero = Object.is(result, -0);
                        console.log(`min(${test.a}, ${test.b}) = ${result} (negative zero?: ${isNegativeZero}), expected: -0.0 - ${isNegativeZero ? '✅' : '❌'}`);
                        if (!isNegativeZero) testsPassed = false;
                    } else {
                        const passed = isApproximatelyEqual(result, test.expected);
                        console.log(`min(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                        if (!passed) testsPassed = false;
                    }
                }
                
                if (testsPassed) {
                    console.log('✅ f32.min test: works correctly!');
                } else {
                    console.error('❌ f32.min test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.min test failed: function not found in exports');
                return false;
            }
            
            // Test f32.max
            if (typeof instance.exports.max === 'function') {
                console.log('\nTesting f32.max:');
                const testCasesMax = [
                    { a: 3.5, b: 2.5, expected: 3.5 },
                    { a: -1.5, b: 2.5, expected: 2.5 },
                    { a: 0.0, b: -0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesMax) {
                    const result = instance.exports.max(test.a, test.b);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`max(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.max test: works correctly!');
                } else {
                    console.error('❌ f32.max test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.max test failed: function not found in exports');
                return false;
            }
            
            // Test f32.ceil
            if (typeof instance.exports.ceil === 'function') {
                console.log('\nTesting f32.ceil:');
                const testCasesCeil = [
                    { value: 3.1, expected: 4.0 },
                    { value: 3.9, expected: 4.0 },
                    { value: -3.1, expected: -3.0 },
                    { value: -3.9, expected: -3.0 },
                    { value: 0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesCeil) {
                    const result = instance.exports.ceil(test.value);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`ceil(${test.value}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.ceil test: works correctly!');
                } else {
                    console.error('❌ f32.ceil test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.ceil test failed: function not found in exports');
                return false;
            }
            
            // Test f32.floor
            if (typeof instance.exports.floor === 'function') {
                console.log('\nTesting f32.floor:');
                const testCasesFloor = [
                    { value: 3.1, expected: 3.0 },
                    { value: 3.9, expected: 3.0 },
                    { value: -3.1, expected: -4.0 },
                    { value: -3.9, expected: -4.0 },
                    { value: 0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesFloor) {
                    const result = instance.exports.floor(test.value);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`floor(${test.value}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.floor test: works correctly!');
                } else {
                    console.error('❌ f32.floor test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.floor test failed: function not found in exports');
                return false;
            }
            
            // Test f32.trunc
            if (typeof instance.exports.trunc === 'function') {
                console.log('\nTesting f32.trunc:');
                const testCasesTrunc = [
                    { value: 3.1, expected: 3.0 },
                    { value: 3.9, expected: 3.0 },
                    { value: -3.1, expected: -3.0 },
                    { value: -3.9, expected: -3.0 },
                    { value: 0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesTrunc) {
                    const result = instance.exports.trunc(test.value);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`trunc(${test.value}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.trunc test: works correctly!');
                } else {
                    console.error('❌ f32.trunc test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.trunc test failed: function not found in exports');
                return false;
            }
            
            // Test f32.nearest
            if (typeof instance.exports.nearest === 'function') {
                console.log('\nTesting f32.nearest:');
                const testCasesNearest = [
                    { value: 3.1, expected: 3.0 },
                    { value: 3.5, expected: 4.0 }, // Rounds to even for ties
                    { value: 3.6, expected: 4.0 },
                    { value: 4.5, expected: 4.0 }, // Rounds to even for ties
                    { value: -3.1, expected: -3.0 },
                    { value: -3.5, expected: -4.0 }, // Rounds to even for ties
                    { value: -3.6, expected: -4.0 },
                    { value: 0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesNearest) {
                    const result = instance.exports.nearest(test.value);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`nearest(${test.value}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.nearest test: works correctly!');
                } else {
                    console.error('❌ f32.nearest test failed: function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.nearest test failed: function not found in exports');
                return false;
            }
            
            console.log('\n✅ All f32 math operation tests passed!');
        }
        
        return true;
    } catch (error) {
        console.error('Error during f32 math operations test:', error);
        return false;
    }
}

export default testF32MathOperations;