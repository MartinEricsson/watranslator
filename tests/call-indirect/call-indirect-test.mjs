import { readTestData } from "../test-utils.mjs";

export async function testCallIndirect(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"call-indirect/call-indirect.wat",
			debug,
		);

		const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

		const tests = [
			{ expected: 2, func: "run", params: [2, 0] },
			{ expected: 2, func: "run", params: [0, 2] },
			{ expected: 4, func: "run", params: [2, 2] },
			{ expected: 10, func: "run", params: [5, 5] },
		];

		console.log(instance.exports);

		const results = [];
		for (const { func, expected, params } of tests) {
			const result = instance.exports[func](...params);

			const resultRes = result === expected;
			console.assert(
				resultRes,
				`❌ ${func} should return ${expected}, got ${result}`,
			);
			results.push(resultRes);
			if (debug) {
				console.log(`Debug: ${func} - Expected: ${expected}, Got: ${result}`);
			}
			if (resultRes) {
				console.log(`✅ ${func} test passed!`);
			} else {
				console.error(`❌ ${func} test failed.`);
			}
		}
		// check if all tests passed
		const allTestsPassed = results.every((result) => result);
		if (allTestsPassed) {
			console.log("✅ All call indirect tests passed!");
			return true;
		}
		console.error("❌ Some call indirect tests failed.");
		return false;
	} catch (error) {
		console.error("❌ Error testing call indirect:", error);
		return false;
	}
}

export async function testCallIndirectMulti(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"call-indirect/call-indirect-multiple.wat",
			debug,
		);

		const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

		const tests = [
			{
				name: "call_indirect_multi_add",
				func: "calc",
				expected: 3,
				params: [1, 2, 0],
			},
			{
				name: "call_indirect_multi_sub",
				func: "calc",
				expected: -1,
				params: [1, 2, 1],
			},
			{
				name: "call_indirect_multi_mul",
				func: "calc",
				expected: 2,
				params: [1, 2, 2],
			},
		];

		const results = [];
		for (const { func, expected, params } of tests) {
			const result = instance.exports[func](...params);

			const resultRes = result === expected;
			console.assert(
				resultRes,
				`❌ ${func} should return ${expected}, got ${result}`,
			);
			results.push(resultRes);
			if (debug) {
				console.log(`Debug: ${func} - Expected: ${expected}, Got: ${result}`);
			}
			if (resultRes) {
				console.log(`✅ ${func} test passed!`);
			} else {
				console.error(`❌ ${func} test failed.`);
			}
		}
		// check if all tests passed
		const allTestsPassed = results.every((result) => result);
		if (allTestsPassed) {
			console.log("✅ All call indirect multi tests passed!");
			return true;
		}
		console.error("❌ Some call indirect multi tests failed.");
		return false;
	} catch (error) {
		console.error("❌ Error testing call indirect multi:", error);
		return false;
	}
}

export async function testCallIndirectLater(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"call-indirect/call-indirect-later.wat",
			debug,
		);

		const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

		const tests = [
			{ name: "call_indirect_later", func: "run", expected: 42, params: [] },
		];

		const results = [];
		for (const { func, expected, params } of tests) {
			const result = instance.exports[func](...params);

			const resultRes = result === expected;
			console.assert(
				resultRes,
				`❌ ${func} should return ${expected}, got ${result}`,
			);
			results.push(resultRes);
			if (debug) {
				console.log(`Debug: ${func} - Expected: ${expected}, Got: ${result}`);
			}
			if (resultRes) {
				console.log(`✅ ${func} test passed!`);
			} else {
				console.error(`❌ ${func} test failed.`);
			}
		}
		// check if all tests passed
		const allTestsPassed = results.every((result) => result);
		if (allTestsPassed) {
			console.log("✅ All call indirect later tests passed!");
			return true;
		}
		console.error("❌ Some call indirect later tests failed.");
		return false;
	} catch (error) {
		console.error("❌ Error testing call indirect later:", error);
		return false;
	}
}
