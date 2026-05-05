import { createDiagnostic } from "../diagnostics.mjs";

const isNumericReference = (value) =>
	typeof value === "number" || /^\d+$/.test(String(value));

export function resolveFunction(module, ref) {
	if (typeof ref === "string" && ref.startsWith("$")) {
		return module.functions.find((func) => func.name === ref);
	}

	if (isNumericReference(ref)) {
		return module.functions[Number.parseInt(ref, 10)];
	}

	return null;
}

export function validateStartFunction(module) {
	if (module.start === null || module.start === undefined) {
		return;
	}

	const func = resolveFunction(module, module.start);
	if (!func) {
		throw createDiagnostic({
			stage: "validate",
			code: "WAT_UNKNOWN_START",
			message: `Unknown start function: ${module.start}`,
			position: module.position,
		});
	}

	if ((func.parameters || []).length > 0 || (func.results || []).length > 0) {
		throw createDiagnostic({
			stage: "validate",
			code: "WAT_INVALID_START_SIGNATURE",
			message: "Start function must not have parameters or results",
			position: func.position || module.position,
		});
	}
}
