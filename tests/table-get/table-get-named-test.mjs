import assert from "node:assert";
import { compile } from "../../src/index.mjs";

export default async function testTableGetNamed() {
	try {
		const wat = `(module
  (table $t 1 funcref)
  (func (export "g") (param i32) (result funcref)
    local.get 0
    table.get $t))`;

		const binary = await compile(wat);
		assert.strictEqual(WebAssembly.validate(binary), true);

		return true;
	} catch (error) {
		console.error("Table get named test failed:", error);
		return false;
	}
}
