import wasmConstants from "../constants.mjs";
import { encodeULEB128, getInstructionNaturalAlignment } from "../compile-utils.mjs";
import { createError } from "./error.mjs";

const {
    INSTR
} = wasmConstants;

const MEMORY_ACCESS_INSTR = new Map([
    ['i32.load', INSTR.I32_LOAD],
    ['i32.load8_s', INSTR.I32_LOAD8_S],
    ['i32.load8_u', INSTR.I32_LOAD8_U],
    ['i32.load16_s', INSTR.I32_LOAD16_S],
    ['i32.load16_u', INSTR.I32_LOAD16_U],
    ['i64.load', INSTR.I64_LOAD],
    ['i64.load8_s', INSTR.I64_LOAD8_S],
    ['i64.load8_u', INSTR.I64_LOAD8_U],
    ['i64.load16_s', INSTR.I64_LOAD16_S],
    ['i64.load16_u', INSTR.I64_LOAD16_U],
    ['i64.load32_s', INSTR.I64_LOAD32_S],
    ['i64.load32_u', INSTR.I64_LOAD32_U],
    ['f32.load', INSTR.F32_LOAD],
    ['f64.load', INSTR.F64_LOAD],
    ['i32.store', INSTR.I32_STORE],
    ['i32.store8', INSTR.I32_STORE8],
    ['i32.store16', INSTR.I32_STORE16],
    ['i64.store', INSTR.I64_STORE],
    ['i64.store8', INSTR.I64_STORE8],
    ['i64.store16', INSTR.I64_STORE16],
    ['i64.store32', INSTR.I64_STORE32],
    ['f32.store', INSTR.F32_STORE],
    ['f64.store', INSTR.F64_STORE]
]);

export function compileMemoryAccess(instr, func, body, module) {
    if (MEMORY_ACCESS_INSTR.has(instr.type)) {
        body.push(MEMORY_ACCESS_INSTR.get(instr.type));

        // Validate alignment is a valid value
        if (instr.align !== undefined) {
            // Check for negative alignment
            if (instr.align < 0) {
                throw createError(instr, func, module, `Invalid alignment value: ${instr.align}. Alignment must be a non-negative integer`);
            }

            // Check for non-integer alignment
            if (!Number.isInteger(instr.align)) {
                throw createError(instr, func, module, `Invalid alignment value: ${instr.align}. Alignment must be an integer`);
            }

            // In WebAssembly, alignment is specified as log2(alignment in bytes)
            // Valid values are integers from 0 to the natural alignment of the operation
            const naturalAlignment = getInstructionNaturalAlignment(instr.type);
            if (instr.align > naturalAlignment) {
                throw createError(instr, func, module, `Invalid alignment value: ${instr.align}. Cannot exceed natural alignment of ${naturalAlignment} for ${instr.type}`);
            }
        }

        // Validate offset is a valid number
        if (instr.offset !== undefined && Number.isNaN(instr.offset)) {
            throw createError(instr, func, module, `Invalid memory offset: ${instr.offset}. Offset must be a non-negative integer`);
        }

        // Memory arguments: alignment and offset
        body.push(...encodeULEB128(instr.align || 0));
        body.push(...encodeULEB128(instr.offset || 0));

        return true;
    }

    return false;
}