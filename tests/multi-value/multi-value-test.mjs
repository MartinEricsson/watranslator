import { readTestData } from "../test-utils.mjs";

async function testMultiValue() {
    try {
        const { wasmBuffer } = await readTestData('multi-value/multi-value.wat');

        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

        const tests = [
            { name: 'multi_value', expected: [1, 2], func: 'multi_value', params: [] },
            { name: 'multi_value_block', expected: [42, 7], func: 'multi_block', params: [] },
            { name: 'multi_value_if', expected: [3, 4], func: 'multi_if', params: [0] },
            { name: 'multi_value_if', expected: [1, 2], func: 'multi_if', params: [1] },
            { name: 'multi_value_br', expected: [5, 6], func: 'multi_br', params: [] },
        ];

        let results = [];
        for (const { name, expected, func, params } of tests) {
            const result = instance.exports[func](...params);

            // Check if the expected value is an array (for multi-value return)
            let resultRes = false;
            if (Array.isArray(expected)) {
                // Generated by 🤖
                // For multi-value returns in WASM, the result is not a standard array 
                // but a Results object that's array-like
                const resultArray = Array.from(result);
                resultRes = resultArray.length === expected.length &&
                            expected.every((val, idx) => {
                                // Convert BigInt to Number for comparison if needed
                                const resultVal = typeof resultArray[idx] === 'bigint' ? 
                                    Number(resultArray[idx]) : resultArray[idx];
                                
                                return resultVal === val;
                            });
                
                console.log(`Result: [${Array.from(result)}], Expected: [${expected}]`);
            } else {
                // For single value returns, direct comparison
                resultRes = result === expected;
            }

            console.assert(resultRes, `❌ ${name} should return ${expected}, got ${result}`);
            results.push(resultRes);
            if (resultRes) {
                console.log(`✅ ${name} test passed!`);
            } else {
                console.error(`❌ ${name} test failed.`);
            }
        }
         // check if all tests passed
         const allTestsPassed = results.every(result => result);
         if (allTestsPassed) {
             console.log("✅ All multi-value tests passed!");
             return true;
         } else {
             console.error("❌ Some multi-value tests failed.");
             return false;
         }
    } catch (error) {
        console.error(`❌ Error in multi-value test: ${error}`);
        return false;
    }
}

export default testMultiValue;