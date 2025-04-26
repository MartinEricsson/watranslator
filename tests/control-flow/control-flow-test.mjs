import { readTestData } from "../test-utils.mjs";

async function testControlFlow(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('control-flow/control-flow.wat', debug);
        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

        const tests = [
            { name: "max_right", expected: 10, func: "max", params: [5, 10] },
            { name: "max_left", expected: 20, func: "max", params: [20, 7] },
            { name: "max_equal", expected: 8, func: "max", params: [8, 8] },
            { name: "count_to_n", expected: 15, func: "countToN", params: [5] },
            { name: "count_to_n_10", expected: 55, func: "countToN", params: [10] },
            { name: "count_to_n_1", expected: 1, func: "countToN", params: [1] },
            { name: "tee", expected: 5, func: "tee", params: [5] },
        ]

        let results = [];
        for (const { name, expected, func, params } of tests) {
            const result = instance.exports[func](...params);

            const resultRes = result === expected;
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
            console.log("✅ All control flow tests passed!");
            return true;
        } else {
            console.error("❌ Some control flow tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error during control flow test:', error);
        return false;
    }
}

export default testControlFlow;