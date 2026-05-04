const F32_EXPONENT_BITS = 0x7f800000;
const F32_CANONICAL_NAN_PAYLOAD = 0x400000;
const F32_MAX_NAN_PAYLOAD = 0x7fffff;

const F64_EXPONENT_BITS = 0x7ff0000000000000n;
const F64_CANONICAL_NAN_PAYLOAD = 0x8000000000000n;
const F64_MAX_NAN_PAYLOAD = 0xfffffffffffffn;

const removeSeparators = (token) => token.replaceAll("_", "");

const parseBigIntLiteral = (token) => {
	const clean = removeSeparators(token);
	const sign = clean.startsWith("-") ? -1n : 1n;
	const unsigned =
		clean.startsWith("-") || clean.startsWith("+") ? clean.slice(1) : clean;

	if (unsigned.toLowerCase().startsWith("0x")) {
		return sign * BigInt(unsigned);
	}

	return BigInt(clean);
};

export function parseIntegerLiteral(token, bits) {
	let value;
	try {
		value = parseBigIntLiteral(token);
	} catch {
		throw new Error(`Invalid integer literal: ${token}`);
	}

	const width = BigInt(bits);
	const minSigned = -(1n << (width - 1n));
	const maxSigned = (1n << (width - 1n)) - 1n;
	const maxUnsigned = (1n << width) - 1n;

	if (value < minSigned || value > maxUnsigned) {
		throw new Error(`Integer literal out of range for i${bits}: ${token}`);
	}

	if (value > maxSigned) {
		return value - (1n << width);
	}

	return value;
}

export function parseI32Literal(token) {
	return Number(parseIntegerLiteral(token, 32));
}

export function parseI64Literal(token) {
	return parseIntegerLiteral(token, 64);
}

export function encodeF32Bits(bits) {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setUint32(0, bits >>> 0, true);
	return Array.from(new Uint8Array(buffer));
}

export function encodeF64Bits(bits) {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setBigUint64(0, BigInt.asUintN(64, bits), true);
	return Array.from(new Uint8Array(buffer));
}

export function encodeF32(value) {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setFloat32(0, value, true);
	return Array.from(new Uint8Array(buffer));
}

export function encodeF64(value) {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setFloat64(0, value, true);
	return Array.from(new Uint8Array(buffer));
}

const parseNanPayload = (payloadText, bits) => {
	const isF32 = bits === 32;
	const canonicalPayload = isF32
		? F32_CANONICAL_NAN_PAYLOAD
		: F64_CANONICAL_NAN_PAYLOAD;
	const maxPayload = isF32 ? F32_MAX_NAN_PAYLOAD : F64_MAX_NAN_PAYLOAD;

	if (
		!payloadText ||
		payloadText === "canonical" ||
		payloadText === "arithmetic"
	) {
		return canonicalPayload;
	}

	if (!payloadText.startsWith("0x")) {
		throw new Error(`Invalid NaN payload: ${payloadText}`);
	}

	const payload = isF32
		? Number.parseInt(payloadText, 16)
		: BigInt(payloadText);

	if (payload === 0 || payload > maxPayload) {
		throw new Error(`NaN payload out of range for f${bits}: ${payloadText}`);
	}

	return payload;
};

const parseHexFloat = (token) => {
	const match = token.match(
		/^([+-])?0x([0-9a-f]*)(?:\.([0-9a-f]*))?p([+-]?\d+)$/i,
	);
	if (!match) {
		return null;
	}

	const [, signToken, integerPart, fractionalPart = "", exponentText] = match;
	if (integerPart.length === 0 && fractionalPart.length === 0) {
		throw new Error(`Invalid hexadecimal float literal: ${token}`);
	}

	const digits = `${integerPart}${fractionalPart}` || "0";
	const significand = Number.parseInt(digits, 16);
	const exponent =
		Number.parseInt(exponentText, 10) - fractionalPart.length * 4;
	const sign = signToken === "-" ? -1 : 1;

	return sign * significand * 2 ** exponent;
};

export function parseFloatLiteral(token, bits) {
	const clean = removeSeparators(token).toLowerCase();
	const signBit32 = clean.startsWith("-") ? 0x80000000 : 0;
	const signBit64 = clean.startsWith("-") ? 0x8000000000000000n : 0n;
	const unsigned =
		clean.startsWith("-") || clean.startsWith("+") ? clean.slice(1) : clean;

	if (unsigned === "inf" || unsigned === "infinity") {
		return {
			value: clean.startsWith("-")
				? Number.NEGATIVE_INFINITY
				: Number.POSITIVE_INFINITY,
		};
	}

	if (unsigned.startsWith("nan")) {
		const payloadText = unsigned.startsWith("nan:")
			? unsigned.slice("nan:".length)
			: "";
		const payload = parseNanPayload(payloadText, bits);
		if (bits === 32) {
			return {
				value: Number.NaN,
				bits: (signBit32 | F32_EXPONENT_BITS | payload) >>> 0,
			};
		}
		return {
			value: Number.NaN,
			bits: signBit64 | F64_EXPONENT_BITS | payload,
		};
	}

	const hexFloat = parseHexFloat(clean);
	if (hexFloat !== null) {
		return { value: hexFloat };
	}

	const value = Number(clean);
	if (Number.isNaN(value)) {
		throw new Error(`Invalid f${bits} literal: ${token}`);
	}

	return { value };
}

export function parseF32Literal(token) {
	return parseFloatLiteral(token, 32);
}

export function parseF64Literal(token) {
	return parseFloatLiteral(token, 64);
}
