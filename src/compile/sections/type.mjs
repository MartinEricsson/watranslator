import { createBytesWriter } from "../bytes-writer.mjs";
import { getWasmType } from "../compile-utils.mjs";
import { SECTION } from "../constants.mjs";
import { createError } from "../instructions/error.mjs";

const signatureKey = (sig) =>
	JSON.stringify({
		params: sig.params || [],
		results: sig.results || [],
	});

export function getOrAddType(typeContext, sig) {
	const key = signatureKey(sig);
	if (typeContext.indexBySignature.has(key)) {
		return typeContext.indexBySignature.get(key);
	}

	const typeIndex = typeContext.entries.length;
	typeContext.indexBySignature.set(key, typeIndex);
	typeContext.entries.push({
		params: sig.params || [],
		results: sig.results || [],
	});
	return typeIndex;
}

function signatureFromFunction(func) {
	return {
		params: (func.parameters || []).map((param) => param.type),
		results: func.results || [],
	};
}

function compileFunctionType(writer, sig) {
	writer.writeByte(0x60); // Function type tag

	const paramTypes = sig.params.map((param) => getWasmType(param));
	writer.writeULEB128(paramTypes.length);
	for (const t of paramTypes) writer.writeByte(t);

	let resultTypes = [];
	try {
		if (sig.results && Array.isArray(sig.results)) {
			resultTypes = sig.results.map(getWasmType);
		}
	} catch (e) {
		const sigDesc = `(${(sig.params || []).join(", ")}) -> (${(sig.results || []).join(", ")})`;
		throw createError(null, null, null, `${e.message} in type ${sigDesc}`);
	}

	writer.writeULEB128(resultTypes.length);
	for (const t of resultTypes) writer.writeByte(t);
}

function walkInstructions(instructions, visitor) {
	for (const instr of instructions || []) {
		visitor(instr);
		walkInstructions(instr.instructions || [], visitor);
		walkInstructions(instr.thenInstructions || [], visitor);
		walkInstructions(instr.elseInstructions || [], visitor);
	}
}

export function typeSection(module, functions, multiValueBlockTypes, binary) {
	const typeContext = {
		entries: [],
		indexBySignature: new Map(),
	};

	for (const type of module.types || []) {
		type.typeIndex = getOrAddType(typeContext, {
			params: type.params || [],
			results: type.results || [],
		});
	}

	for (const func of functions) {
		func.typeIndex = getOrAddType(typeContext, signatureFromFunction(func));
	}

	for (const blockType of multiValueBlockTypes) {
		blockType.typeIndex = getOrAddType(typeContext, {
			params: [],
			results: blockType.types || [],
		});
		for (const instr of blockType.instructions) {
			instr.typeIndex = blockType.typeIndex;
		}
	}

	for (const func of functions) {
		walkInstructions(func.instructions, (instr) => {
			if (instr.op !== "call_indirect") return;

			if (instr.typeRef) {
				const typeEntry = (module.types || []).find(
					(type) => type.name === instr.typeRef,
				);
				if (typeEntry) {
					instr.typeIndex = typeEntry.typeIndex;
				}
			} else {
				instr.typeIndex = getOrAddType(typeContext, {
					params: instr.params || [],
					results: instr.results || [],
				});
			}
		});
	}

	// =================== TYPE SECTION ===================
	if (typeContext.entries.length > 0) {
		const typesVector = createBytesWriter();
		typesVector.writeULEB128(typeContext.entries.length);
		for (const typeEntry of typeContext.entries) {
			compileFunctionType(typesVector, typeEntry);
		}

		const section = createBytesWriter();
		section.writeByte(SECTION.TYPE);
		section.writeULEB128(typesVector.length);
		section.writeBytes(typesVector.toUint8Array());

		binary.writeBytes(section.toUint8Array());
	}

	return typeContext;
}
