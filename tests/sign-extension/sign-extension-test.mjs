import { readTestData } from "../test-utils.mjs";

async function testSignExtension(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"sign-extension/sign-extension.wat",
			debug,
		);
		const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

		const tests = [
			{
				name: "i32_extend8_s_positive",
				expected: 0x0000007F,
				func: "i32_extend8_s_positive",
				params: [],
			},
			{
				name: "i32_extend8_s_negative",
				expected: -1,
				func: "i32_extend8_s_negative",
				params: [],
			},
			{
				name: "i32_extend8_s_zero",
				expected: 0,
				func: "i32_extend8_s_zero",
				params: [],
			},
			{
				name: "i32_extend8_s_max_positive",
				expected: 127,
				func: "i32_extend8_s_max_positive",
				params: [],
			},
			{
				name: "i32_extend8_s_max_negative",
				expected: -128,
				func: "i32_extend8_s_max_negative",
				params: [],
			},
			{
				name: "i32_extend16_s_positive",
				expected: 0x00007FFF,
				func: "i32_extend16_s_positive",
				params: [],
			},
			{
				name: "i32_extend16_s_negative",
				expected: -1,
				func: "i32_extend16_s_negative",
				params: [],
			},
			{
				name: "i32_extend16_s_zero",
				expected: 0,
				func: "i32_extend16_s_zero",
				params: [],
			},
			{
				name: "i32_extend16_s_max_positive",
				expected: 32767,
				func: "i32_extend16_s_max_positive",
				params: [],
			},
			{
				name: "i32_extend16_s_max_negative",
				expected: -32768,
				func: "i32_extend16_s_max_negative",
				params: [],
			},
			{
				name: "i64_extend8_s_positive",
				expected: BigInt(0x000000000000007F),
				func: "i64_extend8_s_positive",
				params: [],
			},
			{
				name: "i64_extend8_s_negative",
				expected: BigInt(-1),
				func: "i64_extend8_s_negative",
				params: [],
			},
			{
				name: "i64_extend8_s_zero",
				expected: BigInt(0),
				func: "i64_extend8_s_zero",
				params: [],
			},
			{
				name: "i64_extend8_s_max_positive",
				expected: BigInt(127),
				func: "i64_extend8_s_max_positive",
				params: [],
			},
			{
				name: "i64_extend8_s_max_negative",
				expected: BigInt(-128),
				func: "i64_extend8_s_max_negative",
				params: [],
			},
			{
				name: "i64_extend16_s_positive",
				expected: BigInt(0x0000000000007FFF),
				func: "i64_extend16_s_positive",
				params: [],
			},
			{
				name: "i64_extend16_s_negative",
				expected: BigInt(-1),
				func: "i64_extend16_s_negative",
				params: [],
			},
			{
				name: "i64_extend16_s_zero",
				expected: BigInt(0),
				func: "i64_extend16_s_zero",
				params: [],
			},
			{
				name: "i64_extend16_s_max_positive",
				expected: BigInt(32767),
				func: "i64_extend16_s_max_positive",
				params: [],
			},
			{
				name: "i64_extend16_s_max_negative",
				expected: BigInt(-32768),
				func: "i64_extend16_s_max_negative",
				params: [],
			},
			{
				name: "i64_extend32_s_positive",
				expected: BigInt(0x000000007FFFFFFF),
				func: "i64_extend32_s_positive",
				params: [],
			},
			{
				name: "i64_extend32_s_negative",
				expected: BigInt(-1),
				func: "i64_extend32_s_negative",
				params: [],
			},
			{
				name: "i64_extend32_s_zero",
				expected: BigInt(0),
				func: "i64_extend32_s_zero",
				params: [],
			},
			{
				name: "i64_extend32_s_max_positive",
				expected: BigInt(2147483647),
				func: "i64_extend32_s_max_positive",
				params: [],
			},
			{
				name: "i64_extend32_s_max_negative",
				expected: BigInt(-2147483648),
				func: "i64_extend32_s_max_negative",
				params: [],
			},
		];

		const results = [];
		for (const { name, expected, func, params } of tests) {
			const result = instance.exports[func](...params);

			const resultRes = result === expected;
			console.assert(
				resultRes,
				`❌ ${name} should return ${expected}, got ${result}`,
			);
			results.push(resultRes);
			if (resultRes) {
				console.log(`✅ ${name} test passed!`);
			} else {
				console.error(`❌ ${name} test failed.`);
			}
		}

		const allTestsPassed = results.every((result) => result);
		if (allTestsPassed) {
			console.log("✅ All sign extension tests passed!");
			return true;
		}
		console.error("❌ Some sign extension tests failed.");
		return false;
	} catch (error) {
		console.error(`❌ Error in sign extension test: ${error}`);
		return false;
	}
}

export default testSignExtension;
