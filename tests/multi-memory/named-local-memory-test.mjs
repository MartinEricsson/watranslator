import assert from "node:assert";
import { compile } from "../../src/index.mjs";

export default async function testNamedLocalMemory() {
	try {
		const wat = `(module
  (memory $m 1)
  (data (i32.const 0) "\\42")
  (func (export "read") (result i32)
    i32.const 0
    i32.load (memory $m)))`;

		const binary = await compile(wat);
		assert.strictEqual(WebAssembly.validate(binary), true);

		const { instance } = await WebAssembly.instantiate(binary);
		assert.strictEqual(instance.exports.read(), 0x42);

		return true;
	} catch (error) {
		console.error("Named local memory test failed:", error);
		return false;
	}
}
