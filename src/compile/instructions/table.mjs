import { encodeULEB128 } from "../compile-utils.mjs";
import { INSTR } from "../constants.mjs";
import { createError } from "./error.mjs";

function resolveTableIndex(ref, instr, func, module) {
	if (typeof ref === "string" && ref.startsWith("$")) {
		const idx = (module.tables || []).findIndex(
			(t) => t.id === ref || t.name === ref,
		);
		if (idx === -1) {
			throw createError(instr, func, module, `Unknown table: ${ref}`);
		}
		return idx;
	}
	const n = Number(ref ?? 0);
	if (!Number.isInteger(n) || n < 0) {
		throw createError(instr, func, module, `Invalid table index: ${ref}`);
	}
	return n;
}

function resolveElementIndex(ref, instr, func, module) {
	if (typeof ref === "string" && ref.startsWith("$")) {
		const idx = (module.elements || []).findIndex((e) => e.id === ref);
		if (idx === -1) {
			throw createError(instr, func, module, `Unknown element segment: ${ref}`);
		}
		return idx;
	}
	const n = Number(ref ?? 0);
	if (!Number.isInteger(n) || n < 0) {
		throw createError(instr, func, module, `Invalid element index: ${ref}`);
	}
	return n;
}

export function compileTableInstruction(instr, func, module, body) {
	if (instr.op === "table.init") {
		try {
			const elementIndex = resolveElementIndex(
				instr.elementIndex,
				instr,
				func,
				module,
			);
			const tableIndex = resolveTableIndex(
				instr.tableIndex,
				instr,
				func,
				module,
			);

			if (module.elements && elementIndex >= module.elements.length) {
				throw createError(
					instr,
					func,
					module,
					`Element segment ${elementIndex} does not exist. Module has ${module.elements.length} element segments.`,
				);
			}

			if (module.tables && tableIndex >= module.tables.length) {
				throw createError(
					instr,
					func,
					module,
					`Table index ${tableIndex} is out of bounds. Module has ${module.tables.length} tables.`,
				);
			}

			body.push(INSTR.BULK_PREFIX);
			body.push(INSTR.TABLE_INIT);
			body.push(...encodeULEB128(elementIndex));
			body.push(...encodeULEB128(tableIndex));
			return true;
		} catch (err) {
			if (
				err.message.includes("is out of bounds") ||
				err.message.includes("does not exist") ||
				err.message.includes("Unknown") ||
				err.message.includes("Invalid")
			) {
				throw createError(instr, func, module, err.message);
			}
			throw createError(
				instr,
				func,
				module,
				`Invalid table.init instruction: ${err.message}`,
			);
		}
	}
	if (instr.op === "table.size") {
		try {
			const tableIndex = resolveTableIndex(
				instr.tableIndex,
				instr,
				func,
				module,
			);
			body.push(INSTR.BULK_PREFIX);
			body.push(INSTR.TABLE_SIZE);
			body.push(...encodeULEB128(tableIndex));
			return true;
		} catch (err) {
			throw createError(
				instr,
				func,
				module,
				`Invalid table.size instruction: ${err.message}`,
			);
		}
	}
	if (instr.op === "table.grow") {
		try {
			const tableIndex = resolveTableIndex(
				instr.tableIndex,
				instr,
				func,
				module,
			);
			if (module.tables && tableIndex >= module.tables.length) {
				throw createError(
					instr,
					func,
					module,
					`Table index ${tableIndex} is out of bounds. Module has ${module.tables.length} tables.`,
				);
			}

			body.push(INSTR.BULK_PREFIX);
			body.push(INSTR.TABLE_GROW);
			body.push(...encodeULEB128(tableIndex));
			return true;
		} catch (err) {
			throw createError(
				instr,
				func,
				module,
				`Invalid table.grow instruction: ${err.message}`,
			);
		}
	}
	if (instr.op === "table.get") {
		try {
			const tableIndex = resolveTableIndex(
				instr.tableIndex,
				instr,
				func,
				module,
			);
			body.push(INSTR.TABLE_GET);
			body.push(...encodeULEB128(tableIndex));
			return true;
		} catch (err) {
			throw createError(
				instr,
				func,
				module,
				`Invalid table.get instruction: ${err.message}`,
			);
		}
	}
	if (instr.op === "table.copy") {
		try {
			const destTableIndex = resolveTableIndex(
				instr.destTableIndex,
				instr,
				func,
				module,
			);
			const srcTableIndex = resolveTableIndex(
				instr.srcTableIndex,
				instr,
				func,
				module,
			);
			if (
				module.tables &&
				(destTableIndex >= module.tables.length ||
					srcTableIndex >= module.tables.length)
			) {
				throw createError(
					instr,
					func,
					module,
					`Table index out of bounds. Module has ${module.tables.length} tables.`,
				);
			}

			body.push(INSTR.BULK_PREFIX);
			body.push(INSTR.TABLE_COPY);
			body.push(...encodeULEB128(destTableIndex));
			body.push(...encodeULEB128(srcTableIndex));
			return true;
		} catch (err) {
			throw createError(
				instr,
				func,
				module,
				`Invalid table.copy instruction: ${err.message}`,
			);
		}
	}
	if (instr.op === "table.set") {
		try {
			const tableIndex = resolveTableIndex(
				instr.tableIndex,
				instr,
				func,
				module,
			);
			body.push(INSTR.TABLE_SET);
			body.push(...encodeULEB128(tableIndex));
			return true;
		} catch (err) {
			throw createError(
				instr,
				func,
				module,
				`Invalid table.set instruction: ${err.message}`,
			);
		}
	}
	if (instr.op === "elem.drop") {
		try {
			const elementIdx = resolveElementIndex(
				instr.elementIdx,
				instr,
				func,
				module,
			);
			if (module.elements && elementIdx >= module.elements.length) {
				throw createError(
					instr,
					func,
					module,
					`Element segment ${elementIdx} does not exist. Module has ${module.elements.length} element segments.`,
				);
			}

			body.push(INSTR.BULK_PREFIX);
			body.push(INSTR.ELEM_DROP);
			body.push(...encodeULEB128(elementIdx));
			return true;
		} catch (err) {
			throw createError(
				instr,
				func,
				module,
				`Invalid elem.drop instruction: ${err.message}`,
			);
		}
	}
	if (instr.op === "table.fill") {
		try {
			const tableIndex = resolveTableIndex(
				instr.tableIndex,
				instr,
				func,
				module,
			);
			if (module.tables && tableIndex >= module.tables.length) {
				throw createError(
					instr,
					func,
					module,
					`Table index ${tableIndex} is out of bounds. Module has ${module.tables.length} tables.`,
				);
			}

			body.push(INSTR.BULK_PREFIX);
			body.push(INSTR.TABLE_FILL);
			body.push(...encodeULEB128(tableIndex));
			return true;
		} catch (err) {
			throw createError(
				instr,
				func,
				module,
				`Invalid table.fill instruction: ${err.message}`,
			);
		}
	}

	return false;
}
