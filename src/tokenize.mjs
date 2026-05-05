import { createDiagnostic } from "./diagnostics.mjs";

function createError(message, line, column, options = {}) {
	return createDiagnostic({
		stage: "tokenize",
		code: options.code || "WAT_TOKENIZE",
		message,
		position: { line, column },
		found: options.found,
		expected: options.expected,
		note: options.note,
		hint: options.hint,
	});
}

function isMemargInstructionToken(token) {
	if (typeof token !== "string") {
		return false;
	}

	if (/^(i32|i64|f32|f64)\.(load|store)(8|16|32)?(_[su])?$/.test(token)) {
		return true;
	}

	if (/^(i32|i64)\.atomic\.(load|store)(8|16|32)?_?u?$/.test(token)) {
		return true;
	}

	if (/^(i32|i64)\.atomic\.rmw(8|16|32)?\.[^.]+_?u?$/.test(token)) {
		return true;
	}

	if (
		/^v128\.(load|store)(8|16|32|64)?(_lane|_splat|x[248]_[su]|_zero)?$/.test(
			token,
		)
	) {
		return true;
	}

	return false;
}

export function tokenize(fullInput) {
	const input = Array.isArray(fullInput) ? fullInput.join("\n") : fullInput;
	const sourceMap = new Map(); // Maps token index to {line, column}
	let i = 0;
	let currentLine = 1;
	let currentColumn = 1;
	let tokenStartIndex = -1;
	let tokenStartLine = 1;
	let tokenStartColumn = 1;
	const tokens = [];

	function advance(char) {
		if (char === "\n") {
			currentLine++;
			currentColumn = 1;
		} else {
			currentColumn++;
		}
	}

	function pushToken(token, line, column) {
		if (token.length === 0) {
			return;
		}
		tokens.push(token);
		sourceMap.set(tokens.length - 1, { line, column });
	}

	function isWhitespace(char) {
		return char === " " || char === "\t" || char === "\n" || char === "\r";
	}

	function resetTokenStart() {
		tokenStartIndex = -1;
	}

	function validateMemargAttributes(token, attrToken, line, column) {
		const offsetMatch = attrToken.match(/offset=([^\s]+)/);
		const alignMatch = attrToken.match(/align=([^\s]+)/);

		if (offsetMatch && Number.isNaN(Number.parseInt(offsetMatch[1], 10))) {
			throw createError(
				`Invalid offset value "${offsetMatch[1]}"`,
				line,
				column + token.length + attrToken.indexOf("offset="),
				{
					code: "WAT_INVALID_OFFSET",
					found: offsetMatch[1],
					expected: "non-negative integer",
				},
			);
		}

		if (alignMatch && Number.isNaN(Number.parseInt(alignMatch[1], 10))) {
			throw createError(
				`Invalid align value "${alignMatch[1]}"`,
				line,
				column + token.length + attrToken.indexOf("align="),
				{
					code: "WAT_INVALID_ALIGN",
					found: alignMatch[1],
					expected: "non-negative integer",
				},
			);
		}
	}

	function findMemargAttributeEnd(startIndex) {
		let end = startIndex;
		while (end < input.length) {
			const char = input[end];
			if (char === ")" || char === "\n") {
				break;
			}
			if (char === ";" && input[end + 1] === ";") {
				break;
			}
			end++;
		}
		return end;
	}

	function consumeThrough(endIndex) {
		while (i < endIndex) {
			advance(input[i]);
			i++;
		}
	}

	function flushToken() {
		if (tokenStartIndex === -1) {
			return false;
		}

		const token = input.slice(tokenStartIndex, i);
		if (isMemargInstructionToken(token)) {
			const attrEnd = findMemargAttributeEnd(i);
			const attrToken = input.slice(i, attrEnd);
			if (
				attrToken.trim() &&
				(attrToken.includes("offset=") || attrToken.includes("align="))
			) {
				validateMemargAttributes(
					token,
					attrToken,
					tokenStartLine,
					tokenStartColumn,
				);
				pushToken(token + attrToken, tokenStartLine, tokenStartColumn);
				resetTokenStart();
				consumeThrough(attrEnd);
				return true;
			}
		}

		pushToken(token, tokenStartLine, tokenStartColumn);
		resetTokenStart();
		return false;
	}

	function skipLineComment() {
		while (i < input.length && input[i] !== "\n") {
			advance(input[i]);
			i++;
		}
	}

	function skipBlockComment() {
		const commentStartLine = currentLine;
		const commentStartColumn = currentColumn;
		advance(input[i]);
		advance(input[i + 1]);
		i += 2;

		while (i < input.length) {
			if (input[i] === ";" && input[i + 1] === ")") {
				advance(input[i]);
				advance(input[i + 1]);
				i += 2;
				return;
			}
			advance(input[i]);
			i++;
		}

		throw createError(
			`Unclosed multi-line comment starting at line ${commentStartLine}, column ${commentStartColumn}`,
			commentStartLine,
			commentStartColumn,
		);
	}

	function consumeString() {
		const stringStartIndex = i;
		const stringStartLine = currentLine;
		const stringStartColumn = currentColumn;
		advance(input[i]);
		i++;

		while (i < input.length) {
			const char = input[i];
			const previousChar = input[i - 1];
			advance(char);
			i++;

			if (char === '"' && previousChar !== "\\") {
				pushToken(
					input.slice(stringStartIndex, i),
					stringStartLine,
					stringStartColumn,
				);
				return;
			}
		}

		throw createError(
			`Unclosed string literal starting at line ${stringStartLine}, column ${stringStartColumn}`,
			stringStartLine,
			stringStartColumn,
		);
	}

	while (i < input.length) {
		const char = input[i];
		const nextChar = input[i + 1];

		if (char === ";" && nextChar === ";") {
			flushToken();
			skipLineComment();
			continue;
		}

		if (char === "(" && nextChar === ";") {
			flushToken();
			skipBlockComment();
			continue;
		}

		if (char === '"') {
			flushToken();
			consumeString();
			continue;
		}

		if (char === "(" || char === ")") {
			if (flushToken()) {
				continue;
			}
			pushToken(char, currentLine, currentColumn);
			advance(char);
			i++;
			continue;
		}

		if (isWhitespace(char)) {
			if (flushToken()) {
				continue;
			}
			advance(char);
			i++;
			continue;
		}

		if (tokenStartIndex === -1) {
			tokenStartIndex = i;
			tokenStartLine = currentLine;
			tokenStartColumn = currentColumn;
		}
		advance(char);
		i++;
	}

	flushToken();

	const filteredTokens = tokens.filter((token) => token.length > 0);

	Object.defineProperty(filteredTokens, "sourceMap", {
		value: sourceMap,
		enumerable: false,
	});

	return filteredTokens;
}
