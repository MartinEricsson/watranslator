import { createDiagnostic } from "../diagnostics.mjs";

const numericTypes = new Set(["i32", "i64", "f32", "f64"]);

const binaryOps = new Map([
	["i32.add", ["i32", "i32"]],
	["i32.sub", ["i32", "i32"]],
	["i32.mul", ["i32", "i32"]],
	["i32.div_s", ["i32", "i32"]],
	["i32.div_u", ["i32", "i32"]],
	["i32.rem_s", ["i32", "i32"]],
	["i32.rem_u", ["i32", "i32"]],
	["i64.add", ["i64", "i64"]],
	["i64.sub", ["i64", "i64"]],
	["i64.mul", ["i64", "i64"]],
	["i64.div_s", ["i64", "i64"]],
	["i64.div_u", ["i64", "i64"]],
	["i64.rem_s", ["i64", "i64"]],
	["i64.rem_u", ["i64", "i64"]],
	["f32.add", ["f32", "f32"]],
	["f32.sub", ["f32", "f32"]],
	["f32.mul", ["f32", "f32"]],
	["f32.div", ["f32", "f32"]],
	["f64.add", ["f64", "f64"]],
	["f64.sub", ["f64", "f64"]],
	["f64.mul", ["f64", "f64"]],
	["f64.div", ["f64", "f64"]],
]);

const constResultType = (type) =>
	type === "i32.const"
		? "i32"
		: type === "i64.const"
			? "i64"
			: type === "f32.const"
				? "f32"
				: type === "f64.const"
					? "f64"
					: null;

const popType = (stack, expected, instr, module, func) => {
	const actual = stack.pop();
	if (actual === undefined) {
		return undefined;
	}

	if (
		expected !== "any" &&
		actual !== expected &&
		numericTypes.has(actual) &&
		numericTypes.has(expected)
	) {
		throw createDiagnostic({
			stage: "validate",
			code: "WAT_STACK_TYPE_MISMATCH",
			message: `Stack type mismatch for ${instr.type}: expected ${expected}, got ${actual}`,
			position: instr.position || func.position || module.position,
		});
	}

	return actual;
};

const localTypesFor = (func) => {
	const types = new Map();
	const ordered = [...(func.parameters || []), ...(func.locals || [])];
	for (let i = 0; i < ordered.length; i++) {
		types.set(String(i), ordered[i].type);
		if (ordered[i].name) types.set(ordered[i].name, ordered[i].type);
	}
	return types;
};

const globalTypesFor = (module) => {
	const types = new Map();
	for (let i = 0; i < (module.globals || []).length; i++) {
		const global = module.globals[i];
		types.set(String(i), global.type);
		if (global.name) types.set(global.name, global.type);
	}
	return types;
};

const functionTypesFor = (module) => {
	const types = new Map();
	for (let i = 0; i < (module.functions || []).length; i++) {
		const func = module.functions[i];
		types.set(String(i), func);
		if (func.name) types.set(func.name, func);
	}
	return types;
};

function validateInstructionStack(instr, context) {
	const { stack, module, func, locals, globals, functions } = context;
	const constType = constResultType(instr.type);
	if (constType) {
		stack.push(constType);
		return;
	}

	if (instr.type === "get_local" || instr.type === "local.get") {
		const type = locals.get(String(instr.operand));
		if (type) stack.push(type);
		return;
	}

	if (instr.type === "set_local" || instr.type === "local.set") {
		const type = locals.get(String(instr.operand));
		if (type) popType(stack, type, instr, module, func);
		return;
	}

	if (instr.type === "local.tee") {
		const type = locals.get(String(instr.operand));
		if (type) popType(stack, type, instr, module, func);
		if (type) stack.push(type);
		return;
	}

	if (instr.type === "global.get") {
		const type = globals.get(String(instr.operand));
		if (type) stack.push(type);
		return;
	}

	if (instr.type === "global.set") {
		const type = globals.get(String(instr.operand));
		if (type) popType(stack, type, instr, module, func);
		return;
	}

	if (binaryOps.has(instr.type)) {
		const [operandType, resultType] = binaryOps.get(instr.type);
		popType(stack, operandType, instr, module, func);
		popType(stack, operandType, instr, module, func);
		stack.push(resultType);
		return;
	}

	if (instr.type?.endsWith(".eqz")) {
		const operandType = instr.type.startsWith("i64.") ? "i64" : "i32";
		popType(stack, operandType, instr, module, func);
		stack.push("i32");
		return;
	}

	if (instr.type === "drop") {
		popType(stack, "any", instr, module, func);
		return;
	}

	if (instr.type === "call") {
		const target = functions.get(String(instr.functionName));
		if (!target) return;
		for (const param of [...(target.parameters || [])].reverse()) {
			popType(stack, param.type, instr, module, func);
		}
		stack.push(...(target.results || []));
		return;
	}

	if (instr.type?.endsWith(".load") || instr.type?.includes(".load")) {
		popType(stack, "i32", instr, module, func);
		if (instr.type.startsWith("i64.")) stack.push("i64");
		else if (instr.type.startsWith("f32.")) stack.push("f32");
		else if (instr.type.startsWith("f64.")) stack.push("f64");
		else if (instr.type.startsWith("v128.")) stack.push("v128");
		else stack.push("i32");
		return;
	}

	if (instr.type?.endsWith(".store") || instr.type?.includes(".store")) {
		const valueType = instr.type.startsWith("i64.")
			? "i64"
			: instr.type.startsWith("f32.")
				? "f32"
				: instr.type.startsWith("f64.")
					? "f64"
					: instr.type.startsWith("v128.")
						? "v128"
						: "i32";
		popType(stack, valueType, instr, module, func);
		popType(stack, "i32", instr, module, func);
		return;
	}

	if (instr.type === "block" || instr.type === "loop") {
		for (const nested of instr.instructions || []) {
			validateInstructionStack(nested, context);
		}
		return;
	}

	if (instr.type === "if") {
		popType(stack, "i32", instr, module, func);
		const base = [...stack];
		const thenStack = [...base];
		const elseStack = [...base];
		for (const nested of instr.thenInstructions || []) {
			validateInstructionStack(nested, { ...context, stack: thenStack });
		}
		for (const nested of instr.elseInstructions || []) {
			validateInstructionStack(nested, { ...context, stack: elseStack });
		}
		stack.splice(0, stack.length, ...thenStack);
		return;
	}

	if (numericTypes.has(instr.resultType)) {
		stack.push(instr.resultType);
	}
}

export function validateStackTypes(module) {
	const globals = globalTypesFor(module);
	const functions = functionTypesFor(module);

	for (const func of module.functions || []) {
		if (func.import) continue;
		const context = {
			module,
			func,
			stack: [],
			locals: localTypesFor(func),
			globals,
			functions,
		};

		for (const instr of func.instructions || []) {
			validateInstructionStack(instr, context);
		}
	}
}
