import { readTestData } from "../test-utils.mjs";

export async function testMultipleFunctionArguments(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('multiple-function-arguments/multiple-function-arguments.wat', debug);

        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

        const tests = [
            { name: 'multiple_function_arguments', expected: -1, func: "add", params: [0, -2, 1] },
            { name: 'multiple_function_arguments', expected: 6, func: "add", params: [1, 2, 3] },
            { name: 'multiple_function_arguments_labels', expected: -1, func: "add_labels", params: [0, -2, 1] },
            { name: 'multiple_function_arguments_labels', expected: 6, func: "add_labels", params: [1, 2, 3] },
        ];

        let results = [];
        for (const { func, expected, params } of tests) {
            const result = instance.exports[func](...params);

            const resultRes = result === expected;
            console.assert(resultRes, `❌ ${func} should return ${expected}, got ${result}`);
            results.push(resultRes);
            if (debug) {
                console.log(`Debug: ${func} - Expected: ${expected}, Got: ${result}`);
            }
            if (resultRes) {
                console.log(`✅ ${func} test passed!`);
            } else {
                console.error(`❌ ${func} test failed.`);
            }
        }
        // check if all tests passed
        const allTestsPassed = results.every(result => result);
        if (allTestsPassed) {
            console.log("✅ All multiple function arguments tests passed!");
            return true;
        } else {
            console.error("❌ Some multiple function arguments tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing multiple function arguments:', error);
        return false;
    }
}