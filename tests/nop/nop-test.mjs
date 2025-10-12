import { readTestData } from "../test-utils.mjs";

async function testNop(debug = false) {
	try {
		const { wasmBuffer } = await readTestData("nop/nop.wat", debug);

		const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

		const tests = [
			{ name: "single_nop", fn: instance.exports.single_nop, args: [], expected: 42 },
			{ name: "multiple_nops", fn: instance.exports.multiple_nops, args: [], expected: 123 },
			{ name: "nop_in_block", fn: instance.exports.nop_in_block, args: [], expected: 99 },
			{ name: "nop_in_if(1)", fn: instance.exports.nop_in_if, args: [1], expected: 1 },
			{ name: "nop_in_if(0)", fn: instance.exports.nop_in_if, args: [0], expected: 0 },
			{ name: "nop_in_loop", fn: instance.exports.nop_in_loop, args: [], expected: 3 },
			{ name: "nop_stack_neutral", fn: instance.exports.nop_stack_neutral, args: [], expected: 30 },
		];

		let allPassed = true;

		for (const test of tests) {
			const result = test.fn(...test.args);
			if (result === test.expected) {
				console.log(`✅ ${test.name}() → ${result}`);
			} else {
				console.error(`❌ ${test.name}() failed: Expected ${test.expected}, got ${result}`);
				allPassed = false;
			}
		}

		if (allPassed) {
			console.log("✅ All nop instruction tests passed");
			return true;
		}
		console.error("❌ Some nop instruction tests failed");
		return false;
	} catch (error) {
		console.error("❌ Test failed:", error);
		return false;
	}
}

export default testNop;
