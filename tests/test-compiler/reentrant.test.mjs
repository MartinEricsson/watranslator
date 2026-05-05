import { readFile } from "node:fs/promises";
import { compile } from "../../src/index.mjs";

function makeModule(name, constant, repetitions) {
	const body = Array.from({ length: repetitions }, () => [
		"    i32.const 1",
		"    i32.add",
	])
		.flat()
		.join("\n");

	return `(module
  (func $${name} (export "${name}") (result i32)
    i32.const ${constant}
${body}
  )
)`;
}

function bytesEqual(left, right) {
	if (left.length !== right.length) {
		return false;
	}
	for (let i = 0; i < left.length; i++) {
		if (left[i] !== right[i]) {
			return false;
		}
	}
	return true;
}

async function assertNoModuleGlobalTapeState() {
	const tapeSource = await readFile(
		new URL("../../src/parser/tape.mjs", import.meta.url),
		"utf8",
	);

	const forbiddenPatterns = [
		/\nlet\s+tokens\s*=/,
		/\nlet\s+sourceMap\s*=/,
		/export\s+function\s+initTape\b/,
	];

	for (const pattern of forbiddenPatterns) {
		if (pattern.test(tapeSource)) {
			throw new Error(`tape.mjs reintroduced module-global state: ${pattern}`);
		}
	}
}

export default async function testReentrantCompiler() {
	try {
		await assertNoModuleGlobalTapeState();

		const watA = makeModule("a", 3, 600);
		const watB = makeModule("b", 11, 900);

		const [referenceA, referenceB] = await Promise.all([
			compile(watA),
			compile(watB),
		]);

		const interleavedCompiles = Array.from({ length: 12 }, (_, index) =>
			compile(index % 2 === 0 ? watA : watB),
		);
		const results = await Promise.all(interleavedCompiles);

		for (let i = 0; i < results.length; i++) {
			const expected = i % 2 === 0 ? referenceA : referenceB;
			if (!bytesEqual(results[i], expected)) {
				throw new Error(`compile result ${i} differed from its reference`);
			}
		}

		return true;
	} catch (error) {
		console.error("Reentrant compiler test failed:", error);
		return false;
	}
}
