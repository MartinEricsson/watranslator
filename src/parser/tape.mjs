import { createDiagnostic } from "../diagnostics.mjs";

let position = 0;
let tokens = [];
let sourceMap = new Map();

export function initTape(tokenList = [], sourceMapList = new Map()) {
	tokens = tokenList;
	sourceMap = sourceMapList;
	position = 0;
}

export function atEnd() {
	return position >= tokens.length;
}

export function getToken() {
	if (position >= tokens.length) {
		throw createDiagnostic({
			stage: "parse",
			code: "WAT_UNEXPECTED_EOF",
			message: "Unexpected end of input",
			position: getCurrentCursor(),
			found: "end of input",
		});
	}
	const token = tokens[position];
	position++;
	return token;
}

export function peekToken() {
	if (position >= tokens.length) {
		return null;
	}
	return tokens[position];
}

export function peekTokenN(offset) {
	const targetIndex = position + offset;
	if (targetIndex < 0 || targetIndex >= tokens.length) {
		return null;
	}
	return tokens[targetIndex];
}

export function skipToken() {
	if (position < tokens.length) {
		position++;
	} else {
		throw createDiagnostic({
			stage: "parse",
			code: "WAT_UNEXPECTED_EOF",
			message: "Unexpected end of input",
			position: getCurrentCursor(),
			found: "end of input",
		});
	}
}

export function getCurrentCursor() {
	return (
		sourceMap.get(position) ||
		sourceMap.get(tokens.length - 1) || { line: 1, column: 1 }
	);
}
