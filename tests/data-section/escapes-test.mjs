import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

export default async function testDataSectionEscapes() {
	const wat = String.raw`
		(module
			(memory 1)
			(data (i32.const 0) "\00\ff\t\n\r\\\"\'\u{1F600}")
			(func (export "read") (param $addr i32) (result i32)
				local.get $addr
				i32.load8_u)
		)
	`;

	const ast = parseWAT(wat);
	const wasmBuffer = new Uint8Array(compileToWASM(ast));
	if (!WebAssembly.validate(wasmBuffer)) {
		throw new Error("Expected data escape module to validate");
	}

	const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
	const expected = [
		0,
		255,
		9,
		10,
		13,
		92,
		34,
		39,
		...new TextEncoder().encode("😀"),
	];

	for (let i = 0; i < expected.length; i++) {
		const actual = instance.exports.read(i);
		if (actual !== expected[i]) {
			throw new Error(
				`Unexpected byte at ${i}: expected ${expected[i]}, got ${actual}`,
			);
		}
	}

	console.log("✅ Data section escapes test passed!");
	return true;
}
