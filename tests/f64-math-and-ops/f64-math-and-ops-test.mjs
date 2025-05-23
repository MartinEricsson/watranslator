import { readTestData } from "../test-utils.mjs";

async function TestF64MathAndOps(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('f64-math-and-ops/f64-math-and-ops.wat', debug);

        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

        const tests = [
            { name: "const_f64", expected: 1.0, func: "const_f64", params: [] },
            // Updated expected values to match the WAT file
            // Generated by 🤖
            { name: "const_large_f64", expected: 1.7976931348623157e+308, func: "const_large_f64", params: [] },
            { name: "const_small_f64", expected: 2.2250738585072014e-308, func: "const_small_f64", params: [] },
            { name: "add", expected: 5.0, func: "add", params: [2.0, 3.0] },
            { name: "sub", expected: -1.0, func: "sub", params: [2.0, 3.0] },
            { name: "mul", expected: 6.0, func: "mul", params: [2.0, 3.0] },
            { name: "div", expected: 2.0 / 3.0, func: "div", params: [2.0, 3.0] },
            // New test cases for added functions
            // Generated by 🤖
            { name: "abs", expected: 3.5, func: "abs", params: [-3.5] },
            { name: "sqrt", expected: 3.0, func: "sqrt", params: [9.0] },
            { name: "neg", expected: -4.2, func: "neg", params: [4.2] },
            { name: "min", expected: 2.5, func: "min", params: [2.5, 5.0] },
            { name: "max", expected: 5.0, func: "max", params: [2.5, 5.0] },
            { name: "copy_sign", expected: -7.5, func: "copy_sign", params: [7.5, -2.0] },
            { name: "ceil", expected: 3.0, func: "ceil", params: [2.1] },
            { name: "floor", expected: 2.0, func: "floor", params: [2.9] },
            { name: "trunc", expected: 3.0, func: "trunc", params: [3.7] },
            { name: "nearest", expected: 4.0, func: "nearest", params: [3.7] },
            // Test cases for f64.eq
            // Generated by 🤖
            { name: "eq (equal values)", expected: 1, func: "eq", params: [42.0, 42.0] },
            { name: "eq (different values)", expected: 0, func: "eq", params: [42.0, 43.0] },
            { name: "eq (NaN)", expected: 0, func: "eq", params: [NaN, NaN] },
            { name: "eq (zeros)", expected: 1, func: "eq", params: [0.0, -0.0] },
            
            // Test cases for f64.ne
            // Generated by 🤖
            { name: "ne (equal values)", expected: 0, func: "ne", params: [42.0, 42.0] },
            { name: "ne (different values)", expected: 1, func: "ne", params: [42.0, 43.0] },
            { name: "ne (NaN)", expected: 1, func: "ne", params: [NaN, 0.0] },
            
            // Test cases for f64.lt
            // Generated by 🤖
            { name: "lt (less than)", expected: 1, func: "lt", params: [3.0, 5.0] },
            { name: "lt (equal)", expected: 0, func: "lt", params: [5.0, 5.0] },
            { name: "lt (greater than)", expected: 0, func: "lt", params: [7.0, 5.0] },
            
            // Test cases for f64.gt
            // Generated by 🤖
            { name: "gt (greater than)", expected: 1, func: "gt", params: [7.0, 5.0] },
            { name: "gt (equal)", expected: 0, func: "gt", params: [5.0, 5.0] },
            { name: "gt (less than)", expected: 0, func: "gt", params: [3.0, 5.0] },
            
            // Test cases for f64.le
            // Generated by 🤖
            { name: "le (less than)", expected: 1, func: "le", params: [3.0, 5.0] },
            { name: "le (equal)", expected: 1, func: "le", params: [5.0, 5.0] },
            { name: "le (greater than)", expected: 0, func: "le", params: [7.0, 5.0] },
            
            // Test cases for f64.ge
            // Generated by 🤖
            { name: "ge (greater than)", expected: 1, func: "ge", params: [7.0, 5.0] },
            { name: "ge (equal)", expected: 1, func: "ge", params: [5.0, 5.0] },
            { name: "ge (less than)", expected: 0, func: "ge", params: [3.0, 5.0] },
        ];

        let results = [];
        for (const { name, expected, func, params } of tests) {
            const result = instance.exports[func](...params);
            
            // Special handling for NaN tests
            let resultRes;
            if (Number.isNaN(expected) && Number.isNaN(result)) {
                resultRes = true;
            } else {
                resultRes = result === expected;
            }
            
            console.assert(resultRes, `❌ ${name} should return ${expected}, got ${result}`);
            results.push(resultRes);
            if (debug) {
                console.log(`Debug: ${name} - Expected: ${expected}, Got: ${result}`);
            }
            if (resultRes) {
                console.log(`✅ ${name} test passed!`);
            } else {
                console.error(`❌ ${name} test failed.`);
            }
        }
        // check if all tests passed
        const allTestsPassed = results.every(result => result);
        if (allTestsPassed) {
            console.log("✅ All f64 math tests passed!");
            return true;
        } else {
            console.error("❌ Some f64 math tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing f64 math:', error);
        return false;
    }
}

export default TestF64MathAndOps;