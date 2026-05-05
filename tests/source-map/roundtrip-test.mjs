import assert from "node:assert";
import { compile } from "../../src/index.mjs";

const wat = `(module
  (func $helper (param $x i32) (result i32)
    local.get $x
    i32.const 1
    i32.add)

  (func (export "mapped") (param $n i32) (result i32)
    block $exit (result i32)
      local.get $n
      i32.const 0
      i32.lt_s
      br_if $exit
      local.get $n
      i32.const 10
      i32.gt_s
      if (result i32)
        i32.const 10
      else
        local.get $n
        call $helper
      end
    end)
)`;

function tokenAt(lines, entry) {
	const line = lines[entry.line];
	if (line === undefined) {
		return "";
	}

	const column = entry.column;
	if (column < 0 || column >= line.length) {
		return "";
	}

	const source = line.slice(column);
	const match = source.match(/^[^\s()]+/);
	return match?.[0] ?? "";
}

export default async function testSourceMapRoundTrip(debug = false) {
	try {
		const result = await compile(wat, {
			sourceMap: true,
			filename: "roundtrip.wat",
		});
		const sourceMap = JSON.parse(result.sourceMap);
		const lines = wat.split("\n");

		assert.ok(sourceMap.length > 0, "expected source map entries");

		for (const [index, entry] of sourceMap.entries()) {
			const token = tokenAt(lines, entry);
			assert.notStrictEqual(
				token,
				"",
				`mapping ${index} should resolve to a non-empty WAT token`,
			);
			assert.strictEqual(entry.file, "roundtrip.wat");
			assert.strictEqual(typeof entry.funcIndex, "number");
			assert.strictEqual(typeof entry.bodyOffset, "number");
		}

		const mappedTokens = sourceMap.map((entry) => tokenAt(lines, entry));
		for (const expected of [
			"local.get",
			"i32.const",
			"br_if",
			"if",
			"else",
			"call",
			"end",
		]) {
			assert.ok(
				mappedTokens.includes(expected),
				`source map should include ${expected}`,
			);
		}

		if (debug) {
			console.log(
				`round-tripped ${sourceMap.length} source map mappings to WAT tokens`,
			);
		}

		return true;
	} catch (error) {
		console.error("source map round-trip test failed:", error);
		return false;
	}
}
