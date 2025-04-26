import { readTestData } from "../test-utils.mjs";

async function testEncodingi32(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('encoding-i32/encoding-i32.wat', debug);

        // Instantiate the WASM module
        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

        const tests = [
            { name: "encode_small", expected: 10, func: "encode_small" },
            { name: "encode_big", expected: 165000, func: "encode_big" },
            { name: "encode_negative", expected: -1000, func: "encode_negative" },
            { name: "encode_hex", expected: 0x0, func: "encode_hex" },
            { name: "encode_hexier", expected: 0xFF, func: "encode_hexier" },
        ];

        let results = [];
        for (const { name, expected, func } of tests) {
            const result = instance.exports[func]();
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
            console.log("✅ All encoding tests passed!");
            return true;
        } else {
            console.error("❌ Some encoding tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing encoding_i32:', error);
        return false;
    }
}

export default testEncodingi32;