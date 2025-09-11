import { compileToWASM } from "./compile/compile.mjs";
import { parseWAT } from "./parser/parser.mjs";

/*
 * This module provides functions to compile WebAssembly Text Format (WAT) code
 * into WebAssembly Binary Format (WASM) using the `parseWAT` and `compileToWASM`
 * functions.
 */
const compile = async (wat, options = {}) => {
	// Backwards compatible: if profiling requested, use profile helper
	if (options?.profile) return compileWithProfile(wat);
	const parsed = parseWAT(wat, options);
	const result = compileToWASM(parsed, options);
	
	// If source map is requested, return object with binary and sourceMap
	if (options?.sourceMap) {
		return {
			binary: result.binary || result,
			sourceMap: result.sourceMap
		};
	}
	
	return result.binary || result;
};

const compileWithProfile = async (wat) => {
	const profile = {};
	const tAllStart = (typeof process !== "undefined" && process.hrtime?.bigint)
		? process.hrtime.bigint()
		: BigInt(Math.floor(performance.now() * 1e6));
	const parsed = parseWAT(wat, { profile });
	const compiled = compileToWASM(parsed, { profile });
	const tAllEnd = (typeof process !== "undefined" && process.hrtime?.bigint)
		? process.hrtime.bigint()
		: BigInt(Math.floor(performance.now() * 1e6));
	profile.total_ns = Number(tAllEnd - tAllStart);
	profile.lines = Array.isArray(wat) ? wat.length : String(wat).split('\n').length;
	profile.input_bytes = typeof wat === 'string' ? Buffer.byteLength(wat) : Buffer.byteLength(wat.join('\n'));
	return { binary: compiled, profile };
};

export { compile, compileWithProfile };
