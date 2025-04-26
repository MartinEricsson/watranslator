import { readTestData } from '../test-utils.mjs';

async function testI64Load(debug = false) {
    try {
        const { wasmBuffer, ast } = await readTestData('memory-load/i64-load.wat', debug);

        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

        const tests = [
            { name: "i64.load8_s", expected: 1n, func: "load_i64_8_s", params: [1] },
            { name: "i64.load8_s", expected: -1n, func: "load_i64_8_s", params: [8] },
            { name: "i64.load8_u", expected: 1n, func: "load_i64_8_u", params: [1] },
            { name: "i64.load8_u", expected: 255n, func: "load_i64_8_u", params: [8] },
            { name: "i64.load16_s", expected: 513n, func: "load_i64_16_s", params: [1] },
            { name: "i64.load16_s", expected: -257n, func: "load_i64_16_s", params: [8] },
            { name: "i64.load16_u", expected: 513n, func: "load_i64_16_u", params: [1] },
            { name: "i64.load16_u", expected: 65279n, func: "load_i64_16_u", params: [8] },
            { name: "i64.load32_s", expected: 67305985n, func: "load_i64_32_s", params: [1] },
            { name: "i64.load32_s", expected: 65279n, func: "load_i64_32_s", params: [8] },
            { name: "i64.load32_u", expected: 67305985n, func: "load_i64_32_u", params: [1] },
            { name: "i64.load32_u", expected: 65279n, func: "load_i64_32_u", params: [8] },
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
            console.log("✅ All i64 load tests passed!");
            return true;
        } else {
            console.error("❌ Some i64 load tests failed.");
            return false;
        }


        return true;
    } catch (error) {
        console.error('❌ Error during i64 load tests:', error);
        console.error(error.stack);
        return false;
    }
}

export default testI64Load;