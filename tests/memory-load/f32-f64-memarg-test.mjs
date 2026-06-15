import assert from "node:assert";
import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

export default async function testF32F64Memarg() {
	const wasm = compileToWASM(
		parseWAT(`(module
  (memory 1)
  (func (export "store_f32") (param $value f32)
    i32.const 0
    local.get $value
    f32.store offset=8 align=4
  )
  (func (export "load_f32") (result f32)
    i32.const 0
    f32.load offset=8 align=4
  )
  (func (export "store_f64") (param $value f64)
    i32.const 0
    local.get $value
    f64.store offset=16 align=8
  )
  (func (export "load_f64") (result f64)
    i32.const 0
    f64.load offset=16 align=8
  )
)`),
	);

	assert.ok(
		WebAssembly.validate(wasm),
		"f32/f64 memarg module should validate",
	);

	const { instance } = await WebAssembly.instantiate(wasm);
	instance.exports.store_f32(1.5);
	assert.strictEqual(instance.exports.load_f32(), 1.5);

	instance.exports.store_f64(Math.PI);
	assert.strictEqual(instance.exports.load_f64(), Math.PI);

	return true;
}
