import { createDiagnostic } from "../diagnostics.mjs";

export function validateExportTargets(module) {
	const importCounts = {
		func: 0,
		global: 0,
		memory: 0,
		table: 0,
	};

	for (const imp of module.imports || []) {
		if (imp.kind === "func") importCounts.func++;
		else if (imp.kind === "global") importCounts.global++;
		else if (imp.kind === "memory") importCounts.memory++;
		else if (imp.kind === "table") importCounts.table++;
	}

	const kindCounts = {
		func: (module.functions || []).length,
		global: (module.globals || []).length,
		memory: importCounts.memory + (module.memories || []).length,
		table: importCounts.table + (module.tables || []).length,
	};

	for (const [name, exportData] of Object.entries(module.exports || {})) {
		const count = kindCounts[exportData.kind] ?? 0;
		if (
			!Number.isInteger(exportData.index) ||
			exportData.index < 0 ||
			exportData.index >= count
		) {
			throw createDiagnostic({
				stage: "validate",
				code: "WAT_INVALID_EXPORT",
				message: `Invalid export target for "${name}"`,
				position: module.position,
				note: `Export kind \`${exportData.kind}\` has no item at index ${exportData.index}.`,
			});
		}
	}
}
