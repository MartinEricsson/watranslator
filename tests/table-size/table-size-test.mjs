import assert from "node:assert";
import { readTestData } from "../test-utils.mjs";

async function testTableSize(debug = false) {
	try {
		const { wasmBuffer, ast } = await readTestData(
			"table-size/table-size.wat",
			debug,
		);

		assert(
			ast[0].tables && ast[0].tables.length === 2,
			"Should have 2 tables in AST",
		);
		assert.strictEqual(ast[0].tables[0].min, 5, "Table 1 min size should be 5");
		assert.strictEqual(
			ast[0].tables[1].min,
			10,
			"Table 2 min size should be 10",
		);
		assert.strictEqual(
			ast[0].tables[1].max,
			20,
			"Table 2 max size should be 20",
		);

		const { instance } = await WebAssembly.instantiate(wasmBuffer);

		const table1 = instance.exports.t1;
		const table2 = instance.exports.t2;
		assert(table1 instanceof WebAssembly.Table, "Table 1 should be exported");
		assert(table2 instanceof WebAssembly.Table, "Table 2 should be exported");

		const getSizeT1 = instance.exports.get_size_t1;
		const getSizeT2 = instance.exports.get_size_t2;
		const growAndCheck = instance.exports.grow_and_check;
		const sizeAfterFill = instance.exports.size_after_fill;

		assert.strictEqual(getSizeT1(), 5, "Table 1 size should be 5");
		assert.strictEqual(getSizeT2(), 10, "Table 2 size should be 10");

		const [beforeGrow, afterGrow] = growAndCheck();
		assert.strictEqual(beforeGrow, 10, "Size before grow should be 10");
		assert.strictEqual(afterGrow, 15, "Size after grow should be 15");
		assert.strictEqual(table2.length, 15, "Table 2 length should match");

		const sizeAfterFillResult = sizeAfterFill();
		assert.strictEqual(
			sizeAfterFillResult,
			5,
			"Size should remain 5 after fill",
		);
		assert.strictEqual(table1.length, 5, "Table 1 length should remain 5");

		if (debug) console.log("✅ Basic table size test passed");

		const { wasmBuffer: wasmBuffer2, ast: ast2 } = await readTestData(
			"table-size/table-size-multi.wat",
			debug,
		);

		assert(
			ast2[0].tables && ast2[0].tables.length === 3,
			"Should have 3 tables in multi-table AST",
		);
		assert.strictEqual(
			ast2[0].tables[0].min,
			3,
			"Multi-table test: Table 0 min size should be 3",
		);
		assert.strictEqual(
			ast2[0].tables[1].min,
			7,
			"Multi-table test: Table 1 min size should be 7",
		);
		assert.strictEqual(
			ast2[0].tables[2].min,
			11,
			"Multi-table test: Table 2 min size should be 11",
		);

		const { instance: instance2 } = await WebAssembly.instantiate(wasmBuffer2);
		const sizes = instance2.exports.sizes;
		const [size0, size1, size2] = sizes();

		assert.strictEqual(size0, 3, "Multi-table: Table 0 size should be 3");
		assert.strictEqual(size1, 7, "Multi-table: Table 1 size should be 7");
		assert.strictEqual(size2, 11, "Multi-table: Table 2 size should be 11");

		if (debug) console.log("✅ Multi-table size test passed");

		if (debug) console.log("✅ Table size test passed");
		return true;
	} catch (error) {
		console.error("❌ Table size test failed:", error);
		throw error;
	}
}

export default testTableSize;
