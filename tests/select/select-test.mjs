import { readTestData } from "../test-utils.mjs";

async function testSelect(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('select/select.wat', debug);
        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
        const tests = [
            { name: "select_1", expected: 1, func: "select", params: [1, 0, 1] },
            { name: "select_2", expected: 0, func: "select", params: [1, 0, 0] },
            { name: "select_3", expected: 0, func: "select", params: [0, 0, 1] },
            { name: "select_4", expected: 1, func: "select", params: [0, 1, 1] },
        ];
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
            console.log("✅ All select tests passed!");
            return true;
        } else {
            console.error("❌ Some select tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing select:', error);
        return false;
    }
}
export default testSelect;