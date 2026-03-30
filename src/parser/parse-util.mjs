import { createDiagnostic } from "../diagnostics.mjs";
import { atEnd, getCurrentCursor, peekToken, skipToken } from "./tape.mjs";

export function isLabel(candidate) {
	// if the candidate is a string and starts with a $ or if it is an integer
	if (typeof candidate === "string" && candidate.startsWith("$")) {
		return true;
	}
	if (!Number.isNaN(Number.parseInt(candidate, 10))) {
		return true;
	}

	return false;
}

export function isIndex(candidate) {
	return !Number.isNaN(Number.parseInt(candidate, 10));
}

export function isString(candidate) {
	return candidate.startsWith('"') && candidate.endsWith('"');
}

export function isNumber(candidate) {
	return (
		/^-?\d+(\.\d+)?$/.test(candidate) || /^0x[0-9a-fA-F]+$/.test(candidate)
	);
}

export function createError(message, options = {}) {
	const pos = options.position || getCurrentCursor();
	const token =
		options.found !== undefined
			? options.found
			: !atEnd()
				? peekToken()
				: "end of input";

	return createDiagnostic({
		stage: "parse",
		code: options.code || "WAT_PARSE",
		message,
		position: pos,
		endPosition: options.endPosition,
		found: token,
		expected: options.expected,
		note: options.note,
		hint: options.hint,
		context: options.context,
	});
}

export function openParenthesis() {
	const start = getCurrentCursor();

	return (_) => {
		if (peekToken() !== ")") {
			throw createError("Missing closing parenthesis", {
				code: "WAT_EXPECT_CLOSE_PAREN",
				position: getCurrentCursor(),
				expected: ")",
				note: `Opening parenthesis is at line ${start.line}, column ${start.column}.`,
			});
		}
		skipToken();
	};
}

export function parseDecimalOrHex(token) {
	if (token.startsWith("0x")) {
		return Number.parseInt(token, 16);
	}
	return Number.parseInt(token, 10);
}

export function parseSigned64BitHex(hexString) {
	// Convert the hex string to a BigInt
	let value = BigInt(hexString);

	// Check if the value is negative in 64-bit signed range
	if (value > 0x7fffffffffffffffn) {
		value -= 0x10000000000000000n; // Adjust for signed 64-bit range
	}

	return value;
}
