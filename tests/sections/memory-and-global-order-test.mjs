import assert from "node:assert";
import { SECTION } from "../../src/compile/constants.mjs";
import { compile } from "../../src/index.mjs";

function readULEB(bytes, offset) {
	let value = 0;
	let shift = 0;
	let position = offset;
	while (position < bytes.length) {
		const byte = bytes[position++];
		value |= (byte & 0x7f) << shift;
		if ((byte & 0x80) === 0) {
			return { value, next: position };
		}
		shift += 7;
	}
	throw new Error("Unexpected end of ULEB128");
}

function sectionIds(bytes) {
	const ids = [];
	let offset = 8;
	while (offset < bytes.length) {
		const sectionId = bytes[offset++];
		const sectionSize = readULEB(bytes, offset);
		offset = sectionSize.next + sectionSize.value;
		ids.push(sectionId);
	}
	return ids;
}

export default async function testMemoryAndGlobalOrder() {
	try {
		const wat = `(module (memory 1) (global $g i32 (i32.const 7)) (func (export "f") (result i32) global.get $g))`;
		const binary = await compile(wat);

		assert.strictEqual(WebAssembly.validate(binary), true);

		const ids = sectionIds(binary);
		const memoryIdx = ids.indexOf(SECTION.MEMORY);
		const globalIdx = ids.indexOf(SECTION.GLOBAL);
		assert.ok(memoryIdx !== -1, "memory section should be present");
		assert.ok(globalIdx !== -1, "global section should be present");
		assert.ok(
			memoryIdx < globalIdx,
			"memory section must precede global section",
		);

		for (let i = 1; i < ids.length; i++) {
			assert.ok(ids[i] >= ids[i - 1], "section ids must be in ascending order");
		}

		const { instance } = await WebAssembly.instantiate(binary);
		assert.strictEqual(instance.exports.f(), 7);

		return true;
	} catch (error) {
		console.error("Memory and global order test failed:", error);
		return false;
	}
}
