import { readTestData } from "../test-utils.mjs";

async function testNonTrappingConversions(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"non-trapping-conversions/non-trapping-conversions.wat",
			debug,
		);

		const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

		const tests = [
			// i32.trunc_sat_f32_s tests
			{
				name: "i32_trunc_sat_f32_s normal conversion",
				expected: 42,
				func: "i32_trunc_sat_f32_s",
				params: [42.5],
			},
			{
				name: "i32_trunc_sat_f32_s negative",
				expected: -42,
				func: "i32_trunc_sat_f32_s",
				params: [-42.5],
			},
			{
				name: "i32_trunc_sat_f32_s NaN to 0",
				expected: 0,
				func: "i32_trunc_sat_f32_s",
				params: [NaN],
			},
			{
				name: "i32_trunc_sat_f32_s +Infinity to max",
				expected: 2147483647,
				func: "i32_trunc_sat_f32_s",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i32_trunc_sat_f32_s -Infinity to min",
				expected: -2147483648,
				func: "i32_trunc_sat_f32_s",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "i32_trunc_sat_f32_s overflow to max",
				expected: 2147483647,
				func: "i32_trunc_sat_f32_s",
				params: [3e9],
			},
			{
				name: "i32_trunc_sat_f32_s underflow to min",
				expected: -2147483648,
				func: "i32_trunc_sat_f32_s",
				params: [-3e9],
			},

			// i32.trunc_sat_f32_u tests
			{
				name: "i32_trunc_sat_f32_u normal conversion",
				expected: 42,
				func: "i32_trunc_sat_f32_u",
				params: [42.5],
			},
			{
				name: "i32_trunc_sat_f32_u NaN to 0",
				expected: 0,
				func: "i32_trunc_sat_f32_u",
				params: [NaN],
			},
			{
				name: "i32_trunc_sat_f32_u +Infinity to max",
				expected: 4294967295,
				func: "i32_trunc_sat_f32_u",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i32_trunc_sat_f32_u -Infinity to 0",
				expected: 0,
				func: "i32_trunc_sat_f32_u",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "i32_trunc_sat_f32_u negative to 0",
				expected: 0,
				func: "i32_trunc_sat_f32_u",
				params: [-1.0],
			},
			{
				name: "i32_trunc_sat_f32_u overflow to max",
				expected: 4294967295,
				func: "i32_trunc_sat_f32_u",
				params: [5e9],
			},

			// i32.trunc_sat_f64_s tests
			{
				name: "i32_trunc_sat_f64_s normal conversion",
				expected: 42,
				func: "i32_trunc_sat_f64_s",
				params: [42.5],
			},
			{
				name: "i32_trunc_sat_f64_s negative",
				expected: -42,
				func: "i32_trunc_sat_f64_s",
				params: [-42.5],
			},
			{
				name: "i32_trunc_sat_f64_s NaN to 0",
				expected: 0,
				func: "i32_trunc_sat_f64_s",
				params: [NaN],
			},
			{
				name: "i32_trunc_sat_f64_s +Infinity to max",
				expected: 2147483647,
				func: "i32_trunc_sat_f64_s",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i32_trunc_sat_f64_s -Infinity to min",
				expected: -2147483648,
				func: "i32_trunc_sat_f64_s",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "i32_trunc_sat_f64_s overflow to max",
				expected: 2147483647,
				func: "i32_trunc_sat_f64_s",
				params: [3e9],
			},
			{
				name: "i32_trunc_sat_f64_s underflow to min",
				expected: -2147483648,
				func: "i32_trunc_sat_f64_s",
				params: [-3e9],
			},

			// i32.trunc_sat_f64_u tests
			{
				name: "i32_trunc_sat_f64_u normal conversion",
				expected: 42,
				func: "i32_trunc_sat_f64_u",
				params: [42.5],
			},
			{
				name: "i32_trunc_sat_f64_u NaN to 0",
				expected: 0,
				func: "i32_trunc_sat_f64_u",
				params: [NaN],
			},
			{
				name: "i32_trunc_sat_f64_u +Infinity to max",
				expected: 4294967295,
				func: "i32_trunc_sat_f64_u",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i32_trunc_sat_f64_u -Infinity to 0",
				expected: 0,
				func: "i32_trunc_sat_f64_u",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "i32_trunc_sat_f64_u negative to 0",
				expected: 0,
				func: "i32_trunc_sat_f64_u",
				params: [-1.0],
			},
			{
				name: "i32_trunc_sat_f64_u overflow to max",
				expected: 4294967295,
				func: "i32_trunc_sat_f64_u",
				params: [5e9],
			},

			// i64.trunc_sat_f32_s tests
			{
				name: "i64_trunc_sat_f32_s normal conversion",
				expected: 42n,
				func: "i64_trunc_sat_f32_s",
				params: [42.5],
			},
			{
				name: "i64_trunc_sat_f32_s negative",
				expected: -42n,
				func: "i64_trunc_sat_f32_s",
				params: [-42.5],
			},
			{
				name: "i64_trunc_sat_f32_s NaN to 0",
				expected: 0n,
				func: "i64_trunc_sat_f32_s",
				params: [NaN],
			},
			{
				name: "i64_trunc_sat_f32_s +Infinity to max",
				expected: 9223372036854775807n,
				func: "i64_trunc_sat_f32_s",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i64_trunc_sat_f32_s -Infinity to min",
				expected: -9223372036854775808n,
				func: "i64_trunc_sat_f32_s",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "i64_trunc_sat_f32_s overflow to max",
				expected: 9223372036854775807n,
				func: "i64_trunc_sat_f32_s",
				params: [1e20],
			},
			{
				name: "i64_trunc_sat_f32_s underflow to min",
				expected: -9223372036854775808n,
				func: "i64_trunc_sat_f32_s",
				params: [-1e20],
			},

			// i64.trunc_sat_f32_u tests
			{
				name: "i64_trunc_sat_f32_u normal conversion",
				expected: 42n,
				func: "i64_trunc_sat_f32_u",
				params: [42.5],
			},
			{
				name: "i64_trunc_sat_f32_u NaN to 0",
				expected: 0n,
				func: "i64_trunc_sat_f32_u",
				params: [NaN],
			},
			{
				name: "i64_trunc_sat_f32_u +Infinity to max",
				expected: -1n, // -1n in BigInt represents max u64 (0xFFFFFFFFFFFFFFFF)
				func: "i64_trunc_sat_f32_u",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i64_trunc_sat_f32_u -Infinity to 0",
				expected: 0n,
				func: "i64_trunc_sat_f32_u",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "i64_trunc_sat_f32_u negative to 0",
				expected: 0n,
				func: "i64_trunc_sat_f32_u",
				params: [-1.0],
			},
			{
				name: "i64_trunc_sat_f32_u overflow to max",
				expected: -1n, // -1n in BigInt represents max u64 (0xFFFFFFFFFFFFFFFF)
				func: "i64_trunc_sat_f32_u",
				params: [1e20],
			},

			// i64.trunc_sat_f64_s tests
			{
				name: "i64_trunc_sat_f64_s normal conversion",
				expected: 42n,
				func: "i64_trunc_sat_f64_s",
				params: [42.5],
			},
			{
				name: "i64_trunc_sat_f64_s negative",
				expected: -42n,
				func: "i64_trunc_sat_f64_s",
				params: [-42.5],
			},
			{
				name: "i64_trunc_sat_f64_s NaN to 0",
				expected: 0n,
				func: "i64_trunc_sat_f64_s",
				params: [NaN],
			},
			{
				name: "i64_trunc_sat_f64_s +Infinity to max",
				expected: 9223372036854775807n,
				func: "i64_trunc_sat_f64_s",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i64_trunc_sat_f64_s -Infinity to min",
				expected: -9223372036854775808n,
				func: "i64_trunc_sat_f64_s",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "i64_trunc_sat_f64_s overflow to max",
				expected: 9223372036854775807n,
				func: "i64_trunc_sat_f64_s",
				params: [1e20],
			},
			{
				name: "i64_trunc_sat_f64_s underflow to min",
				expected: -9223372036854775808n,
				func: "i64_trunc_sat_f64_s",
				params: [-1e20],
			},

			// i64.trunc_sat_f64_u tests
			{
				name: "i64_trunc_sat_f64_u normal conversion",
				expected: 42n,
				func: "i64_trunc_sat_f64_u",
				params: [42.5],
			},
			{
				name: "i64_trunc_sat_f64_u NaN to 0",
				expected: 0n,
				func: "i64_trunc_sat_f64_u",
				params: [NaN],
			},
			{
				name: "i64_trunc_sat_f64_u +Infinity to max",
				expected: -1n, // -1n in BigInt represents max u64 (0xFFFFFFFFFFFFFFFF)
				func: "i64_trunc_sat_f64_u",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i64_trunc_sat_f64_u -Infinity to 0",
				expected: 0n,
				func: "i64_trunc_sat_f64_u",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "i64_trunc_sat_f64_u negative to 0",
				expected: 0n,
				func: "i64_trunc_sat_f64_u",
				params: [-1.0],
			},
			{
				name: "i64_trunc_sat_f64_u overflow to max",
				expected: -1n, // -1n in BigInt represents max u64 (0xFFFFFFFFFFFFFFFF)
				func: "i64_trunc_sat_f64_u",
				params: [1e20],
			},
		];

		const results = [];

		for (const { name, expected, func, params } of tests) {
			const result = instance.exports[func](...params);

			let passed = result === expected;
			
			// Handle unsigned i32 comparison properly
			if (typeof expected === "number" && expected > 2147483647) {
				const unsignedResult = result >>> 0;
				passed = unsignedResult === expected;
			}

			results.push({
				name,
				expected,
				result,
				passed,
			});

			if (!passed) {
				console.error(`❌ ${name}: expected ${expected}, got ${result}`);
			} else if (debug) {
				console.log(`✅ ${name}: ${result}`);
			}
		}

		const failedTests = results.filter((r) => !r.passed);
		if (failedTests.length > 0) {
			console.error(
				`❌ ${failedTests.length} test(s) failed out of ${results.length}`,
			);
			return false;
		}

		console.log(`✅ All ${results.length} non-trapping conversion tests passed!`);
		return true;
	} catch (error) {
		console.error("❌ Error in non-trapping conversions test:", error);
		return false;
	}
}

export default testNonTrappingConversions;
