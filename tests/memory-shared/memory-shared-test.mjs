import { readTestData } from "../test-utils.mjs";

async function testSharedMemory(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('memory-shared/memory-shared.wat', debug);

        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

        const tests = [
            { name: "store shared memory", expected: undefined, func: "store", params: [0,1] },
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
            console.log("✅ All shared memory tests passed!");
            return true;
        } else {
            console.error("❌ Some shared memory tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing shared memory:', error);
        return false;
    }
}

export default testSharedMemory;
