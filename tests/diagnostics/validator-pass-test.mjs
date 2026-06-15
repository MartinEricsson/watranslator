import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";
import { expectCompileError } from "../test-utils.mjs";

export default async function testValidatorPass() {
	await expectCompileError(
		`(module
			(func (export "bad") (result i32)
				i64.const 1
				i64.const 2
				i32.add)
		)`,
		/Stack type mismatch/,
	);

	await expectCompileError(
		`(module
			(func (export "bad")
				br 5)
		)`,
		/Branch depth 5 exceeds/,
	);

	await expectCompileError(
		`(module
			(func $start (param i32))
			(start $start)
		)`,
		/Start function must not have parameters or results/,
	);

	await expectCompileError(
		`(module
			(memory 1 shared)
		)`,
		/Shared memory declarations must include a maximum size/,
	);

	await expectCompileError(
		`(module
			(memory 1)
			(func (export "bad") (param i32) (result i32)
				local.get 0
				i32.load align=8)
		)`,
		/Cannot exceed natural alignment/,
	);

	await expectCompileError(
		`(module
			(global i32 (local.get 0))
		)`,
		/Global initializer must be a constant expression/,
	);

	await expectCompileError(
		`(module
			(table 1 externref)
			(elem (i32.const 0) $f)
			(func $f)
		)`,
		/Element segment type funcref does not match table type externref/,
	);

	const reexportWat = `(module
		(import "env" "memory" (memory 1))
		(export "memory" (memory 0))
	)`;
	const wasmBuffer = new Uint8Array(compileToWASM(parseWAT(reexportWat)));
	if (!WebAssembly.validate(wasmBuffer)) {
		throw new Error("Expected re-exported imported memory module to validate");
	}

	console.log("✅ Validator pass test passed!");
	return true;
}
