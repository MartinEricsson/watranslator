const SIMD_PLAIN_OPCODE_NAMES =
	"i8x16.swizzle|i8x16.splat|i16x8.splat|i32x4.splat|i64x2.splat|f32x4.splat|f64x2.splat|i8x16.eq|i8x16.ne|i8x16.lt_s|i8x16.lt_u|i8x16.gt_s|i8x16.gt_u|i8x16.le_s|i8x16.le_u|i8x16.ge_s|i8x16.ge_u|i16x8.eq|i16x8.ne|i16x8.lt_s|i16x8.lt_u|i16x8.gt_s|i16x8.gt_u|i16x8.le_s|i16x8.le_u|i16x8.ge_s|i16x8.ge_u|i32x4.eq|i32x4.ne|i32x4.lt_s|i32x4.lt_u|i32x4.gt_s|i32x4.gt_u|i32x4.le_s|i32x4.le_u|i32x4.ge_s|i32x4.ge_u|i64x2.eq|i64x2.ne|i64x2.lt_s|i64x2.gt_s|i64x2.le_s|i64x2.ge_s|f32x4.eq|f32x4.ne|f32x4.lt|f32x4.gt|f32x4.le|f32x4.ge|f64x2.eq|f64x2.ne|f64x2.lt|f64x2.gt|f64x2.le|f64x2.ge|v128.not|v128.and|v128.andnot|v128.or|v128.xor|v128.bitselect|v128.any_true|i8x16.abs|i8x16.neg|i8x16.popcnt|i8x16.all_true|i8x16.bitmask|i8x16.narrow_i16x8_s|i8x16.narrow_i16x8_u|i8x16.shl|i8x16.shr_s|i8x16.shr_u|i8x16.add|i8x16.add_sat_s|i8x16.add_sat_u|i8x16.sub|i8x16.sub_sat_s|i8x16.sub_sat_u|i8x16.min_s|i8x16.min_u|i8x16.max_s|i8x16.max_u|i8x16.avgr_u|i16x8.extadd_pairwise_i8x16_s|i16x8.extadd_pairwise_i8x16_u|i16x8.abs|i16x8.neg|i16x8.q15mulr_sat_s|i16x8.all_true|i16x8.bitmask|i16x8.narrow_i32x4_s|i16x8.narrow_i32x4_u|i16x8.extend_low_i8x16_s|i16x8.extend_high_i8x16_s|i16x8.extend_low_i8x16_u|i16x8.extend_high_i8x16_u|i16x8.shl|i16x8.shr_s|i16x8.shr_u|i16x8.add|i16x8.add_sat_s|i16x8.add_sat_u|i16x8.sub|i16x8.sub_sat_s|i16x8.sub_sat_u|i16x8.mul|i16x8.min_s|i16x8.min_u|i16x8.max_s|i16x8.max_u|i16x8.avgr_u|i16x8.extmul_low_i8x16_s|i16x8.extmul_high_i8x16_s|i16x8.extmul_low_i8x16_u|i16x8.extmul_high_i8x16_u|i32x4.extadd_pairwise_i16x8_s|i32x4.extadd_pairwise_i16x8_u|i32x4.abs|i32x4.neg|i32x4.all_true|i32x4.bitmask|i32x4.extend_low_i16x8_s|i32x4.extend_high_i16x8_s|i32x4.extend_low_i16x8_u|i32x4.extend_high_i16x8_u|i32x4.shl|i32x4.shr_s|i32x4.shr_u|i32x4.add|i32x4.sub|i32x4.mul|i32x4.min_s|i32x4.min_u|i32x4.max_s|i32x4.max_u|i32x4.dot_i16x8_s|i32x4.extmul_low_i16x8_s|i32x4.extmul_high_i16x8_s|i32x4.extmul_low_i16x8_u|i32x4.extmul_high_i16x8_u|i64x2.abs|i64x2.neg|i64x2.all_true|i64x2.bitmask|i64x2.extend_low_i32x4_s|i64x2.extend_high_i32x4_s|i64x2.extend_low_i32x4_u|i64x2.extend_high_i32x4_u|i64x2.shl|i64x2.shr_s|i64x2.shr_u|i64x2.add|i64x2.sub|i64x2.mul|i64x2.extmul_low_i32x4_s|i64x2.extmul_high_i32x4_s|i64x2.extmul_low_i32x4_u|i64x2.extmul_high_i32x4_u|f32x4.ceil|f32x4.floor|f32x4.trunc|f32x4.nearest|f32x4.abs|f32x4.neg|f32x4.sqrt|f32x4.add|f32x4.sub|f32x4.mul|f32x4.div|f32x4.min|f32x4.max|f32x4.pmin|f32x4.pmax|f64x2.ceil|f64x2.floor|f64x2.trunc|f64x2.nearest|f64x2.abs|f64x2.neg|f64x2.sqrt|f64x2.add|f64x2.sub|f64x2.mul|f64x2.div|f64x2.min|f64x2.max|f64x2.pmin|f64x2.pmax|i32x4.trunc_sat_f32x4_s|i32x4.trunc_sat_f32x4_u|f32x4.convert_i32x4_s|f32x4.convert_i32x4_u|i32x4.trunc_sat_f64x2_s_zero|i32x4.trunc_sat_f64x2_u_zero|f64x2.convert_low_i32x4_s|f64x2.convert_low_i32x4_u|f32x4.demote_f64x2_zero|f64x2.promote_low_f32x4";

const SIMD_PLAIN_OPCODE_VALUES = new Uint16Array([
	14, 15, 16, 17, 18, 19, 20, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
	47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 214,
	215, 216, 217, 218, 219, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
	78, 79, 80, 81, 82, 83, 96, 97, 98, 99, 100, 101, 102, 107, 108, 109, 110,
	111, 112, 113, 114, 115, 118, 119, 120, 121, 123, 124, 125, 128, 129, 130,
	131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145,
	146, 147, 149, 150, 151, 152, 153, 155, 156, 157, 158, 159, 126, 127, 160,
	161, 163, 164, 167, 168, 169, 170, 171, 172, 173, 174, 177, 181, 182, 183,
	184, 185, 186, 188, 189, 190, 191, 192, 193, 195, 196, 199, 200, 201, 202,
	203, 204, 205, 206, 209, 213, 220, 221, 222, 223, 103, 104, 105, 106, 224,
	225, 227, 228, 229, 230, 231, 232, 233, 234, 235, 116, 117, 122, 148, 236,
	237, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252,
	253, 254, 255, 94, 95,
]);

const SIMD_PLAIN_OPCODE_MAP = new Map(
	SIMD_PLAIN_OPCODE_NAMES.split("|").map((name, index) => [
		name,
		SIMD_PLAIN_OPCODE_VALUES[index],
	]),
);

export function getSIMDPlainOpcode(opcode) {
	return SIMD_PLAIN_OPCODE_MAP.get(opcode);
}

export function isSIMDPlainOpcode(opcode) {
	return SIMD_PLAIN_OPCODE_MAP.has(opcode);
}
