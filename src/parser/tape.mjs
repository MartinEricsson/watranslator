import { createDiagnostic } from "../diagnostics.mjs";

export function createTape(tokenList = [], sourceMapList = new Map()) {
	let position = 0;
	const tokens = tokenList;
	const sourceMap = sourceMapList;

	const getCurrentCursor = () =>
		sourceMap.get(position) ||
		sourceMap.get(tokens.length - 1) || { line: 1, column: 1 };

	const atEnd = () => position >= tokens.length;

	const getToken = () => {
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
	};

	const peekToken = () => {
		if (position >= tokens.length) {
			return null;
		}
		return tokens[position];
	};

	const peekTokenN = (offset) => {
		const targetIndex = position + offset;
		if (targetIndex < 0 || targetIndex >= tokens.length) {
			return null;
		}
		return tokens[targetIndex];
	};

	const skipToken = () => {
		if (position < tokens.length) {
			position++;
			return;
		}

		throw createDiagnostic({
			stage: "parse",
			code: "WAT_UNEXPECTED_EOF",
			message: "Unexpected end of input",
			position: getCurrentCursor(),
			found: "end of input",
		});
	};

	return {
		atEnd,
		getCurrentCursor,
		getToken,
		peekToken,
		peekTokenN,
		skipToken,
	};
}
