import { createDiagnostic } from "../diagnostics.mjs";

export function validateElementTableTypes(module) {
	for (const element of module.elements || []) {
		const tableIndex =
			typeof element.tableIndex === "string" &&
			element.tableIndex.startsWith("$")
				? module.tables.findIndex((table) => table.id === element.tableIndex)
				: Number.parseInt(element.tableIndex ?? 0, 10);
		const table = module.tables?.[Number.isNaN(tableIndex) ? 0 : tableIndex];

		if (!table) continue;

		const elemType = element.type || "funcref";
		if (elemType !== table.type) {
			throw createDiagnostic({
				stage: "validate",
				code: "WAT_ELEMENT_TABLE_TYPE_MISMATCH",
				message: `Element segment type ${elemType} does not match table type ${table.type}`,
				position: element.position || module.position,
			});
		}
	}
}
