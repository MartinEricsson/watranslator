import assert from "node:assert";
import { compile } from "../../src/index.mjs";

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

function buildWat() {
	const repeatedTargets = Array.from({ length: 260 }, () => "$large_out").join(
		" ",
	);

	return `(module
  (func (export "zero_targets") (param i32) (result i32)
    block $zero_out (result i32)
      i32.const 11
      local.get 0
      br_table $zero_out
    end)

  (func (export "duplicate_targets") (param i32) (result i32)
    block $dup_out (result i32)
      i32.const 22
      local.get 0
      br_table $dup_out $dup_out $dup_out
    end)

  (func (export "large_targets") (param i32) (result i32)
    block $large_out (result i32)
      i32.const 33
      local.get 0
      br_table ${repeatedTargets} $large_out
    end)
)`;
}

export default async function testBrTableBoundaries(debug = false) {
	try {
		const binary = await compile(buildWat());
		assert.ok(
			WebAssembly.validate(binary),
			"br_table boundary module validates",
		);

		assert.ok(
			includesSequence(binary, [0x0e, 0x00, 0x00]),
			"default-only br_table should encode zero vector targets and default depth",
		);
		assert.ok(
			includesSequence(binary, [0x0e, 0x02, 0x00, 0x00, 0x00]),
			"duplicate br_table targets should encode repeated label depths",
		);

		const largeSequence = [
			0x0e,
			0x84,
			0x02,
			...Array.from({ length: 260 }, () => 0x00),
			0x00,
		];
		assert.ok(
			includesSequence(binary, largeSequence),
			"260-target br_table should encode target count as multi-byte ULEB128",
		);

		const { instance } = await WebAssembly.instantiate(binary, {});
		assert.strictEqual(instance.exports.zero_targets(0), 11);
		assert.strictEqual(instance.exports.zero_targets(99), 11);
		assert.strictEqual(instance.exports.duplicate_targets(0), 22);
		assert.strictEqual(instance.exports.duplicate_targets(1), 22);
		assert.strictEqual(instance.exports.duplicate_targets(99), 22);
		assert.strictEqual(instance.exports.large_targets(0), 33);
		assert.strictEqual(instance.exports.large_targets(259), 33);
		assert.strictEqual(instance.exports.large_targets(260), 33);

		if (debug) {
			console.log("br_table boundary encodings verified");
		}

		return true;
	} catch (error) {
		console.error("br_table boundary test failed:", error);
		return false;
	}
}
