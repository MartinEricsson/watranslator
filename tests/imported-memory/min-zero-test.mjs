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

export default async function testImportedMemoryMinZero() {
	const wat = `(module
		(memory (import "e" "m") 0)
	)`;
	const wasmBuffer = new Uint8Array(compileToWASM(parseWAT(wat)));
	const importSection = getSection(wasmBuffer, 2);

	let offset = readULEB(importSection, 0).next;
	const moduleLength = readULEB(importSection, offset);
	offset = moduleLength.next + moduleLength.value;
	const fieldLength = readULEB(importSection, offset);
	offset = fieldLength.next + fieldLength.value;
	const kind = importSection[offset++];
	if (kind !== 0x02) {
		throw new Error(`Expected memory import kind, got ${kind}`);
	}
	const flags = importSection[offset++];
	const min = readULEB(importSection, offset);

	if (flags !== 0) {
		throw new Error(`Expected min-only memory flags 0, got ${flags}`);
	}
	if (min.value !== 0) {
		throw new Error(`Expected imported memory min 0, got ${min.value}`);
	}

	const memory = new WebAssembly.Memory({ initial: 0 });
	await WebAssembly.instantiate(wasmBuffer, { e: { m: memory } });

	console.log("✅ Imported memory min-zero test passed!");
	return true;
}
