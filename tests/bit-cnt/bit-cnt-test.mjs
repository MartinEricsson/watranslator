import { readTestData } from "../test-utils.mjs";

async function testBitCnt(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('bit-cnt/bit-cnt.wat', debug);

        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

        const tests = [
            { name: "clz", expected: 31, func: "clz", params: [1] },
            { name: "ctz", expected: 31, func: "ctz", params: [2147483648] },
            { name: "popcnt_7", expected: 3, func: "cnt", params: [7] },
            { name: "popcnt_15", expected: 4, func: "cnt", params: [15] },
            { name: "popcnt_0", expected: 0, func: "cnt", params: [0] },
            { name: "popcnt_0xFFFFFFFF", expected: 32, func: "cnt", params: [0xFFFFFFFF] },
            { name: "popcnt_0x10101010", expected: 4, func: "cnt", params: [0x10101010] },
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
            console.log("✅ All bit count tests passed!");
            return true;
        } else {
            console.error("❌ Some bit count tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing bit count:', error);
        return false;
    }
}

export default testBitCnt;