import {
	encodeULEB128,
	hasMultipleMemories,
	resolveMemoryIndex,
} from "../compile-utils.mjs";
import { INSTR } from "../constants.mjs";
import { createError } from "./error.mjs";

function resolveDataIndex(label, idx, instr, module) {
	if (label && module.datas) {
		const seg = module.datas.find((d) => d.id === label);
		if (seg) return module.datas.indexOf(seg);
		throw createError(instr, null, module, `Unknown data segment: ${label}`);
	}
	return idx ?? 0;
}

function compileMemoryInit(body, dataIndex) {
	body.push(INSTR.BULK_PREFIX);
	body.push(INSTR.MEMORY_INIT);
	body.push(...encodeULEB128(dataIndex));
	body.push(0x00);
}

function resolveMemoryIndexOrThrow(memoryRef, instr, module) {
	const memoryIndex = resolveMemoryIndex(memoryRef, module);
	if (memoryIndex === -1) {
		throw createError(
			instr,
			null,
			module,
			`Unknown memory reference: ${memoryRef}`,
		);
	}
	return memoryIndex;
}

export function compileMemoryInstruction(instr, body, module) {
	if (instr.op === "memory.size") {
		const memoryIndex =
			hasMultipleMemories(module) || instr.memoryRef != null
				? resolveMemoryIndexOrThrow(instr.memoryRef, instr, module)
				: 0;
		body.push(INSTR.MEMORY_SIZE);
		body.push(...encodeULEB128(memoryIndex));
		return true;
	}

	if (instr.op === "memory.grow") {
		const memoryIndex =
			hasMultipleMemories(module) || instr.memoryRef != null
				? resolveMemoryIndexOrThrow(instr.memoryRef, instr, module)
				: 0;
		body.push(INSTR.MEMORY_GROW);
		body.push(...encodeULEB128(memoryIndex));
		return true;
	}

	const hasDataSegments = module?.datas?.length > 0;

	if (!hasDataSegments) {
		if (instr.op === "memory.init" || instr.op === "data.drop") {
			return true;
		}
	}

	if (instr.op === "memory.fill") {
		const memoryIndex =
			hasMultipleMemories(module) || instr.memoryRef != null
				? resolveMemoryIndexOrThrow(instr.memoryRef, instr, module)
				: 0;
		body.push(INSTR.BULK_PREFIX);
		body.push(0x0b);
		body.push(...encodeULEB128(memoryIndex));
		return true;
	}

	if (instr.op === "memory.copy") {
		const destMemoryIndex =
			hasMultipleMemories(module) || instr.destMemoryRef != null
				? resolveMemoryIndexOrThrow(instr.destMemoryRef, instr, module)
				: 0;
		const srcMemoryIndex =
			hasMultipleMemories(module) || instr.srcMemoryRef != null
				? resolveMemoryIndexOrThrow(instr.srcMemoryRef, instr, module)
				: 0;
		body.push(INSTR.BULK_PREFIX);
		body.push(INSTR.MEMORY_COPY);
		body.push(...encodeULEB128(destMemoryIndex));
		body.push(...encodeULEB128(srcMemoryIndex));
		return true;
	}

	if (hasDataSegments) {
		if (instr.op === "memory.init") {
			const dataIndex = resolveDataIndex(
				instr.dataLabel,
				instr.segmentIdx,
				instr,
				module,
			);
			compileMemoryInit(body, dataIndex);
			return true;
		}

		if (instr.op === "data.drop") {
			const dataIndex = resolveDataIndex(
				instr.dataLabel,
				instr.segmentIdx,
				instr,
				module,
			);
			body.push(INSTR.BULK_PREFIX);
			body.push(INSTR.DATA_DROP);
			body.push(...encodeULEB128(dataIndex));
			return true;
		}
	}

	return false;
}
