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

const cases = [
	{
		name: "type-only",
		wat: `(module
			(type $unreferenced (func (param i32) (result i32)))
		)`,
		sections: [SECTION.TYPE],
	},
	{
		name: "import-only",
		wat: `(module
			(memory (import "env" "memory") 0)
		)`,
		sections: [SECTION.IMPORT],
		imports: { env: { memory: new WebAssembly.Memory({ initial: 0 }) } },
	},
	{
		name: "function-only",
		wat: `(module
			(func)
		)`,
		sections: [SECTION.TYPE, SECTION.FUNCTION, SECTION.CODE],
	},
	{
		name: "table-only",
		wat: `(module
			(table 1 funcref)
		)`,
		sections: [SECTION.TABLE],
	},
	{
		name: "memory-only",
		wat: `(module
			(memory 1)
		)`,
		sections: [SECTION.MEMORY],
	},
	{
		name: "global-only",
		wat: `(module
			(global i32 (i32.const 0))
		)`,
		sections: [SECTION.GLOBAL],
	},
	{
		name: "export-memory",
		wat: `(module
			(memory 1)
			(export "memory" (memory 0))
		)`,
		sections: [SECTION.MEMORY, SECTION.EXPORT],
	},
	{
		name: "start",
		wat: `(module
			(func $start)
			(start $start)
		)`,
		sections: [SECTION.TYPE, SECTION.FUNCTION, SECTION.START, SECTION.CODE],
	},
	{
		name: "element",
		wat: `(module
			(table 1 funcref)
			(func $f)
			(elem (i32.const 0) $f)
		)`,
		sections: [
			SECTION.TYPE,
			SECTION.FUNCTION,
			SECTION.TABLE,
			SECTION.ELEMENT,
			SECTION.CODE,
		],
	},
	{
		name: "data",
		wat: `(module
			(memory 1)
			(data (i32.const 0) "x")
		)`,
		sections: [SECTION.MEMORY, SECTION.DATA_COUNT, SECTION.DATA],
	},
];

export default async function testSectionPresenceMatrix(debug = false) {
	try {
		for (const testCase of cases) {
			const binary = await compile(testCase.wat);
			const actualSections = sectionIds(binary);

			assert.deepStrictEqual(
				actualSections,
				testCase.sections,
				`${testCase.name} section ids`,
			);
			assert.ok(
				WebAssembly.validate(binary),
				`${testCase.name} module should validate`,
			);
			await WebAssembly.instantiate(binary, testCase.imports ?? {});
		}

		if (debug) {
			console.log(`verified ${cases.length} section presence cases`);
		}

		return true;
	} catch (error) {
		console.error("section presence matrix test failed:", error);
		return false;
	}
}
