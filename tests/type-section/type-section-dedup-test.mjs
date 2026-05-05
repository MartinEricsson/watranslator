import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

const readULEB = (bytes, offset) => {
	let result = 0;
	let shift = 0;
	let position = offset;
	while (true) {
		const byte = bytes[position++];
		result |= (byte & 0x7f) << shift;
		if ((byte & 0x80) === 0) break;
		shift += 7;
	}
	return { value: result, next: position };
};

const getSection = (bytes, id) => {
	let offset = 8;
	while (offset < bytes.length) {
		const sectionId = bytes[offset++];
		const size = readULEB(bytes, offset);
		offset = size.next;
		const start = offset;
		const end = start + size.value;
		if (sectionId === id) return bytes.slice(start, end);
		offset = end;
	}
	throw new Error(`Section ${id} not found`);
};

export default async function testTypeSectionDedup() {
	const funcs = Array.from(
		{ length: 50 },
		(_, i) => `(func $f${i} (param i32 i32) (result i32)
			local.get 0
			local.get 1
			i32.add)`,
	).join("\n");

	const wat = `(module ${funcs})`;
	const wasmBuffer = new Uint8Array(compileToWASM(parseWAT(wat)));
	if (!WebAssembly.validate(wasmBuffer)) {
		throw new Error("Expected deduplicated type-section module to validate");
	}

	const typeSection = getSection(wasmBuffer, 1);
	const typeCount = readULEB(typeSection, 0);
	if (typeCount.value !== 1) {
		throw new Error(`Expected one deduplicated type, got ${typeCount.value}`);
	}

	const functionSection = getSection(wasmBuffer, 3);
	const functionCount = readULEB(functionSection, 0);
	if (functionCount.value !== 50) {
		throw new Error(`Expected 50 function entries, got ${functionCount.value}`);
	}

	let offset = functionCount.next;
	for (let i = 0; i < 50; i++) {
		const typeIndex = readULEB(functionSection, offset);
		if (typeIndex.value !== 0) {
			throw new Error(`Expected function ${i} to reference type 0`);
		}
		offset = typeIndex.next;
	}

	console.log("✅ Type section deduplication test passed!");
	return true;
}
