import assert from "node:assert";
import { TYPE } from "../../src/compile/constants.mjs";
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

const refNullWat = `(module
  (func (export "null_func") (result funcref)
    ref.null func)

  (func (export "null_extern") (result externref)
    ref.null extern)

  (func (export "is_func_null") (result i32)
    ref.null func
    ref.is_null)

  (func (export "is_extern_null") (result i32)
    ref.null extern
    ref.is_null)
)`;

const unsupportedTypedRefNullWat = `(module
  (type $fn (func))
  (func (export "typed_null") (result funcref)
    ref.null $fn)
)`;

export default async function testRefNullBoundaries(debug = false) {
	try {
		const binary = await compile(refNullWat);
		assert.ok(
			WebAssembly.validate(binary),
			"ref.null boundary module validates",
		);
		assert.ok(
			includesSequence(binary, [0xd0, TYPE.FUNCREF]),
			"ref.null func should encode as funcref heap type",
		);
		assert.ok(
			includesSequence(binary, [0xd0, TYPE.EXTERNREF]),
			"ref.null extern should encode as externref heap type",
		);

		const { instance } = await WebAssembly.instantiate(binary, {});
		assert.strictEqual(instance.exports.null_func(), null);
		assert.strictEqual(instance.exports.null_extern(), null);
		assert.strictEqual(instance.exports.is_func_null(), 1);
		assert.strictEqual(instance.exports.is_extern_null(), 1);

		await assert.rejects(
			() => compile(unsupportedTypedRefNullWat),
			/Unsupported ref\.null heap type: \$fn/,
			"typed ref.null should fail clearly until typed function references are supported",
		);

		if (debug) {
			console.log("ref.null func/extern encodings verified");
		}

		return true;
	} catch (error) {
		console.error("ref.null boundary test failed:", error);
		return false;
	}
}
