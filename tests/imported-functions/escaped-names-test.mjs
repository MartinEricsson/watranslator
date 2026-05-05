import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

export default async function testEscapedImportExportNames() {
	const wat = String.raw`
		(module
			(import "env\0a" "add\"one" (func $add (param i32 i32) (result i32)))
			(func (export "total\u{2603}") (result i32)
				i32.const 4
				i32.const 5
				call $add)
		)
	`;

	const ast = parseWAT(wat);
	const wasmBuffer = new Uint8Array(compileToWASM(ast));
	if (!WebAssembly.validate(wasmBuffer)) {
		throw new Error("Expected escaped import/export name module to validate");
	}

	const { instance } = await WebAssembly.instantiate(wasmBuffer, {
		"env\n": {
			'add"one': (a, b) => a + b,
		},
	});

	if (instance.exports["total☃"]() !== 9) {
		throw new Error("Expected escaped export/import names to resolve");
	}

	console.log("✅ Escaped import/export names test passed!");
	return true;
}
