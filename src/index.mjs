import { compileToWASM } from "./compile/compile.mjs";
import { enhanceError } from "./diagnostics.mjs";
import { parseWAT } from "./parser/parser.mjs";

const utf8Encoder = new TextEncoder();

/*
 * This module provides functions to compile WebAssembly Text Format (WAT) code
 * into WebAssembly Binary Format (WASM) using the `parseWAT` and `compileToWASM`
 * functions.
 */
const compile = async (wat, options = {}) => {
	// Backwards compatible: if profiling requested, use profile helper
	if (options?.profile) return compileWithProfile(wat);
	try {
		const compileOptions = {
			...options,
			source: typeof wat === "string" ? wat : options.source,
		};
		const parsed = parseWAT(wat, compileOptions);
		const result = compileToWASM(parsed, compileOptions);

		// If source map is requested, return object with binary and sourceMap
		if (options?.sourceMap) {
			return {
				binary: result.binary || result,
				sourceMap: result.sourceMap,
			};
		}

		return result.binary || result;
	} catch (error) {
		throw enhanceError(error, {
			source: typeof wat === "string" ? wat : options.source,
			filename: options.filename || "input.wat",
		});
	}
};

const compileWithProfile = async (wat) => {
	const profile = {};
	const source = Array.isArray(wat) ? wat.join("\n") : String(wat);
	const tAllStart =
		typeof process !== "undefined" && process.hrtime?.bigint
			? process.hrtime.bigint()
			: BigInt(Math.floor(performance.now() * 1e6));
	const parsed = parseWAT(wat, {
		profile,
		source: typeof wat === "string" ? wat : undefined,
	});
	const compiled = compileToWASM(parsed, {
		profile,
		source: typeof wat === "string" ? wat : undefined,
	});
	const tAllEnd =
		typeof process !== "undefined" && process.hrtime?.bigint
			? process.hrtime.bigint()
			: BigInt(Math.floor(performance.now() * 1e6));
	profile.total_ns = Number(tAllEnd - tAllStart);
	profile.lines = Array.isArray(wat) ? wat.length : source.split("\n").length;
	profile.input_bytes = utf8Encoder.encode(source).byteLength;
	return { binary: compiled, profile };
};

export { compile, compileWithProfile };
