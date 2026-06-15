import assert from "node:assert";
import { compile } from "../../src/index.mjs";

export default async function testMemoryInitMulti() {
	try {
		const wat = `(module
  (memory (export "memory") 1)
  (data (i32.const 0) "active")
  (data $first  "\\11\\22\\33")
  (data $second "\\AA\\BB\\CC")
  (func (export "initSecond") (param i32)
    local.get 0
    i32.const 0
    i32.const 3
    memory.init $second)
  (func (export "read") (param i32) (result i32)
    local.get 0
    i32.load8_u))`;

		const binary = await compile(wat);
		assert.strictEqual(WebAssembly.validate(binary), true);

		const { instance } = await WebAssembly.instantiate(binary);
		instance.exports.initSecond(50);
		assert.strictEqual(instance.exports.read(50), 0xaa);
		assert.strictEqual(instance.exports.read(51), 0xbb);
		assert.strictEqual(instance.exports.read(52), 0xcc);

		return true;
	} catch (error) {
		console.error("Memory init multi segment test failed:", error);
		return false;
	}
}
