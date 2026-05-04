import { compileToWASM } from "../../src/compile/compile.mjs";
import { parseWAT } from "../../src/parser/parser.mjs";

const buildDeepNestingWat = (depth) => {
	let body = "(block $exit (result i32)\n";
	for (let i = 0; i < depth; i++) {
		body += `(block $b${i}\n`;
	}
	body += "i32.const 42\n";
	body += "br $exit\n";
	for (let i = 0; i < depth; i++) {
		body += ")\n";
	}
	body += "i32.const 0\n";
	body += ")";

	return `(module
		(func (export "deep") (result i32)
			${body}
		)
		(func (export "table") (result i32)
			(block $outer (result i32)
				(block $inner (result i32)
					i32.const 91
					i32.const 1
					br_table $inner $outer))
		)
	)`;
};

const findInstruction = (instructions, predicate) => {
	for (const instr of instructions) {
		if (predicate(instr)) {
			return instr;
		}
		const nested = findInstruction(
			[
				...(instr.instructions || []),
				...(instr.thenInstructions || []),
				...(instr.elseInstructions || []),
			],
			predicate,
		);
		if (nested) {
			return nested;
		}
	}
	return null;
};

export default async function testDeepNestingControlFlow() {
	const wat = buildDeepNestingWat(320);
	const ast = parseWAT(wat);
	const deepFunc = ast[0].functions.find((func) => func.export === "deep");
	const branch = findInstruction(
		deepFunc.instructions,
		(instr) => instr.type === "br" && instr.label === "$exit",
	);

	if (!branch || branch.labelDepth !== 320) {
		throw new Error(
			`Expected parse-time branch depth 320, got ${branch?.labelDepth}`,
		);
	}

	const tableFunc = ast[0].functions.find((func) => func.export === "table");
	const branchTable = findInstruction(
		tableFunc.instructions,
		(instr) => instr.type === "br_table",
	);

	if (
		!branchTable ||
		branchTable.labelDepths[0] !== 0 ||
		branchTable.defaultLabelDepth !== 1
	) {
		throw new Error("Expected parse-time br_table depths [0] default 1");
	}

	const wasmBuffer = new Uint8Array(compileToWASM(ast));
	if (!WebAssembly.validate(wasmBuffer)) {
		throw new Error("Expected deep nesting module to validate");
	}

	const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
	if (instance.exports.deep() !== 42) {
		throw new Error("Expected deep branch to return 42");
	}
	if (instance.exports.table() !== 91) {
		throw new Error("Expected br_table branch to return 91");
	}

	console.log("✅ Deep nesting control-flow test passed!");
	return true;
}
