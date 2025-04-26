import { parseWAT } from "./parser/parser.mjs"
import { compileToWASM } from "./compile/compile.mjs"

/*
    * This module provides functions to compile WebAssembly Text Format (WAT) code
    * into WebAssembly Binary Format (WASM) using the `parseWAT` and `compileToWASM`
    * functions.
    */
const compile = async (wat) => {
    const parsed = parseWAT(wat);
    const compiled = compileToWASM(parsed);
    return compiled;
}

export {
    compile,
}