import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { tokenize } from "../../src/tokenize.mjs";

const MIN_WAT_BYTES = 100_000;
const EXPECTED_WAT_BYTES = 110_072;
const EXPECTED_TOKEN_COUNT = 15_045;
const EXPECTED_TOKEN_SHA256 =
	"810ea9cfe31cbbc846663e957e23e208b688237fd71d1cd201b172bfa75c44ca";
const MAX_TOKENIZE_MS = 1_500;

function buildWat() {
	const lines = ["(module", "  (; skipped block comment ;)", "  (memory 1)"];
	let index = 0;

	while (lines.join("\n").length < 110_000) {
		lines.push(`  (func $f${index} (param $p i32) (result i32)`);
		lines.push(`    local.get $p ;; line comment ${index}`);
		lines.push(`    i32.load offset=${index % 97} align=2`);
		lines.push("    drop");
		lines.push(`    i32.const ${index}`);
		lines.push("  )");

		if (index % 11 === 0) {
			lines.push(`  (data (i32.const ${index}) "payload \\22 ${index}")`);
		}

		index++;
	}

	lines.push(")");
	return lines.join("\n");
}

export default async function testTokenize100KB(debug = false) {
	try {
		const wat = buildWat();
		const bytes = Buffer.byteLength(wat);

		if (bytes < MIN_WAT_BYTES || bytes !== EXPECTED_WAT_BYTES) {
			throw new Error(`Expected ${EXPECTED_WAT_BYTES} WAT bytes, got ${bytes}`);
		}

		const start = performance.now();
		const tokens = tokenize(wat);
		const elapsed = performance.now() - start;
		const tokenHash = createHash("sha256")
			.update(JSON.stringify(Array.from(tokens)))
			.digest("hex");
		const firstLoadIndex = tokens.findIndex((token) =>
			token.startsWith("i32.load offset=0 align=2"),
		);

		if (elapsed > MAX_TOKENIZE_MS) {
			throw new Error(
				`Expected 100KB tokenization under ${MAX_TOKENIZE_MS}ms, got ${elapsed.toFixed(1)}ms`,
			);
		}

		if (tokens.length !== EXPECTED_TOKEN_COUNT) {
			throw new Error(
				`Expected ${EXPECTED_TOKEN_COUNT} tokens, got ${tokens.length}`,
			);
		}

		if (tokenHash !== EXPECTED_TOKEN_SHA256) {
			throw new Error(
				`Expected token SHA-256 ${EXPECTED_TOKEN_SHA256}, got ${tokenHash}`,
			);
		}

		if (tokens[0] !== "(" || tokens[tokens.length - 1] !== ")") {
			throw new Error("Expected token stream to retain module parens");
		}

		const firstLoadLocation = tokens.sourceMap.get(firstLoadIndex);
		const lastTokenLocation = tokens.sourceMap.get(tokens.length - 1);
		if (
			firstLoadLocation?.line !== 6 ||
			firstLoadLocation?.column !== 5 ||
			lastTokenLocation?.line !== 4646 ||
			lastTokenLocation?.column !== 1
		) {
			throw new Error("Expected source map locations to remain stable");
		}

		if (debug) {
			console.log("Tokenize 100KB", {
				elapsed,
				bytes,
				tokens: tokens.length,
				tokenHash,
			});
		}

		return true;
	} catch (error) {
		console.error("Tokenize 100KB test failed:", error);
		return false;
	}
}
