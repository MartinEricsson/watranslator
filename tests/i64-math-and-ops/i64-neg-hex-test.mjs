import assert from "node:assert";
import { readTestData } from "../test-utils.mjs";

async function testI64NegHex(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"i64-math-and-ops/i64-neg-hex.wat",
			debug,
		);
		const { instance } = await WebAssembly.instantiate(wasmBuffer, {});

		assert.strictEqual(
			instance.exports.neg_one_hex(),
			-1n,
			"i64.const -0x1 should equal -1n",
		);

		assert.strictEqual(
			instance.exports.neg_large_hex(),
			-0xDEADBEEFn,
			"i64.const -0xDEADBEEF should equal -0xDEADBEEFn",
		);

		console.log("✅ i64.const negative hex tests passed");
		return true;
	} catch (e) {
		console.error("❌ i64.const negative hex test failed:", e.message);
		return false;
	}
}

export default testI64NegHex;
