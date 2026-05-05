import { getSIMDPlainOpcode } from "../../simd-plain-opcodes.mjs";
import { encodeULEB128 } from "../compile-utils.mjs";
import { SIMD_PREFIX } from "../constants.mjs";

/**
 * Compiles SIMD plain opcode instructions.
 *
 * @param {Object} instruction - The instruction object.
 * @param {Array} bytes - The byte array to which compiled code is appended.
 * @returns {boolean} - True if the instruction was handled, false otherwise.
 */
export function compileSIMDPlainOpcode(instruction, bytes) {
	const opcode = getSIMDPlainOpcode(instruction.op);

	if (opcode === undefined) {
		return false;
	}

	// Add SIMD prefix and the specific instruction opcode
	bytes.push(SIMD_PREFIX);
	bytes.push(...encodeULEB128(opcode));

	return true;
}
