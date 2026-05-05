const STRUCTURAL_KEYS = new Set([
	"op",
	"type",
	"position",
	"endPosition",
	"instructions",
	"thenInstructions",
	"elseInstructions",
	"inElseBranch",
	"sExpression",
	"immediates",
]);

function buildImmediates(instr) {
	const immediates = {};

	for (const [key, value] of Object.entries(instr)) {
		if (!STRUCTURAL_KEYS.has(key)) {
			immediates[key] = value;
		}
	}

	return immediates;
}

export function normalizeInstructionShape(instr) {
	if (!instr || typeof instr !== "object") {
		return instr;
	}

	if (instr.type && !instr.op) {
		instr.op = instr.type;
	}

	Reflect.deleteProperty(instr, "type");

	if (!instr.immediates) {
		instr.immediates = buildImmediates(instr);
	}

	for (const child of instr.instructions || []) {
		normalizeInstructionShape(child);
	}

	for (const child of instr.thenInstructions || []) {
		normalizeInstructionShape(child);
	}

	for (const child of instr.elseInstructions || []) {
		normalizeInstructionShape(child);
	}

	return instr;
}

export function normalizeModuleInstructionShapes(module) {
	for (const func of module.functions || []) {
		for (const instr of func.instructions || []) {
			normalizeInstructionShape(instr);
		}
	}

	return module;
}
