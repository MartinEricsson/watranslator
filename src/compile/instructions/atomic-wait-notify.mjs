import { encodeULEB128 } from "../compile-utils.mjs";

const ATOMIC_PREFIX = 0xFE;
const ATOMIC_NOTIFY = 0x00;
const ATOMIC_WAIT32 = 0x01;
const ATOMIC_WAIT64 = 0x02;

export function compileAtomicWaitNotify(instr, func, body, module) {
    // Handle memory.atomic.notify, memory.atomic.wait32, memory.atomic.wait64
    if (instr.type === 'memory.atomic.notify') {
        // Add atomic prefix (0xFE) for all atomic operations
        body.push(ATOMIC_PREFIX);
        body.push(ATOMIC_NOTIFY);

        // Memory alignment (4 bytes = 2^2)
        // Must use ULEB128 encoding for alignment value
        body.push(...encodeULEB128(2));

        // Default offset is 0
        body.push(...encodeULEB128(0));

        return true;
    }

    if (instr.type === 'memory.atomic.wait32') {
        // Add atomic prefix (0xFE) for all atomic operations
        body.push(ATOMIC_PREFIX);
        body.push(ATOMIC_WAIT32);

        // Memory alignment (4 bytes = 2^2)
        // Must use ULEB128 encoding for alignment value
        body.push(...encodeULEB128(2));

        // Default offset is 0
        body.push(...encodeULEB128(0));

        return true;
    }

    if (instr.type === 'memory.atomic.wait64') {
        // Add atomic prefix (0xFE) for all atomic operations
        body.push(ATOMIC_PREFIX);
        body.push(ATOMIC_WAIT64);

        // Memory alignment (8 bytes = 2^3)
        // Must use ULEB128 encoding for alignment value
        body.push(...encodeULEB128(3));

        // Default offset is 0
        body.push(...encodeULEB128(0));

        return true;
    }

    return false;
}