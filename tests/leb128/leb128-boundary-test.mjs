import assert from "node:assert";
import {
	encodeSLEB128,
	encodeSLEB128BigInt,
	encodeULEB128,
} from "../../src/compile/compile-utils.mjs";
import { compile } from "../../src/index.mjs";

function assertBytes(actual, expected, label) {
	assert.deepStrictEqual(
		Array.from(actual),
		expected,
		`${label} should encode as ${expected.map((byte) => byte.toString(16)).join(" ")}`,
	);
}

function includesSequence(bytes, sequence) {
	for (let index = 0; index <= bytes.length - sequence.length; index++) {
		let matched = true;
		for (let offset = 0; offset < sequence.length; offset++) {
			if (bytes[index + offset] !== sequence[offset]) {
				matched = false;
				break;
			}
		}
		if (matched) {
			return true;
		}
	}
	return false;
}

export default async function testLEB128Boundaries(debug = false) {
	try {
		assertBytes(encodeULEB128(0), [0x00], "ULEB128 zero");
		assertBytes(encodeULEB128(127), [0x7f], "ULEB128 1-byte boundary");
		assertBytes(encodeULEB128(128), [0x80, 0x01], "ULEB128 2-byte boundary");
		assertBytes(encodeULEB128(624485), [0xe5, 0x8e, 0x26], "ULEB128 sample");
		assertBytes(
			encodeULEB128(0xffffffff),
			[0xff, 0xff, 0xff, 0xff, 0x0f],
			"ULEB128 5-byte boundary",
		);

		assertBytes(
			encodeSLEB128(2147483647),
			[0xff, 0xff, 0xff, 0xff, 0x07],
			"i32 max SLEB128",
		);
		assertBytes(
			encodeSLEB128(-2147483648),
			[0x80, 0x80, 0x80, 0x80, 0x78],
			"i32 min SLEB128",
		);
		assertBytes(
			encodeSLEB128BigInt(9223372036854775807n),
			[0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00],
			"i64 max SLEB128",
		);
		assertBytes(
			encodeSLEB128BigInt(-9223372036854775808n),
			[0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x7f],
			"i64 min SLEB128",
		);

		const wat = `(module
  (func (export "i32_max") (result i32)
    i32.const 2147483647)
  (func (export "i32_min") (result i32)
    i32.const -2147483648)
  (func (export "i64_max") (result i64)
    i64.const 9223372036854775807)
  (func (export "i64_min") (result i64)
    i64.const -9223372036854775808)
)`;
		const binary = await compile(wat);

		assert.ok(WebAssembly.validate(binary), "boundary module should validate");
		assert.ok(
			includesSequence(binary, [0x41, 0xff, 0xff, 0xff, 0xff, 0x07]),
			"compiled i32.max should use 5-byte SLEB128",
		);
		assert.ok(
			includesSequence(binary, [0x41, 0x80, 0x80, 0x80, 0x80, 0x78]),
			"compiled i32.min should use 5-byte SLEB128",
		);
		assert.ok(
			includesSequence(
				binary,
				[0x42, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00],
			),
			"compiled i64.max should use 10-byte SLEB128",
		);
		assert.ok(
			includesSequence(
				binary,
				[0x42, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x7f],
			),
			"compiled i64.min should use 10-byte SLEB128",
		);

		const { instance } = await WebAssembly.instantiate(binary, {});
		assert.strictEqual(instance.exports.i32_max(), 2147483647);
		assert.strictEqual(instance.exports.i32_min(), -2147483648);
		assert.strictEqual(instance.exports.i64_max(), 9223372036854775807n);
		assert.strictEqual(instance.exports.i64_min(), -9223372036854775808n);

		if (debug) {
			console.log("LEB128 boundary bytes verified");
		}

		return true;
	} catch (error) {
		console.error("LEB128 boundary test failed:", error);
		return false;
	}
}
