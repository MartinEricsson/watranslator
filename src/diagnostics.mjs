const STAGE_NAMES = {
	tokenize: "TokenizeError",
	parse: "ParseError",
	validate: "ValidationError",
	compile: "CompileError",
};

function normalizePosition(position) {
	if (
		position &&
		typeof position.line === "number" &&
		typeof position.column === "number"
	) {
		return position;
	}

	return { line: 1, column: 1 };
}

function toArray(value) {
	if (!value) {
		return [];
	}

	return Array.isArray(value) ? value : [value];
}

function formatExpected(expected) {
	const values = toArray(expected);

	if (values.length === 0) {
		return "";
	}

	return values.map((item) => `\`${item}\``).join(", ");
}

function formatFound(found) {
	if (found === null || found === undefined) {
		return "end of input";
	}

	return `\`${found}\``;
}

function renderCaret(lineText, column, endColumn) {
	const safeColumn = Math.max(1, column || 1);
	const safeEndColumn = Math.max(safeColumn, endColumn || safeColumn);
	const prefix = " ".repeat(safeColumn - 1);
	const width = Math.max(1, safeEndColumn - safeColumn + 1);
	return `${prefix}${"^".repeat(width)}`;
}

function renderCodeFrame(source, position, endPosition) {
	if (!source) {
		return "";
	}

	const lines = String(source).split("\n");
	const lineIndex = Math.max(0, (position?.line || 1) - 1);
	const lineText = lines[lineIndex];

	if (lineText === undefined) {
		return "";
	}

	const lineNumber = String(lineIndex + 1);
	const gutter = `${lineNumber} | `;
	const endColumn =
		endPosition?.line === position?.line
			? endPosition.column
			: position?.column;

	return [
		"  |",
		`${gutter}${lineText}`,
		`  | ${renderCaret(lineText, position?.column || 1, endColumn)}`,
	].join("\n");
}

export function formatDiagnostic(error) {
	const context = error.context || {};
	const stageName = error.name || STAGE_NAMES[context.stage] || "CompilerError";
	const code = context.code ? `[${context.code}]` : "";
	const position = normalizePosition(context.position);
	const parts = [
		`${stageName}${code}: ${error.summary || error.message}`,
		`at line ${position.line}, column ${position.column}`,
	];

	if (context.filename) {
		parts.push(` --> ${context.filename}:${position.line}:${position.column}`);
	}

	const frame = renderCodeFrame(context.source, position, context.endPosition);
	if (frame) {
		parts.push(frame);
	}

	if (context.expected?.length) {
		parts.push(`expected: ${formatExpected(context.expected)}`);
	}

	if (context.found !== undefined) {
		parts.push(`found: ${formatFound(context.found)}`);
	}

	if (context.note) {
		parts.push(`note: ${context.note}`);
	}

	if (context.hint) {
		parts.push(`help: ${context.hint}`);
	}

	return parts.join("\n");
}

export function createDiagnostic({
	stage = "compile",
	code = "WAT000",
	message,
	position,
	endPosition,
	found,
	expected,
	note,
	hint,
	context = {},
	filename = "input.wat",
	source,
}) {
	const error = new Error(message);
	error.name = STAGE_NAMES[stage] || "CompilerError";
	error.summary = message;
	error.code = code;
	error.stage = stage;
	error.context = {
		...context,
		stage,
		code,
		position: normalizePosition(position),
		endPosition,
		found,
		expected: toArray(expected),
		note,
		hint,
		filename,
		source,
	};
	error.message = formatDiagnostic(error);
	return error;
}

export function isDiagnostic(error) {
	return Boolean(error?.context?.stage && error?.summary);
}

export function enhanceError(error, overrides = {}) {
	if (isDiagnostic(error)) {
		const nextError = error;
		nextError.context = {
			...nextError.context,
			...overrides.context,
			stage: overrides.stage || nextError.context.stage,
			code: overrides.code || nextError.context.code,
			position: normalizePosition(
				overrides.position || nextError.context.position,
			),
			endPosition: overrides.endPosition || nextError.context.endPosition,
			found:
				overrides.found !== undefined
					? overrides.found
					: nextError.context.found,
			expected: toArray(overrides.expected || nextError.context.expected),
			note: overrides.note || nextError.context.note,
			hint: overrides.hint || nextError.context.hint,
			filename: overrides.filename || nextError.context.filename || "input.wat",
			source: overrides.source || nextError.context.source,
		};
		nextError.name =
			STAGE_NAMES[nextError.context.stage] || nextError.name || "CompilerError";
		nextError.code = nextError.context.code;
		nextError.summary = overrides.message || nextError.summary;
		nextError.message = formatDiagnostic(nextError);
		return nextError;
	}

	return createDiagnostic({
		stage: overrides.stage || error?.context?.stage || "compile",
		code: overrides.code || error?.code || error?.context?.code || "WAT000",
		message: overrides.message || error?.message || "Compilation failed",
		position: overrides.position || error?.context?.position,
		endPosition: overrides.endPosition || error?.context?.endPosition,
		found:
			overrides.found !== undefined ? overrides.found : error?.context?.found,
		expected: overrides.expected || error?.context?.expected,
		note: overrides.note || error?.context?.note,
		hint: overrides.hint || error?.context?.hint,
		context: {
			...(error?.context || {}),
			...overrides.context,
		},
		filename: overrides.filename || error?.context?.filename || "input.wat",
		source: overrides.source || error?.context?.source,
	});
}
