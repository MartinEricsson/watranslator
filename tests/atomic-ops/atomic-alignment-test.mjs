import assert from "node:assert";
import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";
import { expectCompileError } from "../test-utils.mjs";

const RMW_CASES = [
	["i32.atomic.rmw.add", 0x1e, 2],
	["i64.atomic.rmw.add", 0x1f, 3],
	["i32.atomic.rmw8.add_u", 0x20, 0],
	["i32.atomic.rmw16.add_u", 0x21, 1],
	["i64.atomic.rmw8.add_u", 0x22, 0],
	["i64.atomic.rmw16.add_u", 0x23, 1],
	["i64.atomic.rmw32.add_u", 0x24, 2],
	["i32.atomic.rmw.sub", 0x25, 2],
	["i64.atomic.rmw.sub", 0x26, 3],
	["i32.atomic.rmw8.sub_u", 0x27, 0],
	["i32.atomic.rmw16.sub_u", 0x28, 1],
	["i64.atomic.rmw8.sub_u", 0x29, 0],
	["i64.atomic.rmw16.sub_u", 0x2a, 1],
	["i64.atomic.rmw32.sub_u", 0x2b, 2],
	["i32.atomic.rmw.and", 0x2c, 2],
	["i64.atomic.rmw.and", 0x2d, 3],
	["i32.atomic.rmw8.and_u", 0x2e, 0],
	["i32.atomic.rmw16.and_u", 0x2f, 1],
	["i64.atomic.rmw8.and_u", 0x30, 0],
	["i64.atomic.rmw16.and_u", 0x31, 1],
	["i64.atomic.rmw32.and_u", 0x32, 2],
	["i32.atomic.rmw.or", 0x33, 2],
	["i64.atomic.rmw.or", 0x34, 3],
	["i32.atomic.rmw8.or_u", 0x35, 0],
	["i32.atomic.rmw16.or_u", 0x36, 1],
	["i64.atomic.rmw8.or_u", 0x37, 0],
	["i64.atomic.rmw16.or_u", 0x38, 1],
	["i64.atomic.rmw32.or_u", 0x39, 2],
	["i32.atomic.rmw.xor", 0x3a, 2],
	["i64.atomic.rmw.xor", 0x3b, 3],
	["i32.atomic.rmw8.xor_u", 0x3c, 0],
	["i32.atomic.rmw16.xor_u", 0x3d, 1],
	["i64.atomic.rmw8.xor_u", 0x3e, 0],
	["i64.atomic.rmw16.xor_u", 0x3f, 1],
	["i64.atomic.rmw32.xor_u", 0x40, 2],
	["i32.atomic.rmw.xchg", 0x41, 2],
	["i64.atomic.rmw.xchg", 0x42, 3],
	["i32.atomic.rmw8.xchg_u", 0x43, 0],
	["i32.atomic.rmw16.xchg_u", 0x44, 1],
	["i64.atomic.rmw8.xchg_u", 0x45, 0],
	["i64.atomic.rmw16.xchg_u", 0x46, 1],
	["i64.atomic.rmw32.xchg_u", 0x47, 2],
	["i32.atomic.rmw.cmpxchg", 0x48, 2],
	["i64.atomic.rmw.cmpxchg", 0x49, 3],
	["i32.atomic.rmw8.cmpxchg_u", 0x4a, 0],
	["i32.atomic.rmw16.cmpxchg_u", 0x4b, 1],
	["i64.atomic.rmw8.cmpxchg_u", 0x4c, 0],
	["i64.atomic.rmw16.cmpxchg_u", 0x4d, 1],
	["i64.atomic.rmw32.cmpxchg_u", 0x4e, 2],
];

function compileWat(wat) {
	return compileToWASM(parseWAT(wat));
}

function bytesInclude(bytes, sequence) {
	for (let i = 0; i <= bytes.length - sequence.length; i++) {
		if (sequence.every((byte, offset) => bytes[i + offset] === byte)) {
			return true;
		}
	}
	return false;
}

function watForRmw(op, alignAttribute = "") {
	const isI64 = op.startsWith("i64.");
	const valueType = isI64 ? "i64" : "i32";
	const valueConst = isI64 ? "i64.const 1" : "i32.const 1";
	const hasCmpxchg = op.includes("cmpxchg");

	return `(module
  (memory 1 1 shared)
  (func (export "run") (param $addr i32) (result ${valueType})
    local.get $addr
    ${valueConst}
    ${hasCmpxchg ? `${valueConst}\n    ` : ""}${op}${alignAttribute}
  )
)`;
}

export default async function testAtomicAlignment() {
	for (const [op, opcode, naturalAlign] of RMW_CASES) {
		const wasm = compileWat(watForRmw(op));
		assert.ok(
			bytesInclude(wasm, [0xfe, opcode, naturalAlign, 0x00]),
			`${op} should encode default natural align ${naturalAlign}`,
		);
	}

	assert.ok(
		WebAssembly.validate(
			compileWat(watForRmw("i32.atomic.rmw.add", " align=2")),
		),
		"explicit matching RMW alignment should validate",
	);
	assert.ok(
		WebAssembly.validate(
			compileWat(`(module
  (memory 1 1 shared)
  (func (export "run") (param $addr i32) (result i64)
    local.get $addr
    i64.atomic.load align=3
  )
)`),
		),
		"explicit matching atomic load alignment should validate",
	);

	await expectCompileError(
		watForRmw("i32.atomic.rmw.add", " align=1"),
		/atomic alignment/i,
	);
	await expectCompileError(
		`(module
  (memory 1 1 shared)
  (func (export "run") (param $addr i32) (result i64)
    local.get $addr
    i64.atomic.load align=2
  )
)`,
		/atomic alignment/i,
	);
	await expectCompileError(
		`(module
  (memory 1 1 shared)
  (func (export "run") (param $addr i32) (param $value i32)
    local.get $addr
    local.get $value
    i32.atomic.store8 align=1
  )
)`,
		/atomic alignment/i,
	);

	return true;
}
