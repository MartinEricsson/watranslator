import assert from "node:assert";
import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

/**
 * Verifies that i64.load16_s/u and i64.load32_s/u use the correct natural
 * alignment (1 and 2 respectively) when no align= attribute is specified.
 *
 * Previously these defaulted to align=0 which is wrong — the WebAssembly spec
 * requires natural alignment: 2^1=2 bytes for 16-bit loads, 2^2=4 bytes for
 * 32-bit loads.
 */
export default async function testI64LoadDefaultAlign() {
	const wasm = compileToWASM(
		parseWAT(`(module
  (memory 1)
  (export "memory" (memory 0))
  (func (export "load16_s") (param $addr i32) (result i64)
    local.get $addr
    i64.load16_s
  )
  (func (export "load16_u") (param $addr i32) (result i64)
    local.get $addr
    i64.load16_u
  )
  (func (export "load32_s") (param $addr i32) (result i64)
    local.get $addr
    i64.load32_s
  )
  (func (export "load32_u") (param $addr i32) (result i64)
    local.get $addr
    i64.load32_u
  )
)`),
	);

	assert.ok(
		WebAssembly.validate(wasm),
		"i64 load default-align module should validate",
	);

	const { instance } = await WebAssembly.instantiate(wasm);

	// Write known bytes at offset 0: 01 02 03 04 05 06 07 08
	const mem = new Uint8Array(instance.exports.memory.buffer);
	mem.set([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);

	// i64.load16 at addr=0: reads little-endian 0x0201 = 513
	assert.strictEqual(
		instance.exports.load16_s(0),
		513n,
		"load16_s default align",
	);
	assert.strictEqual(
		instance.exports.load16_u(0),
		513n,
		"load16_u default align",
	);

	// i64.load32 at addr=0: reads little-endian 0x04030201 = 67305985
	assert.strictEqual(
		instance.exports.load32_s(0),
		67305985n,
		"load32_s default align",
	);
	assert.strictEqual(
		instance.exports.load32_u(0),
		67305985n,
		"load32_u default align",
	);

	return true;
}
