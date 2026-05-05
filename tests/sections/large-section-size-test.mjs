import assert from "node:assert";
import { SECTION } from "../../src/compile/constants.mjs";
import { compile } from "../../src/index.mjs";

function readULEB(bytes, offset) {
	let value = 0;
	let shift = 0;
	let position = offset;
	let width = 0;

	while (position < bytes.length) {
		const byte = bytes[position++];
		width++;
		value |= (byte & 0x7f) << shift;
		if ((byte & 0x80) === 0) {
			return { value, width, next: position };
		}
		shift += 7;
	}

	throw new Error("Unexpected end of ULEB128");
}

function collectSections(bytes) {
	const sections = new Map();
	let offset = 8;

	while (offset < bytes.length) {
		const id = bytes[offset++];
		const size = readULEB(bytes, offset);
		const contentStart = size.next;
		const contentEnd = contentStart + size.value;

		sections.set(id, {
			id,
			size: size.value,
			sizePrefixWidth: size.width,
			contentStart,
			contentEnd,
		});

		offset = contentEnd;
	}

	return sections;
}

function buildLargeTypeModule() {
	const types = Array.from(
		{ length: 40 },
		(_, index) =>
			`  (type $t${index} (func ${"(param i32) ".repeat(index)}(result i32)))`,
	).join("\n");

	return `(module
${types}
)`;
}

function buildLargeBodyAndExportModule() {
	const functions = Array.from({ length: 140 }, (_, index) => {
		const nops = Array.from({ length: 2 }, () => "    nop").join("\n");
		return `  (func $f${index} (export "f${index}") (result i32)
${nops}
    i32.const ${index}
  )`;
	}).join("\n");

	return `(module
${functions}
)`;
}

function buildLargeDataModule() {
	const payload = "x".repeat(180);

	return `(module
  (memory 1)
  (data (i32.const 0) "${payload}")
)`;
}

const cases = [
	{
		name: "type section",
		wat: buildLargeTypeModule(),
		sections: [SECTION.TYPE],
	},
	{
		name: "function/export/code sections",
		wat: buildLargeBodyAndExportModule(),
		sections: [SECTION.FUNCTION, SECTION.EXPORT, SECTION.CODE],
	},
	{
		name: "data section",
		wat: buildLargeDataModule(),
		sections: [SECTION.DATA],
	},
];

export default async function testLargeSectionSizes(debug = false) {
	try {
		for (const testCase of cases) {
			const binary = await compile(testCase.wat);
			assert.ok(WebAssembly.validate(binary), `${testCase.name} validates`);

			const sections = collectSections(binary);
			for (const sectionId of testCase.sections) {
				const section = sections.get(sectionId);
				assert.ok(
					section,
					`${testCase.name} should include section ${sectionId}`,
				);
				assert.ok(
					section.size > 127,
					`${testCase.name} section ${sectionId} should exceed one-byte size range`,
				);
				assert.ok(
					section.sizePrefixWidth > 1,
					`${testCase.name} section ${sectionId} should use multi-byte ULEB size prefix`,
				);
			}
		}

		if (debug) {
			console.log("large section size prefixes verified");
		}

		return true;
	} catch (error) {
		console.error("large section size test failed:", error);
		return false;
	}
}
