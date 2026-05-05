import assert from "node:assert";
import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

function bytesInclude(bytes, sequence) {
	for (let i = 0; i <= bytes.length - sequence.length; i++) {
		if (sequence.every((byte, offset) => bytes[i + offset] === byte)) {
			return true;
		}
	}
	return false;
}

export default async function testMultiMemoryMemargEncoding() {
	const wasm = compileToWASM(
		parseWAT(`(module
  (memory $m0 1)
  (memory $m1 1)
  (func (export "load_m1") (param $addr i32) (result i32)
    local.get $addr
    i32.load (memory $m1)
  )
)`),
	);

	assert.ok(
		WebAssembly.validate(wasm),
		"multi-memory memarg fixture should validate",
	);
	assert.ok(
		bytesInclude(wasm, [0x28, 0x42, 0x01, 0x00]),
		"i32.load $m1 should encode as opcode, flags|0x40, memidx, offset",
	);

	return true;
}
