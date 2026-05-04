import assert from "node:assert";
import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

export default async function testSIMDMemarg() {
	const wasm = compileToWASM(
		parseWAT(`(module
  (memory 1)
  (data (i32.const 16) "\\aa")
  (func (export "load_offset") (result i32)
    i32.const 0
    v128.load offset=16 align=4
    i8x16.extract_lane_u 0
  )
  (func (export "load_lane") (result i32)
    i32.const 0
    v128.const i8x16 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    v128.load8_lane offset=16 10
    i8x16.extract_lane_u 10
  )
)`),
	);

	assert.ok(WebAssembly.validate(wasm), "SIMD memarg module should validate");

	const { instance } = await WebAssembly.instantiate(wasm);
	assert.strictEqual(instance.exports.load_offset(), 0xaa);
	assert.strictEqual(instance.exports.load_lane(), 0xaa);

	return true;
}
