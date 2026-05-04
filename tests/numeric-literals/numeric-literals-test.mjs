import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";
import { expectCompileError } from "../test-utils.mjs";

const compileAndInstantiate = async (wat) => {
	const ast = parseWAT(wat);
	const wasmBuffer = new Uint8Array(compileToWASM(ast));
	if (!WebAssembly.validate(wasmBuffer)) {
		throw new Error("Expected numeric literal module to validate");
	}
	const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
	return instance;
};

export default async function testNumericLiterals() {
	const instance = await compileAndInstantiate(`
		(module
			(func (export "hex_f32") (result f32)
				f32.const 0x1.8p+3)

			(func (export "min_subnormal_f64") (result f64)
				f64.const 0x1p-1074)

			(func (export "positive_inf") (result f32)
				f32.const inf)

			(func (export "negative_inf") (result f64)
				f64.const -inf)

			(func (export "nan_payload_f32") (result i32)
				f32.const nan:0x400000
				i32.reinterpret_f32)

			(func (export "nan_canonical_f32") (result i32)
				f32.const nan:canonical
				i32.reinterpret_f32)

			(func (export "nan_arithmetic_f32") (result i32)
				f32.const nan:arithmetic
				i32.reinterpret_f32)

			(func (export "nan_payload_f64") (result i64)
				f64.const nan:0x8000000000000
				i64.reinterpret_f64)

			(func (export "decimal_separators") (result i32)
				i32.const 1_234_567)

			(func (export "hex_separators") (result i64)
				i64.const 0xffff_ffff_ffff_ffff)

			(func (export "i32_unsigned_boundary") (result i32)
				i32.const 0xFFFF_FFFF)

			(func (export "i32_signed_boundary") (result i32)
				i32.const -0x8000_0000)

			(global $global_i32_signed_boundary i32
				(i32.const -0x8000_0000))

			(func (export "global_i32_signed_boundary") (result i32)
				global.get $global_i32_signed_boundary)
		)
	`);

	if (instance.exports.hex_f32() !== 12) {
		throw new Error("Expected f32 hex float 0x1.8p+3 to evaluate to 12");
	}

	if (instance.exports.min_subnormal_f64() !== Number.MIN_VALUE) {
		throw new Error("Expected f64 hex float 0x1p-1074 to be Number.MIN_VALUE");
	}

	if (instance.exports.positive_inf() !== Number.POSITIVE_INFINITY) {
		throw new Error("Expected f32.const inf to evaluate to Infinity");
	}

	if (instance.exports.negative_inf() !== Number.NEGATIVE_INFINITY) {
		throw new Error("Expected f64.const -inf to evaluate to -Infinity");
	}

	if (instance.exports.nan_payload_f32() !== 0x7fc00000) {
		throw new Error("Expected f32 NaN payload bits to be preserved");
	}

	if (instance.exports.nan_canonical_f32() !== 0x7fc00000) {
		throw new Error("Expected f32 canonical NaN bits");
	}

	if (instance.exports.nan_arithmetic_f32() !== 0x7fc00000) {
		throw new Error("Expected f32 arithmetic NaN bits");
	}

	if (instance.exports.nan_payload_f64() !== 0x7ff8000000000000n) {
		throw new Error("Expected f64 NaN payload bits to be preserved");
	}

	if (instance.exports.decimal_separators() !== 1234567) {
		throw new Error("Expected decimal integer separators to parse");
	}

	if (instance.exports.hex_separators() !== -1n) {
		throw new Error("Expected i64 hexadecimal separators to parse");
	}

	if (instance.exports.i32_unsigned_boundary() !== -1) {
		throw new Error("Expected unsigned i32 boundary to wrap to -1");
	}

	if (instance.exports.i32_signed_boundary() !== -2147483648) {
		throw new Error("Expected signed i32 boundary to parse");
	}

	if (instance.exports.global_i32_signed_boundary() !== -2147483648) {
		throw new Error("Expected global signed i32 boundary to parse and encode");
	}

	await expectCompileError(
		`(module (func (export "bad") (result i32) i32.const 0x1_0000_0000))`,
		/out of range/,
	);

	await expectCompileError(
		`(module (func (export "bad") (result i32) i32.const -2147483649))`,
		/out of range/,
	);

	await expectCompileError(
		`(module (func (export "bad") (result f32) f32.const nan:0x800000))`,
		/out of range/,
	);

	console.log("✅ Numeric literal parsing test passed!");
	return true;
}
