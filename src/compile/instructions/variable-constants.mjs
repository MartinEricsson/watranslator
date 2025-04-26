import wasmConstants from "../constants.mjs";
import {
    encodeSLEB128,
    encodeSLEB128BigInt,
    encodeF64
} from "../compile-utils.mjs";

const {
    INSTR
} = wasmConstants;

export function compileVariableConstants(instr, body) {
    if (instr.type === 'i32.const') {
        body.push(INSTR.I32_CONST);
        body.push(...encodeSLEB128(instr.value));
        return true;
    }

    if (instr.type === 'i64.const') {
        body.push(INSTR.I64_CONST);
        body.push(...encodeSLEB128BigInt(instr.value));
        return true;
    }

    if (instr.type === 'f32.const') {
        body.push(INSTR.F32_CONST);

        // Convert the float to its IEEE 754 representation and add to the binary
        const buffer = new ArrayBuffer(4);
        new Float32Array(buffer)[0] = instr.value;
        const bytes = new Uint8Array(buffer);
        body.push(...bytes);
        return true;
    }

    if (instr.type === 'f64.const') {
        body.push(INSTR.F64_CONST);
        body.push(...encodeF64(instr.value));
        return true;
    }

    return false;
}