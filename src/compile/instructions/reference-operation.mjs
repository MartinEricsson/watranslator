import wasmConstants from "../constants.mjs";
import { encodeSLEB128 } from "../compile-utils.mjs";

const { TYPE } = wasmConstants;

const REF_NULL = 0xD0; // ref.null
const REF_FUNC = 0xD2; // ref.func - Generated by 🤖
const REF_IS_NULL = 0xD1; // ref.is_null - Generated by 🤖

export function compileReferenceOpcodes(instr, func, module, body) {
    if (instr.type === 'ref.null') {
        // Generated by 🤖
        body.push(REF_NULL);
        // Push the reference type
        body.push(instr.refType === 'func' ? TYPE.FUNCREF : TYPE.EXTERNREF);
        return true;
    }

    if (instr.type === 'ref.func') {
        // Generated by 🤖
        body.push(REF_FUNC);
        // Find function index
        let funcIndex = -1;
        if (typeof instr.func === 'string' && instr.func.startsWith('$')) {
            // Look up function index by name
            funcIndex = module.functions.findIndex(f => f.name === instr.func);
            if (funcIndex === -1) {
                throw new Error(`Unknown function reference: ${instr.func}`);
            }
        } else {
            // Direct numeric index
            funcIndex = Number.parseInt(instr.func, 10) || 0;
        }
        // Push function index
        body.push(...encodeSLEB128(funcIndex));
        return true;
    }

    if (instr.type === 'ref.is_null') {
        // Generated by 🤖
        body.push(REF_IS_NULL);
        return true;
    }

    return false;
}