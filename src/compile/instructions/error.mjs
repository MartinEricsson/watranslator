import { createDiagnostic } from "../../diagnostics.mjs";

export function createError(instr, func, module, message) {
	// Get source position by cascading through available sources
	const pos = instr?.position || // First try instruction position
		instr?.operand?.position || // Then operand position
		instr?.value?.position || // Then value position
		func?.position || // Then function position
		module?.position || { line: 0, column: 0 }; // Then module position // Fallback default

	return createDiagnostic({
		stage: "compile",
		code: "WAT_COMPILE",
		message,
		position: pos,
		context: {
			instruction: instr
				? {
						type: instr.type,
						operand: instr.operand,
						value: instr.value,
						position: instr.position,
					}
				: undefined,
			function: func
				? {
						name: func.name,
						position: func.position,
					}
				: undefined,
			module: module
				? {
						position: module.position,
					}
				: undefined,
		},
	});
}
