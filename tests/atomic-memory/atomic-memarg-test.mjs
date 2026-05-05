import assert from "node:assert";
import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

export default async function testAtomicMemarg() {
	const wasm = compileToWASM(
		parseWAT(`(module
  (memory 1 1 shared)
  (func (export "store_load") (param $addr i32) (param $value i32) (result i32)
    local.get $addr
    local.get $value
    i32.atomic.store offset=4 align=2
    local.get $addr
    i32.atomic.load offset=4 align=2
  )
)`),
	);

	assert.ok(WebAssembly.validate(wasm), "atomic memarg module should validate");

	const { instance } = await WebAssembly.instantiate(wasm);
	assert.strictEqual(instance.exports.store_load(0, 0x12345678), 0x12345678);

	return true;
}
