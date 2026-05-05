import { encodeULEB128, getWasmType } from "../compile-utils.mjs";
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

function compileFunctionType(sig) {
	// Function type tag
	const typeSectionContent = [0x60]; // Function type

	// Param types
	const paramTypes = sig.params.map((param) => getWasmType(param));
	typeSectionContent.push(...encodeULEB128(paramTypes.length));
	typeSectionContent.push(...paramTypes);

	// Result types - properly handle multi-value returns
	let resultTypes = [];
	try {
		if (sig.results && Array.isArray(sig.results)) {
			resultTypes = sig.results.map(getWasmType);
		}
	} catch (e) {
		throw createError(null, null, null, e.message);
	}

	typeSectionContent.push(...encodeULEB128(resultTypes.length));
	typeSectionContent.push(...resultTypes);

	return typeSectionContent;
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
	module.typeContext = typeContext;

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
		// Encode types for all functions
		const typeSection = [SECTION.TYPE]; // Section ID

		const typesVector = [...encodeULEB128(typeContext.entries.length)];

		for (const typeEntry of typeContext.entries) {
			typesVector.push(...compileFunctionType(typeEntry));
		}

		// Section size
		typeSection.push(...encodeULEB128(typesVector.length));

		// Section content
		typeSection.push(...typesVector);

		binary.push(...typeSection);
	}
}
