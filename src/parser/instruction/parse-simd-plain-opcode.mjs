import { isSIMDPlainOpcode } from "../../simd-plain-opcodes.mjs";

export function parseSIMDPlainOpcode(instrToken, position) {
	if (typeof instrToken !== "string") {
		return false;
	}

	if (!isSIMDPlainOpcode(instrToken)) {
		return false;
	}

	return { type: instrToken, position };
}
