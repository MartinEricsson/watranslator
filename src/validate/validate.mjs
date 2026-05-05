import { createDiagnostic } from "../diagnostics.mjs";
import { validateElementTableTypes } from "./elements.mjs";
import { validateExportTargets } from "./exports.mjs";
import { validateGlobalInitExpressions } from "./globals.mjs";
import {
	validateMemargAlignments,
	validateSharedMemoryLimits,
} from "./memory.mjs";
import { validateStackTypes } from "./stack.mjs";
import { validateStartFunction } from "./start.mjs";

const VALUE_TYPES = new Set([
	"i32",
	"i64",
	"f32",
	"f64",
	"v128",
	"funcref",
	"externref",
	"anyfunc",
]);

function ensureUnique(items, selectKey, selectPosition, messageFactory) {
	const seen = new Map();

	for (const item of items) {
		const key = selectKey(item);
		if (!key) {
			continue;
		}

		if (seen.has(key)) {
			throw createDiagnostic({
				stage: "validate",
				code: "WAT_DUPLICATE",
				message: messageFactory(key),
				position: selectPosition(item),
				note: `First declaration is at line ${seen.get(key).line}, column ${seen.get(key).column}.`,
			});
		}

		seen.set(key, selectPosition(item) || { line: 1, column: 1 });
	}
}

function validateTypeValue(type, position, kind) {
	if (!type || VALUE_TYPES.has(type)) {
		return;
	}

	throw createDiagnostic({
		stage: "validate",
		code: "WAT_UNKNOWN_TYPE",
		message: `Unknown ${kind}: ${type}`,
		position,
		expected: Array.from(VALUE_TYPES),
	});
}

function validateTypeList(types, position, kind) {
	for (const type of types || []) {
		validateTypeValue(type, position, kind);
	}
}

function isNumericReference(value) {
	return typeof value === "number" || /^\d+$/.test(String(value));
}

function validateInstruction(instr, scope, module) {
	if (!instr || typeof instr !== "object") {
		return;
	}

	switch (instr.op) {
		case "call":
			if (
				typeof instr.functionName === "string" &&
				instr.functionName.startsWith("$") &&
				!scope.functionNames.has(instr.functionName)
			) {
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_UNKNOWN_FUNCTION",
					message: `Unknown function: ${instr.functionName}`,
					position: instr.position || scope.position,
					hint: "Function names must be declared or imported before they are referenced.",
				});
			}
			break;
		case "call_indirect":
			if (
				instr.typeRef &&
				!module.types.some((type) => type.name === instr.typeRef)
			) {
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_UNKNOWN_TYPE",
					message: `Unknown type reference: ${instr.typeRef}`,
					position: instr.position || scope.position,
				});
			}
			break;
		case "ref.func":
			if (
				typeof instr.func === "string" &&
				instr.func.startsWith("$") &&
				!scope.functionNames.has(instr.func)
			) {
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_UNKNOWN_FUNCTION",
					message: `Unknown function reference: ${instr.func}`,
					position: instr.position || scope.position,
				});
			}
			break;
		case "get_local":
		case "set_local":
		case "local.tee":
		case "local.get":
		case "local.set":
			if (
				typeof instr.operand === "string" &&
				instr.operand.startsWith("$") &&
				!scope.localNames.has(instr.operand)
			) {
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_UNKNOWN_LOCAL",
					message: `Unknown local variable: ${instr.operand}`,
					position: instr.position || scope.position,
				});
			}
			break;
		case "global.get":
		case "global.set":
			if (
				typeof instr.operand === "string" &&
				instr.operand.startsWith("$") &&
				!scope.globalNames.has(instr.operand)
			) {
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_UNKNOWN_GLOBAL",
					message: `Unknown global variable: ${instr.operand}`,
					position: instr.position || scope.position,
				});
			}
			break;
		case "br":
		case "br_if":
			if (
				isNumericReference(instr.label) &&
				Number.parseInt(instr.label, 10) > Math.max(0, scope.blockDepth - 1)
			) {
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_BRANCH_DEPTH_OUT_OF_BOUNDS",
					message: `Branch depth ${instr.label} exceeds current control depth ${scope.blockDepth}`,
					position: instr.position || scope.position,
				});
			}
			if (
				typeof instr.label === "string" &&
				instr.label.startsWith("$") &&
				!scope.blockLabels.has(instr.label)
			) {
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_UNKNOWN_LABEL",
					message: `Unknown branch target: ${instr.label}`,
					position: instr.position || scope.position,
				});
			}
			break;
		case "br_table":
			for (const label of [...(instr.labels || []), instr.defaultLabel]) {
				if (
					isNumericReference(label) &&
					Number.parseInt(label, 10) > Math.max(0, scope.blockDepth - 1)
				) {
					throw createDiagnostic({
						stage: "validate",
						code: "WAT_BRANCH_DEPTH_OUT_OF_BOUNDS",
						message: `Branch depth ${label} exceeds current control depth ${scope.blockDepth}`,
						position: instr.position || scope.position,
					});
				}
			}
			break;
		default:
			break;
	}

	if (instr.op === "block" || instr.op === "loop") {
		const nextLabels = new Set(scope.blockLabels);
		if (instr.label) {
			nextLabels.add(instr.label);
		}

		for (const nested of instr.instructions || []) {
			validateInstruction(
				nested,
				{ ...scope, blockLabels: nextLabels, blockDepth: scope.blockDepth + 1 },
				module,
			);
		}
		return;
	}

	if (instr.op === "if") {
		const nextScope = { ...scope, blockDepth: scope.blockDepth + 1 };
		for (const nested of instr.thenInstructions || []) {
			validateInstruction(nested, nextScope, module);
		}
		for (const nested of instr.elseInstructions || []) {
			validateInstruction(nested, nextScope, module);
		}
	}
}

function validateExports(module) {
	const kindCollections = {
		func: module.functions || [],
		global: module.globals || [],
		memory: module.memories || [],
		table: module.tables || [],
	};

	ensureUnique(
		Object.entries(module.exports || {}).map(([name, value]) => ({
			name,
			...value,
		})),
		(item) => item.name,
		(item) =>
			kindCollections[item.kind]?.[item.index]?.position || module.position,
		(name) => `Duplicate export name: ${name}`,
	);
}

function validateStart(module) {
	if (module.start === null || module.start === undefined) {
		return;
	}

	if (
		typeof module.start === "string" &&
		module.start.startsWith("$") &&
		!module.functions.some((func) => func.name === module.start)
	) {
		throw createDiagnostic({
			stage: "validate",
			code: "WAT_UNKNOWN_START",
			message: `Unknown start function: ${module.start}`,
			position: module.position,
		});
	}

	if (isNumericReference(module.start)) {
		const index = Number.parseInt(module.start, 10);
		if (index < 0 || index >= module.functions.length) {
			throw createDiagnostic({
				stage: "validate",
				code: "WAT_UNKNOWN_START",
				message: `Unknown start function: ${module.start}`,
				position: module.position,
			});
		}
	}
}

function validateElements(module) {
	for (const element of module.elements || []) {
		for (const funcRef of element.functionIndices || []) {
			if (
				typeof funcRef === "string" &&
				funcRef.startsWith("$") &&
				!module.functions.some((func) => func.name === funcRef)
			) {
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_UNKNOWN_FUNCTION",
					message: `Unknown function reference in element section: ${funcRef}`,
					position: element.position || module.position,
				});
			}
		}
	}
}

export function validateModule(module) {
	ensureUnique(
		module.functions || [],
		(func) => func.name,
		(func) => func.position || module.position,
		(name) => `Duplicate function name: ${name}`,
	);
	ensureUnique(
		module.globals || [],
		(global) => global.name,
		(global) => global.position || module.position,
		(name) => `Duplicate global name: ${name}`,
	);
	ensureUnique(
		module.memories || [],
		(memory) => memory.id,
		(memory) => memory.position || module.position,
		(name) => `Duplicate memory name: ${name}`,
	);
	ensureUnique(
		module.tables || [],
		(table) => table.id,
		(table) => table.position || module.position,
		(name) => `Duplicate table name: ${name}`,
	);
	ensureUnique(
		module.types || [],
		(type) => type.name,
		(type) => type.position || module.position,
		(name) => `Duplicate type name: ${name}`,
	);

	validateExports(module);
	validateExportTargets(module);
	validateStart(module);
	validateStartFunction(module);
	validateElements(module);
	validateElementTableTypes(module);
	validateSharedMemoryLimits(module);
	validateMemargAlignments(module);
	validateGlobalInitExpressions(module);
	validateStackTypes(module);
	for (const global of module.globals || []) {
		validateTypeValue(
			global.type,
			global.position || module.position,
			"global type",
		);
	}
	for (const type of module.types || []) {
		validateTypeList(
			type.params,
			type.position || module.position,
			"parameter type",
		);
		validateTypeList(
			type.results,
			type.position || module.position,
			"result type",
		);
	}

	const scope = {
		position: module.position,
		functionNames: new Set(
			(module.functions || []).map((func) => func.name).filter(Boolean),
		),
		globalNames: new Set(
			(module.globals || []).map((global) => global.name).filter(Boolean),
		),
	};

	for (const func of module.functions || []) {
		const localNames = new Set(
			[...(func.parameters || []), ...(func.locals || [])]
				.map((item) => item.name)
				.filter(Boolean),
		);

		ensureUnique(
			[...(func.parameters || []), ...(func.locals || [])],
			(item) => item.name,
			() => func.position || module.position,
			(name) => `Duplicate local or parameter name: ${name}`,
		);
		validateTypeList(
			(func.parameters || []).map((item) => item.type),
			func.position || module.position,
			"parameter type",
		);
		validateTypeList(
			(func.locals || []).map((item) => item.type),
			func.position || module.position,
			"local type",
		);
		validateTypeList(
			func.results || [],
			func.position || module.position,
			"result type",
		);

		for (const instr of func.instructions || []) {
			validateInstruction(
				instr,
				{
					...scope,
					position: func.position || module.position,
					localNames,
					blockLabels: new Set(),
					blockDepth: 0,
				},
				module,
			);
		}
	}
}
