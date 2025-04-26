import { readTestData } from "../test-utils.mjs";

async function i64MathAndOps(debug = false) {
    try {
        console.log("Starting i64 math and ops test...");
        const { wasmBuffer } = await readTestData('i64-math-and-ops/i64-math-and-ops.wat');
        console.log("WASM buffer loaded, size:", wasmBuffer.byteLength);

        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
        if(debug) console.log("Available exports:", Object.keys(instance.exports));

        const tests = [
            { name: "i64_const", expected: BigInt(42), func: "i64_const", params: [] },
            { name: "i64_const_hex", expected: BigInt("0xFF"), func: "i64_const_hex", params: [] },
            { name: "i64_const_large", expected: BigInt("9223372036854775807"), func: "i64_const_large", params: [] },
            { name: "i64_const_small", expected: BigInt("-9223372036854775808"), func: "i64_const_small", params: [] },
            { name: "i64_add", expected: BigInt(84), func: "i64_add", params: [BigInt(42), BigInt(42)] },
            { name: "i64_sub", expected: BigInt(0), func: "i64_sub", params: [BigInt(42), BigInt(42)] },
            { name: "i64_mul", expected: BigInt(1764), func: "i64_mul", params: [BigInt(42), BigInt(42)] },
            { name: "i64_div_s", expected: BigInt(1), func: "i64_div_s", params: [BigInt(42), BigInt(42)] },
            { name: "i64_div_u", expected: BigInt(1), func: "i64_div_u", params: [BigInt(42), BigInt(42)] },
            { name: "i64_rem_s", expected: BigInt(0), func: "i64_rem_s", params: [BigInt(42), BigInt(42)] },
            { name: "i64_rem_u", expected: BigInt(0), func: "i64_rem_u", params: [BigInt(42), BigInt(42)] },
            { name: "i64_and", expected: BigInt(0), func: "i64_and", params: [BigInt(42), BigInt(0)] },
            { name: "i64_or", expected: BigInt(42), func: "i64_or", params: [BigInt(42), BigInt(0)] },
            { name: "i64_xor", expected: BigInt(42), func: "i64_xor", params: [BigInt(42), BigInt(0)] },
            // Fix i64_shl test to use a simple value with a predictable result
            { name: "i64_shl", expected: BigInt(42) << BigInt(1), func: "i64_shl", params: [BigInt(42), BigInt(1)] },
            {
                name: "i64_shr_s", expected: BigInt("4611686018427387903"), func: "i64_shr_s", params: [
                    BigInt("9223372036854775807"), BigInt(1)]
            },
            {
                name: "i64_shr_u", expected: BigInt("4611686018427387903"), func: "i64_shr_u", params: [
                    BigInt("9223372036854775807"), BigInt(1)]
            },
            { name: "i64_eqz", expected: 1, func: "i64_eqz", params: [BigInt(0)] },
            { name: "i64_eq", expected: 1, func: "i64_eq", params: [BigInt(42), BigInt(42)] },
            { name: "i64_ne", expected: 0, func: "i64_ne", params: [BigInt(42), BigInt(42)] },
            { name: "i64_lt_s", expected: 0, func: "i64_lt_s", params: [BigInt(42), BigInt(42)] },
            { name: "i64_lt_u", expected: 0, func: "i64_lt_u", params: [BigInt(42), BigInt(42)] },
            { name: "i64_gt_s", expected: 0, func: "i64_gt_s", params: [BigInt(42), BigInt(42)] },
            { name: "i64_gt_u", expected: 0, func: "i64_gt_u", params: [BigInt(42), BigInt(42)] },
            { name: "i64_le_s", expected: 1, func: "i64_le_s", params: [BigInt(42), BigInt(42)] },
            { name: "i64_le_u", expected: 1, func: "i64_le_u", params: [BigInt(42), BigInt(42)] },
            { name: "i64_ge_s", expected: 1, func: "i64_ge_s", params: [BigInt(42), BigInt(42)] },
            { name: "i64_ge_u", expected: 1, func: "i64_ge_u", params: [BigInt(42), BigInt(42)] },
            { name: "i64_clz", expected: BigInt(58), func: "i64_clz", params: [BigInt(42)] },
            { name: "i64_ctz", expected: BigInt(1), func: "i64_ctz", params: [BigInt(42)] },
            { name: "i64_popcnt", expected: BigInt(3), func: "i64_popcnt", params: [BigInt(42)] },
            { name: "i64_trunc_f32_s", expected: BigInt(-42), func: "i64_trunc_f32_s", params: [-42.5] },
            { name: "i64_trunc_f32_u", expected: BigInt(42), func: "i64_trunc_f32_u", params: [42.5] },
            { name: "i64_trunc_f64_s", expected: BigInt(-42), func: "i64_trunc_f64_s", params: [-42.5] },
            { name: "i64_trunc_f64_u", expected: BigInt(42), func: "i64_trunc_f64_u", params: [42.5] },
            {name:"i64_extend8_s", expected: BigInt(-1), func: "i64_extend8_s", params: [BigInt(0xFF)]},
            {name:"i64_extend16_s", expected: BigInt(-1), func: "i64_extend16_s", params: [BigInt(0xFFFF)]},
            {name:"i64_extend32_s", expected: BigInt(-1), func: "i64_extend32_s", params: [BigInt(0xFFFFFFFF)]},
            {name:"i64_extend_i32_s", expected: BigInt(-1), func: "i64_extend_i32_s", params: [-1]},
            {name:"i64_extend_i32_u", expected: BigInt(4294967295), func: "i64_extend_i32_u", params: [-1]},
        ];

        console.log("Running tests:");
        let results = [];
        for (const { name, expected, func, params } of tests) {
            console.log(`Testing ${name} (${func}):`);
            console.log(`- Expected: ${expected} (${typeof expected})`);

            if (!instance.exports[func]) {
                console.error(`❌ Function ${func} not found in exports!`);
                results.push(false);
                continue;
            }

            const result = instance.exports[func](...params);
            console.log(`- Result:   ${result} (${typeof result})`);

            const resultRes = result === expected;
            console.log(`- Match:    ${resultRes ? '✅ Yes' : '❌ No'}`);

            console.assert(resultRes, `❌ ${name} should return ${expected}, got ${result}`);
            results.push(resultRes);
            if (resultRes) {
                console.log(`✅ ${name} test passed!`);
            } else {
                console.error(`❌ ${name} test failed.`);
            }
            console.log(""); // Empty line for readability
        }

        // check if all tests passed
        const allTestsPassed = results.every(result => result);
        if (allTestsPassed) {
            console.log("✅ All i64 math and ops tests passed!");
            return true;
        } else {
            console.error("❌ Some i64 math and ops tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing i64 math and ops:', error);
        console.error(error.stack);
        return false;
    }
}

export default i64MathAndOps;