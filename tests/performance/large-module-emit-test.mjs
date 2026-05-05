import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { compile } from "../../src/index.mjs";

const INSTRUCTION_COUNT = 50_000;
const EXPECTED_BYTE_LENGTH = 50_040;
const EXPECTED_SHA256 =
	"13759a54e07bdbdd9f55bc8c93e11e42c4569c115284c91d981de9bc7b420d1f";
const MAX_COMPILE_MS = 5_000;

function buildLargeModule() {
	const instructions = Array.from(
		{ length: INSTRUCTION_COUNT },
		() => "    nop",
	).join("\n");

	return `(module
  (func (export "run") (result i32)
${instructions}
    i32.const 7
  )
)`;
}

export default async function testLargeModuleEmit(debug = false) {
	try {
		const wat = buildLargeModule();
		const start = performance.now();
		const bytes = await compile(wat);
		const elapsed = performance.now() - start;
		const hash = createHash("sha256").update(bytes).digest("hex");

		if (elapsed > MAX_COMPILE_MS) {
			throw new Error(
				`Expected large module compile under ${MAX_COMPILE_MS}ms, got ${elapsed.toFixed(1)}ms`,
			);
		}

		if (bytes.byteLength !== EXPECTED_BYTE_LENGTH) {
			throw new Error(
				`Expected ${EXPECTED_BYTE_LENGTH} bytes, got ${bytes.byteLength}`,
			);
		}

		if (hash !== EXPECTED_SHA256) {
			throw new Error(`Expected SHA-256 ${EXPECTED_SHA256}, got ${hash}`);
		}

		if (!WebAssembly.validate(bytes)) {
			throw new Error("Expected generated large module to validate");
		}

		const { instance } = await WebAssembly.instantiate(bytes, {});
		if (instance.exports.run() !== 7) {
			throw new Error("Expected large module run() to return 7");
		}

		if (debug) {
			console.log("Large module emit", {
				elapsed,
				bytes: bytes.byteLength,
				hash,
			});
		}

		return true;
	} catch (error) {
		console.error("Large module emit test failed:", error);
		return false;
	}
}
