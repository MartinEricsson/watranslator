import assert from "node:assert";
import { SIMD_PREFIX } from "../../src/compile/constants.mjs";
import { compileSIMDPlainOpcode } from "../../src/compile/instructions/simd-plain-opcode.mjs";

const highSimdOpcodes = [
	["i16x8.abs", 128],
	["i16x8.neg", 129],
	["i16x8.q15mulr_sat_s", 130],
	["i16x8.all_true", 131],
	["i16x8.bitmask", 132],
	["i16x8.narrow_i32x4_s", 133],
	["i16x8.narrow_i32x4_u", 134],
	["i16x8.extend_low_i8x16_s", 135],
	["i16x8.extend_high_i8x16_s", 136],
	["i16x8.extend_low_i8x16_u", 137],
	["i16x8.extend_high_i8x16_u", 138],
	["i16x8.shl", 139],
	["i16x8.shr_s", 140],
	["i16x8.shr_u", 141],
	["i16x8.add", 142],
	["i16x8.add_sat_s", 143],
	["i16x8.add_sat_u", 144],
	["i16x8.sub", 145],
	["i16x8.sub_sat_s", 146],
	["i16x8.sub_sat_u", 147],
	["i16x8.mul", 149],
	["i16x8.min_s", 150],
	["i16x8.min_u", 151],
	["i16x8.max_s", 152],
	["i16x8.max_u", 153],
	["i16x8.avgr_u", 155],
	["i16x8.extmul_low_i8x16_s", 156],
	["i16x8.extmul_high_i8x16_s", 157],
	["i16x8.extmul_low_i8x16_u", 158],
	["i16x8.extmul_high_i8x16_u", 159],
	["i32x4.abs", 160],
	["i32x4.neg", 161],
	["i32x4.all_true", 163],
	["i32x4.bitmask", 164],
	["i32x4.extend_low_i16x8_s", 167],
	["i32x4.extend_high_i16x8_s", 168],
	["i32x4.extend_low_i16x8_u", 169],
	["i32x4.extend_high_i16x8_u", 170],
	["i32x4.shl", 171],
	["i32x4.shr_s", 172],
	["i32x4.shr_u", 173],
	["i32x4.add", 174],
	["i32x4.sub", 177],
	["i32x4.mul", 181],
	["i32x4.min_s", 182],
	["i32x4.min_u", 183],
	["i32x4.max_s", 184],
	["i32x4.max_u", 185],
	["i32x4.dot_i16x8_s", 186],
	["i32x4.extmul_low_i16x8_s", 188],
	["i32x4.extmul_high_i16x8_s", 189],
	["i32x4.extmul_low_i16x8_u", 190],
	["i32x4.extmul_high_i16x8_u", 191],
	["i64x2.abs", 192],
	["i64x2.neg", 193],
	["i64x2.all_true", 195],
	["i64x2.bitmask", 196],
	["i64x2.extend_low_i32x4_s", 199],
	["i64x2.extend_high_i32x4_s", 200],
	["i64x2.extend_low_i32x4_u", 201],
	["i64x2.extend_high_i32x4_u", 202],
	["i64x2.shl", 203],
	["i64x2.shr_s", 204],
	["i64x2.shr_u", 205],
	["i64x2.add", 206],
	["i64x2.sub", 209],
	["i64x2.mul", 213],
	["i64x2.eq", 214],
	["i64x2.ne", 215],
	["i64x2.lt_s", 216],
	["i64x2.gt_s", 217],
	["i64x2.le_s", 218],
	["i64x2.ge_s", 219],
	["i64x2.extmul_low_i32x4_s", 220],
	["i64x2.extmul_high_i32x4_s", 221],
	["i64x2.extmul_low_i32x4_u", 222],
	["i64x2.extmul_high_i32x4_u", 223],
	["f32x4.abs", 224],
	["f32x4.neg", 225],
	["f32x4.sqrt", 227],
	["f32x4.add", 228],
	["f32x4.sub", 229],
	["f32x4.mul", 230],
	["f32x4.div", 231],
	["f32x4.min", 232],
	["f32x4.max", 233],
	["f32x4.pmin", 234],
	["f32x4.pmax", 235],
	["f64x2.abs", 236],
	["f64x2.neg", 237],
	["f64x2.sqrt", 239],
	["f64x2.add", 240],
	["f64x2.sub", 241],
	["f64x2.mul", 242],
	["f64x2.div", 243],
	["f64x2.min", 244],
	["f64x2.max", 245],
	["f64x2.pmin", 246],
	["f64x2.pmax", 247],
	["i32x4.trunc_sat_f32x4_s", 248],
	["i32x4.trunc_sat_f32x4_u", 249],
	["f32x4.convert_i32x4_s", 250],
	["f32x4.convert_i32x4_u", 251],
	["i32x4.trunc_sat_f64x2_s_zero", 252],
	["i32x4.trunc_sat_f64x2_u_zero", 253],
	["f64x2.convert_low_i32x4_s", 254],
	["f64x2.convert_low_i32x4_u", 255],
];

function encodeULEB128(value) {
	let remaining = value;
	const bytes = [];
	do {
		let byte = remaining & 0x7f;
		remaining >>>= 7;
		if (remaining !== 0) {
			byte |= 0x80;
		}
		bytes.push(byte);
	} while (remaining !== 0);
	return bytes;
}

export default async function testSIMDHighOpcodeEncoding(debug = false) {
	try {
		const names = new Set();
		const opcodes = new Set();

		for (const [op, opcode] of highSimdOpcodes) {
			assert.ok(opcode > 127, `${op} should be in the high opcode set`);
			assert.ok(!names.has(op), `duplicate SIMD opcode name ${op}`);
			assert.ok(!opcodes.has(opcode), `duplicate SIMD opcode byte ${opcode}`);
			names.add(op);
			opcodes.add(opcode);

			const bytes = [];
			const handled = compileSIMDPlainOpcode({ op }, bytes);
			assert.strictEqual(handled, true, `${op} should compile`);
			assert.deepStrictEqual(
				bytes,
				[SIMD_PREFIX, ...encodeULEB128(opcode)],
				op,
			);
		}

		if (debug) {
			console.log(
				`Verified ${highSimdOpcodes.length} high SIMD opcode encodings`,
			);
		}

		return true;
	} catch (error) {
		console.error("SIMD high opcode encoding test failed:", error);
		return false;
	}
}
