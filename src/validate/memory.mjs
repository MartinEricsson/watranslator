import {
	getAtomicInstructionNaturalAlignment,
	getInstructionNaturalAlignment,
} from "../compile/compile-utils.mjs";
import { createDiagnostic } from "../diagnostics.mjs";

const memoryInstructions = (instructions = []) => {
	const result = [];
	for (const instr of instructions) {
		if (!instr || typeof instr !== "object") continue;
		if (
			typeof instr.type === "string" &&
			(instr.type.includes(".load") || instr.type.includes(".store"))
		) {
			result.push(instr);
		}
		result.push(...memoryInstructions(instr.instructions || []));
		result.push(...memoryInstructions(instr.thenInstructions || []));
		result.push(...memoryInstructions(instr.elseInstructions || []));
	}
	return result;
};

export function validateSharedMemoryLimits(module) {
	for (const memory of module.memories || []) {
		if (memory.shared && memory.max === null) {
			throw createDiagnostic({
				stage: "validate",
				code: "WAT_SHARED_MEMORY_REQUIRES_MAX",
				message: "Shared memory declarations must include a maximum size",
				position: memory.position || module.position,
			});
		}
	}

	for (const imp of module.imports || []) {
		if (imp.kind === "memory" && imp.shared && imp.max === null) {
			throw createDiagnostic({
				stage: "validate",
				code: "WAT_SHARED_MEMORY_REQUIRES_MAX",
				message: "Shared memory imports must include a maximum size",
				position: imp.position || module.position,
			});
		}
	}
}

export function validateMemargAlignments(module) {
	for (const func of module.functions || []) {
		for (const instr of memoryInstructions(func.instructions || [])) {
			if (instr.align === undefined || instr.align === null) continue;
			const natural = instr.type.startsWith("v128.")
				? getSIMDNaturalAlignment(instr.type)
				: instr.type.includes(".atomic.")
					? getAtomicInstructionNaturalAlignment(instr.type)
					: getInstructionNaturalAlignment(instr.type);
			if (natural === undefined) continue;
			if (instr.align > natural) {
				const isAtomic = instr.type.includes(".atomic.");
				throw createDiagnostic({
					stage: "validate",
					code: "WAT_INVALID_MEMARG_ALIGN",
					message: isAtomic
						? `Invalid atomic alignment value: ${instr.align}. Atomic operations require natural alignment of ${natural}`
						: `Invalid alignment value: ${instr.align}. Cannot exceed natural alignment of ${natural}`,
					position: instr.position || func.position || module.position,
				});
			}
		}
	}
}

function getSIMDNaturalAlignment(instrType) {
	if (instrType === "v128.load" || instrType === "v128.store") return 4;
	if (instrType.includes("64")) return 3;
	if (instrType.includes("32")) return 2;
	if (instrType.includes("16")) return 1;
	return 0;
}
