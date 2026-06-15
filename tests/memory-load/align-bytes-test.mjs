import assert from "node:assert";
import { compile } from "../../src/index.mjs";
import { assertBytesEqual, expectCompileError } from "../test-utils.mjs";

const ALIGN4_HEX =
	"0061736d0100000001060160027f7f000302010005030100010a0b010900200020013602000b";
const ALIGN1_HEX =
	"0061736d0100000001060160027f7f000302010005030100010a0b010900200020013600000b";

export default async function testAlignBytes() {
	try {
		const load4 = await compile(
			"(module (memory 1) (func (param i32) (result i32) local.get 0 i32.load align=4))",
		);
		assert.strictEqual(WebAssembly.validate(load4), true);

		const load8 = await compile(
			"(module (memory 1) (func (param i32) (result i64) local.get 0 i64.load align=8))",
		);
		assert.strictEqual(WebAssembly.validate(load8), true);

		await expectCompileError(
			"(module (memory 1) (func (param i32) (result i32) local.get 0 i32.load align=8))",
			/Cannot exceed natural alignment/,
		);

		assertBytesEqual(
			await compile(
				"(module (memory 1) (func (param i32) (param i32) local.get 0 local.get 1 i32.store align=4))",
			),
			ALIGN4_HEX,
		);
		assertBytesEqual(
			await compile(
				"(module (memory 1) (func (param i32) (param i32) local.get 0 local.get 1 i32.store align=1))",
			),
			ALIGN1_HEX,
		);

		return true;
	} catch (error) {
		console.error("Align bytes test failed:", error);
		return false;
	}
}
