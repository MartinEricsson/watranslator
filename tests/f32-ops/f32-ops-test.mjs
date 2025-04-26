import { readTestData } from '../test-utils.mjs';

// Helper function for approximate float comparison due to precision issues
function isApproximatelyEqual(a, b, epsilon = 0.00001) {
    return Math.abs(a - b) < epsilon;
}

async function testF32Operations(debug = false) {
    try {
        const {wasmBuffer} = await readTestData('f32-ops/f32-ops.wat', debug);
        
        // Try to use WebAssembly API if available
        if (typeof WebAssembly !== 'undefined') {
            if(debug) console.log('Testing WebAssembly instantiation...');
            
            const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
            
            // Check for exported functions
            if(debug) console.log('Exported functions:', Object.keys(instance.exports));
            
            // Test f32.add
            if (typeof instance.exports.add_float === 'function') {
                console.log('\nTesting f32.add:');
                const testCasesAdd = [
                    { a: 3.5, b: 2.5, expected: 6.0 },
                    { a: -1.5, b: 2.5, expected: 1.0 },
                    { a: 0.0, b: 0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesAdd) {
                    const result = instance.exports.add_float(test.a, test.b);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`add_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.add test: add_float function works correctly!');
                } else {
                    console.error('❌ f32.add test failed: add_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.add test failed: add_float function not found in exports');
                return false;
            }
            
            // Test f32.sub
            if (typeof instance.exports.subtract_float === 'function') {
                console.log('\nTesting f32.sub:');
                const testCasesSub = [
                    { a: 5.5, b: 2.0, expected: 3.5 },
                    { a: 2.5, b: 5.5, expected: -3.0 },
                    { a: 0.0, b: 0.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesSub) {
                    const result = instance.exports.subtract_float(test.a, test.b);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`subtract_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.sub test: subtract_float function works correctly!');
                } else {
                    console.error('❌ f32.sub test failed: subtract_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.sub test failed: subtract_float function not found in exports');
                return false;
            }
            
            // Test f32.mul
            if (typeof instance.exports.multiply_float === 'function') {
                console.log('\nTesting f32.mul:');
                const testCasesMul = [
                    { a: 2.5, b: 3.0, expected: 7.5 },
                    { a: -2.0, b: 3.0, expected: -6.0 },
                    { a: 0.0, b: 5.0, expected: 0.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesMul) {
                    const result = instance.exports.multiply_float(test.a, test.b);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`multiply_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.mul test: multiply_float function works correctly!');
                } else {
                    console.error('❌ f32.mul test failed: multiply_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.mul test failed: multiply_float function not found in exports');
                return false;
            }
            
            // Test f32.div
            if (typeof instance.exports.divide_float === 'function') {
                console.log('\nTesting f32.div:');
                const testCasesDiv = [
                    { a: 10.0, b: 2.0, expected: 5.0 },
                    { a: 7.5, b: 2.5, expected: 3.0 },
                    { a: -6.0, b: 2.0, expected: -3.0 }
                ];
                
                let testsPassed = true;
                for (const test of testCasesDiv) {
                    const result = instance.exports.divide_float(test.a, test.b);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`divide_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.div test: divide_float function works correctly!');
                } else {
                    console.error('❌ f32.div test failed: divide_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.div test failed: divide_float function not found in exports');
                return false;
            }
            
            // Test f32.const
            if (typeof instance.exports.float_constants === 'function') {
                console.log('\nTesting f32.const:');
                const result = instance.exports.float_constants();
                const expected = 3.14159 + 2.71828; // pi + e
                const passed = isApproximatelyEqual(result, expected, 0.0001);
                console.log(`float_constants() = ${result}, expected: ${expected} - ${passed ? '✅' : '❌'}`);
                
                if (passed) {
                    console.log('✅ f32.const test: float_constants function works correctly!');
                } else {
                    console.error(`❌ f32.const test failed: float_constants function returned ${result}, expected ${expected}`);
                    return false;
                }
            } else {
                console.error('❌ f32.const test failed: float_constants function not found in exports');
                return false;
            }
            
            // Test f32 comparison operations - equal
            if (typeof instance.exports.equals_float === 'function') {
                console.log('\nTesting f32.eq:');
                const testCasesEq = [
                    { a: 3.5, b: 3.5, expected: 1 },     // equal values
                    { a: 3.5, b: 3.50001, expected: 0 }, // nearly equal values
                    { a: 0.0, b: -0.0, expected: 1 }     // positive and negative zero
                ];
                
                let testsPassed = true;
                for (const test of testCasesEq) {
                    const result = instance.exports.equals_float(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`equals_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.eq test: equals_float function works correctly!');
                } else {
                    console.error('❌ f32.eq test failed: equals_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.eq test failed: equals_float function not found in exports');
                return false;
            }
            
            // Test f32 comparison operations - not equal
            if (typeof instance.exports.not_equals_float === 'function') {
                console.log('\nTesting f32.ne:');
                const testCasesNe = [
                    { a: 3.5, b: 3.6, expected: 1 },    // different values
                    { a: 3.5, b: 3.5, expected: 0 },    // equal values
                    { a: 0.0, b: -0.0, expected: 0 }    // positive and negative zero
                ];
                
                let testsPassed = true;
                for (const test of testCasesNe) {
                    const result = instance.exports.not_equals_float(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`not_equals_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.ne test: not_equals_float function works correctly!');
                } else {
                    console.error('❌ f32.ne test failed: not_equals_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.ne test failed: not_equals_float function not found in exports');
                return false;
            }
            
            // Test f32 comparison operations - less than
            if (typeof instance.exports.less_than_float === 'function') {
                console.log('\nTesting f32.lt:');
                const testCasesLt = [
                    { a: 2.5, b: 3.5, expected: 1 },    // a < b
                    { a: 3.5, b: 2.5, expected: 0 },    // a > b
                    { a: 3.5, b: 3.5, expected: 0 }     // a = b
                ];
                
                let testsPassed = true;
                for (const test of testCasesLt) {
                    const result = instance.exports.less_than_float(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`less_than_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.lt test: less_than_float function works correctly!');
                } else {
                    console.error('❌ f32.lt test failed: less_than_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.lt test failed: less_than_float function not found in exports');
                return false;
            }
            
            // Test f32 comparison operations - greater than
            if (typeof instance.exports.greater_than_float === 'function') {
                console.log('\nTesting f32.gt:');
                const testCasesGt = [
                    { a: 3.5, b: 2.5, expected: 1 },    // a > b
                    { a: 2.5, b: 3.5, expected: 0 },    // a < b
                    { a: 3.5, b: 3.5, expected: 0 }     // a = b
                ];
                
                let testsPassed = true;
                for (const test of testCasesGt) {
                    const result = instance.exports.greater_than_float(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`greater_than_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.gt test: greater_than_float function works correctly!');
                } else {
                    console.error('❌ f32.gt test failed: greater_than_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.gt test failed: greater_than_float function not found in exports');
                return false;
            }
            
            // Test f32 comparison operations - less than or equal
            if (typeof instance.exports.less_equal_float === 'function') {
                console.log('\nTesting f32.le:');
                const testCasesLe = [
                    { a: 2.5, b: 3.5, expected: 1 },    // a < b
                    { a: 3.5, b: 3.5, expected: 1 },    // a = b
                    { a: 3.5, b: 2.5, expected: 0 }     // a > b
                ];
                
                let testsPassed = true;
                for (const test of testCasesLe) {
                    const result = instance.exports.less_equal_float(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`less_equal_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.le test: less_equal_float function works correctly!');
                } else {
                    console.error('❌ f32.le test failed: less_equal_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.le test failed: less_equal_float function not found in exports');
                return false;
            }
            
            // Test f32 comparison operations - greater than or equal
            if (typeof instance.exports.greater_equal_float === 'function') {
                console.log('\nTesting f32.ge:');
                const testCasesGe = [
                    { a: 3.5, b: 2.5, expected: 1 },    // a > b
                    { a: 3.5, b: 3.5, expected: 1 },    // a = b
                    { a: 2.5, b: 3.5, expected: 0 }     // a < b
                ];
                
                let testsPassed = true;
                for (const test of testCasesGe) {
                    const result = instance.exports.greater_equal_float(test.a, test.b);
                    const passed = result === test.expected;
                    console.log(`greater_equal_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.ge test: greater_equal_float function works correctly!');
                } else {
                    console.error('❌ f32.ge test failed: greater_equal_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.ge test failed: greater_equal_float function not found in exports');
                return false;
            }
            
            // Test f32.copysign
            if (typeof instance.exports.copysign_float === 'function') {
                console.log('\nTesting f32.copysign:');
                const testCasesCopysign = [
                    { a: 3.5, b: 2.5, expected: 3.5 },     // positive sign, result should be positive
                    { a: 3.5, b: -2.5, expected: -3.5 },   // negative sign, result should be negative
                    { a: -3.5, b: 2.5, expected: 3.5 },    // positive sign, absolute value
                    { a: -3.5, b: -2.5, expected: -3.5 },  // negative sign, stay negative
                    { a: 0.0, b: -0.0, expected: -0.0 }    // test with zero values
                ];
                
                let testsPassed = true;
                for (const test of testCasesCopysign) {
                    const result = instance.exports.copysign_float(test.a, test.b);
                    
                    // Special case for handling -0 and +0
                    let passed = false;
                    if (test.expected === 0.0 || test.expected === -0.0) {
                        // JavaScript doesn't distinguish between -0 and 0 with ===
                        // Check using 1/result: 1/0 = Infinity, 1/-0 = -Infinity
                        const expectedSign = 1 / test.expected === -Infinity;
                        const resultSign = 1 / result === -Infinity;
                        passed = expectedSign === resultSign;
                    } else {
                        passed = isApproximatelyEqual(Math.abs(result), Math.abs(test.expected)) &&
                                 Math.sign(result) === Math.sign(test.expected);
                    }
                    
                    console.log(`copysign_float(${test.a}, ${test.b}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.copysign test: copysign_float function works correctly!');
                } else {
                    console.error('❌ f32.copysign test failed: copysign_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.copysign test failed: copysign_float function not found in exports');
                return false;
            }
            
            // Test f32.convert_i64_s
            if (typeof instance.exports.convert_i64_s === 'function') {
                console.log('\nTesting f32.convert_i64_s:');
                const testCasesConvertI64S = [
                    { a: 42n, expected: 42.0 },
                    { a: -42n, expected: -42.0 },
                    { a: 9007199254740991n, expected: 9007199254740992.0 }, // Precision loss expected
                    { a: -9007199254740991n, expected: -9007199254740992.0 } // Precision loss expected
                ];
                
                let testsPassed = true;
                for (const test of testCasesConvertI64S) {
                    const result = instance.exports.convert_i64_s(test.a);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`convert_i64_s_float(${test.a}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.convert_i64_s test: convert_i64_s_float function works correctly!');
                } else {
                    console.error('❌ f32.convert_i64_s test failed: convert_i64_s_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.convert_i64_s test failed: convert_i64_s_float function not found in exports');
                return false;
            }
            
            // Test f32.convert_i64_u
            if (typeof instance.exports.convert_i64_u === 'function') {
                console.log('\nTesting f32.convert_i64_u:');
                const testCasesConvertI64U = [
                    { a: 42n, expected: 42.0 },
                    { a: 0n, expected: 0.0 },
                    { a: 9007199254740991n, expected: 9007199254740992.0 }, // Precision loss expected
                    { a: 18014398509481984n, expected: 18014398509481984.0 } // Large unsigned value
                ];
                
                let testsPassed = true;
                for (const test of testCasesConvertI64U) {
                    const result = instance.exports.convert_i64_u(test.a);
                    const passed = isApproximatelyEqual(result, test.expected);
                    console.log(`convert_i64_u_float(${test.a}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.convert_i64_u test: convert_i64_u_float function works correctly!');
                } else {
                    console.error('❌ f32.convert_i64_u test failed: convert_i64_u_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.convert_i64_u test failed: convert_i64_u_float function not found in exports');
                return false;
            }
            
            // Test f32.reinterpret_i32
            if (typeof instance.exports.reinterpret_i32 === 'function') {
                console.log('\nTesting f32.reinterpret_i32:');
                const testCasesReinterpret = [
                    { a: 0, expected: 0.0 },
                    { a: 0x3f800000, expected: 1.0 },        // Bit pattern for 1.0
                    { a: 0x40000000, expected: 2.0 },        // Bit pattern for 2.0
                    { a: 0xc0000000, expected: -2.0 },       // Bit pattern for -2.0
                    { a: 0x7f800000, expected: Infinity },   // Positive infinity
                    { a: 0xff800000, expected: -Infinity }   // Negative infinity
                ];
                
                let testsPassed = true;
                for (const test of testCasesReinterpret) {
                    const result = instance.exports.reinterpret_i32(test.a);
                    
                    // Special case for infinity values
                    let passed = false;
                    if (Number.isFinite(test.expected)) {
                        passed = isApproximatelyEqual(result, test.expected);
                    } else {
                        passed = (result === test.expected);
                    }
                    
                    console.log(`reinterpret_i32_float(0x${test.a.toString(16)}) = ${result}, expected: ${test.expected} - ${passed ? '✅' : '❌'}`);
                    if (!passed) testsPassed = false;
                }
                
                if (testsPassed) {
                    console.log('✅ f32.reinterpret_i32 test: reinterpret_i32_float function works correctly!');
                } else {
                    console.error('❌ f32.reinterpret_i32 test failed: reinterpret_i32_float function returned incorrect results');
                    return false;
                }
            } else {
                console.error('❌ f32.reinterpret_i32 test failed: reinterpret_i32_float function not found in exports');
                return false;
            }
            
            console.log('\n✅ All f32 operation tests passed!');
        }
        
        return true;
    } catch (error) {
        console.error('Error during f32 operations test:', error);
        return false;
    }
}

export default testF32Operations;