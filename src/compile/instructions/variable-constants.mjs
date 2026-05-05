import {
	encodeF32,
	encodeF32Bits,
	encodeF64,
	encodeF64Bits,
	encodeSLEB128,
	encodeSLEB128BigInt,
} from "../compile-utils.mjs";
import wasmConstants from "../constants.mjs";

const { INSTR } = wasmConstants;

export function compileVariableConstants(instr, body) {
	if (instr.op === "i32.const") {
		body.push(INSTR.I32_CONST);
		body.push(...encodeSLEB128(instr.value));
		return true;
	}

	if (instr.op === "i64.const") {
		body.push(INSTR.I64_CONST);
		body.push(...encodeSLEB128BigInt(instr.value));
		return true;
	}

	if (instr.op === "f32.const") {
		body.push(INSTR.F32_CONST);
		body.push(
			...(instr.bits !== undefined
				? encodeF32Bits(instr.bits)
				: encodeF32(instr.value)),
		);
		return true;
	}

	if (instr.op === "f64.const") {
		body.push(INSTR.F64_CONST);
		body.push(
			...(instr.bits !== undefined
				? encodeF64Bits(instr.bits)
				: encodeF64(instr.value)),
		);
		return true;
	}

	return false;
}
