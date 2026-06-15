import { encodeULEB128 } from "../compile-utils.mjs";
import { SIMD_PREFIX } from "../constants.mjs";
import { createError } from "./error.mjs";

const V128_LOAD = 0;
const V128_LOAD8X8_S = 1;
const V128_LOAD8X8_U = 2;
const V128_LOAD16X4_S = 3;
const V128_LOAD16X4_U = 4;
const V128_LOAD32X2_S = 5;
const V128_LOAD32X2_U = 6;
const V128_LOAD8_SPLAT = 7;
const V128_LOAD16_SPLAT = 8;
const V128_LOAD32_SPLAT = 9;
const V128_LOAD64_SPLAT = 10;
const V128_STORE = 11;
const V128_LOAD32_ZERO = 92;
const V128_LOAD64_ZERO = 93;
const V128_LOAD8_LANE = 84;
const V128_LOAD16_LANE = 85;
const V128_LOAD32_LANE = 86;
const V128_LOAD64_LANE = 87;
const V128_STORE8_LANE = 88;
const V128_STORE16_LANE = 89;
const V128_STORE32_LANE = 90;
const V128_STORE64_LANE = 91;

const PLAIN_MEM = new Map([
	["v128.load", { opcode: V128_LOAD, defaultAlign: 0 }],
	["v128.load8x8_s", { opcode: V128_LOAD8X8_S, defaultAlign: 3 }],
	["v128.load8x8_u", { opcode: V128_LOAD8X8_U, defaultAlign: 3 }],
	["v128.load16x4_s", { opcode: V128_LOAD16X4_S, defaultAlign: 3 }],
	["v128.load16x4_u", { opcode: V128_LOAD16X4_U, defaultAlign: 3 }],
	["v128.load32x2_s", { opcode: V128_LOAD32X2_S, defaultAlign: 3 }],
	["v128.load32x2_u", { opcode: V128_LOAD32X2_U, defaultAlign: 3 }],
	["v128.load8_splat", { opcode: V128_LOAD8_SPLAT, defaultAlign: 0 }],
	["v128.load16_splat", { opcode: V128_LOAD16_SPLAT, defaultAlign: 1 }],
	["v128.load32_splat", { opcode: V128_LOAD32_SPLAT, defaultAlign: 2 }],
	["v128.load64_splat", { opcode: V128_LOAD64_SPLAT, defaultAlign: 3 }],
	["v128.store", { opcode: V128_STORE, defaultAlign: 4 }],
	["v128.load32_zero", { opcode: V128_LOAD32_ZERO, defaultAlign: 2 }],
	["v128.load64_zero", { opcode: V128_LOAD64_ZERO, defaultAlign: 3 }],
]);

const LANE_MEM = new Map([
	[
		"v128.load8_lane",
		{ opcode: V128_LOAD8_LANE, defaultAlign: 0, maxLane: 15 },
	],
	[
		"v128.load16_lane",
		{ opcode: V128_LOAD16_LANE, defaultAlign: 1, maxLane: 7 },
	],
	[
		"v128.load32_lane",
		{ opcode: V128_LOAD32_LANE, defaultAlign: 2, maxLane: 3 },
	],
	[
		"v128.load64_lane",
		{ opcode: V128_LOAD64_LANE, defaultAlign: 3, maxLane: 1 },
	],
	[
		"v128.store8_lane",
		{ opcode: V128_STORE8_LANE, defaultAlign: 0, maxLane: 15 },
	],
	[
		"v128.store16_lane",
		{ opcode: V128_STORE16_LANE, defaultAlign: 1, maxLane: 7 },
	],
	[
		"v128.store32_lane",
		{ opcode: V128_STORE32_LANE, defaultAlign: 2, maxLane: 3 },
	],
	[
		"v128.store64_lane",
		{ opcode: V128_STORE64_LANE, defaultAlign: 3, maxLane: 1 },
	],
]);

export function compileSIMDMemory(instruction, bytes) {
	const type = instruction.op;
	const align = (meta) =>
		instruction.align !== undefined ? instruction.align : meta.defaultAlign;
	const offset = instruction.offset !== undefined ? instruction.offset : 0;

	const plain = PLAIN_MEM.get(type);
	if (plain) {
		bytes.push(SIMD_PREFIX, plain.opcode);
		bytes.push(...encodeULEB128(align(plain)));
		bytes.push(...encodeULEB128(offset));
		return true;
	}

	const lane = LANE_MEM.get(type);
	if (lane) {
		bytes.push(SIMD_PREFIX, lane.opcode);
		bytes.push(...encodeULEB128(align(lane)));
		bytes.push(...encodeULEB128(offset));
		const laneIndex = instruction.laneIndex;
		if (laneIndex === undefined || laneIndex < 0 || laneIndex > lane.maxLane) {
			throw createError(
				instruction,
				null,
				null,
				`${type} requires lane index 0-${lane.maxLane}`,
			);
		}
		bytes.push(laneIndex);
		return true;
	}

	return false;
}
