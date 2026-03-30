import { readTestData } from "../test-utils.mjs";

async function testReinterpretOps(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"reinterpret-ops/reinterpret-ops.wat",
			debug,
		);

		const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

		const tests = [
			// i32.reinterpret_f32 tests
			{
				name: "i32.reinterpret_f32 (0.0)",
				expected: 0x00000000,
				func: "i32_reinterpret_f32",
				params: [0.0],
			},
			{
				name: "i32.reinterpret_f32 (1.0)",
				expected: 0x3f800000,
				func: "i32_reinterpret_f32",
				params: [1.0],
			},
			{
				name: "i32.reinterpret_f32 (-1.0)",
				expected: 0xbf800000,
				func: "i32_reinterpret_f32",
				params: [-1.0],
			},
			{
				name: "i32.reinterpret_f32 (Infinity)",
				expected: 0x7f800000,
				func: "i32_reinterpret_f32",
				params: [Number.POSITIVE_INFINITY],
			},
			{
				name: "i32.reinterpret_f32 (-Infinity)",
				expected: 0xff800000,
				func: "i32_reinterpret_f32",
				params: [Number.NEGATIVE_INFINITY],
			},
			{
				name: "f32_to_i32_zero",
				expected: 0x00000000,
				func: "f32_to_i32_zero",
				params: [],
			},
			{
				name: "f32_to_i32_one",
				expected: 0x3f800000,
				func: "f32_to_i32_one",
				params: [],
			},
			{
				name: "f32_to_i32_neg_one",
				expected: 0xbf800000,
				func: "f32_to_i32_neg_one",
				params: [],
			},

			// f32.reinterpret_i32 tests
			{
				name: "f32.reinterpret_i32 (0x00000000)",
				expected: 0.0,
				func: "f32_reinterpret_i32",
				params: [0x00000000],
			},
			{
				name: "f32.reinterpret_i32 (0x3F800000)",
				expected: 1.0,
				func: "f32_reinterpret_i32",
				params: [0x3f800000],
			},
			{
				name: "f32.reinterpret_i32 (0xBF800000)",
				expected: -1.0,
				func: "f32_reinterpret_i32",
				params: [0xbf800000],
			},
			{
				name: "f32.reinterpret_i32 (0x7F800000)",
				expected: Number.POSITIVE_INFINITY,
				func: "f32_reinterpret_i32",
				params: [0x7f800000],
			},
			{
				name: "f32.reinterpret_i32 (0xFF800000)",
				expected: Number.NEGATIVE_INFINITY,
				func: "f32_reinterpret_i32",
				params: [0xff800000],
			},
			{
				name: "i32_to_f32_zero",
				expected: 0.0,
				func: "i32_to_f32_zero",
				params: [],
			},
			{
				name: "i32_to_f32_one",
				expected: 1.0,
				func: "i32_to_f32_one",
				params: [],
			},
			{
				name: "i32_to_f32_neg_one",
				expected: -1.0,
				func: "i32_to_f32_neg_one",
				params: [],
			},
			{
				name: "i32_to_f32_infinity",
				expected: Number.POSITIVE_INFINITY,
				func: "i32_to_f32_infinity",
				params: [],
			},
			{
				name: "i32_to_f32_neg_infinity",
				expected: Number.NEGATIVE_INFINITY,
				func: "i32_to_f32_neg_infinity",
				params: [],
			},

			// f64.reinterpret_i64 tests
			{
				name: "f64.reinterpret_i64 (0x0000000000000000)",
				expected: 0.0,
				func: "f64_reinterpret_i64",
				params: [0x0000000000000000n],
			},
			{
				name: "f64.reinterpret_i64 (0x3FF0000000000000)",
				expected: 1.0,
				func: "f64_reinterpret_i64",
				params: [0x3ff0000000000000n],
			},
			{
				name: "f64.reinterpret_i64 (0xBFF0000000000000)",
				expected: -1.0,
				func: "f64_reinterpret_i64",
				params: [0xbff0000000000000n],
			},
			{
				name: "f64.reinterpret_i64 (0x7FF0000000000000)",
				expected: Number.POSITIVE_INFINITY,
				func: "f64_reinterpret_i64",
				params: [0x7ff0000000000000n],
			},
			{
				name: "f64.reinterpret_i64 (0xFFF0000000000000)",
				expected: Number.NEGATIVE_INFINITY,
				func: "f64_reinterpret_i64",
				params: [0xfff0000000000000n],
			},
			{
				name: "i64_to_f64_zero",
				expected: 0.0,
				func: "i64_to_f64_zero",
				params: [],
			},
			{
				name: "i64_to_f64_one",
				expected: 1.0,
				func: "i64_to_f64_one",
				params: [],
			},
			{
				name: "i64_to_f64_neg_one",
				expected: -1.0,
				func: "i64_to_f64_neg_one",
				params: [],
			},
			{
				name: "i64_to_f64_infinity",
				expected: Number.POSITIVE_INFINITY,
				func: "i64_to_f64_infinity",
				params: [],
			},
			{
				name: "i64_to_f64_neg_infinity",
				expected: Number.NEGATIVE_INFINITY,
				func: "i64_to_f64_neg_infinity",
				params: [],
			},

			// Round-trip tests for i32 <-> f32
			{
				name: "roundtrip_f32_to_i32_to_f32 (1.0)",
				expected: 0x3f800000,
				func: "roundtrip_f32_to_i32_to_f32",
				params: [1.0],
			},
			{
				name: "roundtrip_f32_to_i32_to_f32 (0.0)",
				expected: 0x00000000,
				func: "roundtrip_f32_to_i32_to_f32",
				params: [0.0],
			},
			{
				name: "roundtrip_f32_to_i32_to_f32 (-1.0)",
				expected: 0xbf800000,
				func: "roundtrip_f32_to_i32_to_f32",
				params: [-1.0],
			},
			{
				name: "roundtrip_i32_to_f32_to_i32 (0x3F800000)",
				expected: 0x3f800000,
				func: "roundtrip_i32_to_f32_to_i32",
				params: [0x3f800000],
			},
			{
				name: "roundtrip_i32_to_f32_to_i32 (0x00000000)",
				expected: 0x00000000,
				func: "roundtrip_i32_to_f32_to_i32",
				params: [0x00000000],
			},
			{
				name: "roundtrip_i32_to_f32_to_i32 (0xBF800000)",
				expected: 0xbf800000,
				func: "roundtrip_i32_to_f32_to_i32",
				params: [0xbf800000],
			},

			// Round-trip tests for i64 <-> f64
			{
				name: "roundtrip_f64_to_i64_to_f64 (1.0)",
				expected: 0x3ff0000000000000n,
				func: "roundtrip_f64_to_i64_to_f64",
				params: [1.0],
			},
			{
				name: "roundtrip_f64_to_i64_to_f64 (0.0)",
				expected: 0x0000000000000000n,
				func: "roundtrip_f64_to_i64_to_f64",
				params: [0.0],
			},
			{
				name: "roundtrip_f64_to_i64_to_f64 (-1.0)",
				expected: 0xbff0000000000000n,
				func: "roundtrip_f64_to_i64_to_f64",
				params: [-1.0],
			},
			{
				name: "roundtrip_i64_to_f64_to_i64 (0x3FF0000000000000)",
				expected: 0x3ff0000000000000n,
				func: "roundtrip_i64_to_f64_to_i64",
				params: [0x3ff0000000000000n],
			},
			{
				name: "roundtrip_i64_to_f64_to_i64 (0x0000000000000000)",
				expected: 0x0000000000000000n,
				func: "roundtrip_i64_to_f64_to_i64",
				params: [0x0000000000000000n],
			},
			{
				name: "roundtrip_i64_to_f64_to_i64 (0xBFF0000000000000)",
				expected: 0xbff0000000000000n,
				func: "roundtrip_i64_to_f64_to_i64",
				params: [0xbff0000000000000n],
			},
		];

		const results = [];

		for (const { name, expected, expectedNaN, func, params } of tests) {
			const result = instance.exports[func](...params);

			let passed;
			if (expectedNaN) {
				passed = Number.isNaN(result);
				console.log(
					`${name}: result=NaN, expected=NaN - ${passed ? "✅" : "❌"}`,
				);
			} else if (Object.is(expected, -0.0)) {
				passed = Object.is(result, -0.0);
				console.log(
					`${name}: result=${result} (negative zero?: ${passed}), expected=-0.0 - ${passed ? "✅" : "❌"}`,
				);
			} else {
				// Convert i32 results to unsigned for comparison
				const normalizedResult =
					typeof result === "number" &&
					Number.isInteger(result) &&
					typeof expected === "number" &&
					Number.isInteger(expected)
						? result >>> 0
						: typeof result === "bigint"
							? BigInt.asUintN(64, result)
							: result;
				const normalizedExpected =
					typeof expected === "number" && Number.isInteger(expected)
						? expected >>> 0
						: typeof expected === "bigint"
							? BigInt.asUintN(64, expected)
							: expected;

				passed = Object.is(normalizedResult, normalizedExpected);
				const resultStr =
					typeof result === "bigint"
						? `0x${BigInt.asUintN(64, result).toString(16).toUpperCase()}`
						: typeof result === "number" && Number.isInteger(result)
							? `0x${(result >>> 0).toString(16).toUpperCase()}`
							: result.toString();
				const expectedStr =
					typeof expected === "bigint"
						? `0x${BigInt.asUintN(64, expected).toString(16).toUpperCase()}`
						: typeof expected === "number" && Number.isInteger(expected)
							? `0x${expected.toString(16).toUpperCase()}`
							: expected.toString();
				console.log(
					`${name}: result=${resultStr}, expected=${expectedStr} - ${passed ? "✅" : "❌"}`,
				);
			}

			results.push(passed);
			if (!passed) {
				console.error(`❌ ${name} test failed.`);
			}
		}

		// Test NaN separately - any NaN pattern is valid (sign bit can vary, mantissa must be non-zero)
		// We test this by verifying the reinterpret of a NaN float produces a valid NaN bit pattern
		const nanTestResult = instance.exports.i32_reinterpret_f32(Number.NaN);
		const nanPassed =
			(nanTestResult & 0x7f800000) === 0x7f800000 &&
			(nanTestResult & 0x007fffff) !== 0;
		console.log(
			`i32.reinterpret_f32(NaN): result=0x${(nanTestResult >>> 0).toString(16).toUpperCase()}, NaN pattern check - ${nanPassed ? "✅" : "❌"}`,
		);
		results.push(nanPassed);

		const allTestsPassed = results.every((result) => result);
		if (allTestsPassed) {
			console.log("✅ All reinterpret operation tests passed!");
			return true;
		}
		console.error("❌ Some reinterpret operation tests failed.");
		return false;
	} catch (error) {
		console.error("Error during reinterpret operations test:", error);
		console.error(error.stack);
		return false;
	}
}

export default testReinterpretOps;
