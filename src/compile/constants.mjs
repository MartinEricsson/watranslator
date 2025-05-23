// WebAssembly constants organized by category
const wasmConstants = {
  // Binary Format
  BINARY: {
    MAGIC: [0x00, 0x61, 0x73, 0x6D],     // '\0asm'
    VERSION: [0x01, 0x00, 0x00, 0x00],   // 1
  },
  // Section IDs
  SECTION: {
    TYPE: 1,
    IMPORT: 2,       // Added import section - Generated by 🤖
    FUNCTION: 3,
    TABLE: 4,
    MEMORY: 5,
    GLOBAL: 6,
    EXPORT: 7,
    START: 8,
    ELEMENT: 9,
    CODE: 10,
    DATA: 11,
    DATA_COUNT: 12,  // For bulk memory operations
  },

  // Import Kinds - Generated by 🤖
  IMPORT_KIND: {
    FUNCTION: 0x00,
    TABLE: 0x01,
    MEMORY: 0x02,
    GLOBAL: 0x03,
  },
  // Value Types
  TYPE: {
    I32: 0x7F,
    I64: 0x7E,
    F32: 0x7D,
    F64: 0x7C,
    V128: 0x7B,     // For SIMD 128-bit vector
    FUNCREF: 0x70,
    EXTERNREF: 0x6F,
    ANYREF: 0x6E,   // For reference types
    FUNC: 0x60,     // Function type
    BLOCK_VOID: 0x40, // Empty block type (no value)
  },
  // Export Types
  EXPORT: {
    FUNC: 0x00,
    TABLE: 0x01,
    MEM: 0x02,
    GLOBAL: 0x03,
  },
  // Global Types
  GLOBAL: {
    CONST: 0x00,  // Immutable global
    VAR: 0x01,    // Mutable global
  },
  // Instructions
  INSTR: {
    // Variable access
    LOCAL_GET: 0x20,
    LOCAL_SET: 0x21,
    LOCAL_TEE: 0x22,   // local.tee
    GLOBAL_GET: 0x23,  // global.get
    GLOBAL_SET: 0x24,  // global.set - mutable globals

    // Function calls
    CALL: 0x10,        // call - direct function call
    CALL_INDIRECT: 0x11, // call_indirect - function pointer call

    // Constants
    I32_CONST: 0x41,
    I64_CONST: 0x42,   // i64.const
    F32_CONST: 0x43,   // f32.const
    F64_CONST: 0x44,   // f64.const

    // I32 arithmetic
    I32_ADD: 0x6A,
    I32_SUB: 0x6B,     // i32.sub
    I32_MUL: 0x6C,
    I32_DIV_S: 0x6D,   // i32.div_s - signed division
    I32_DIV_U: 0x6E,   // i32.div_u - unsigned division
    I32_REM_S: 0x6F,   // i32.rem_s - signed remainder
    I32_REM_U: 0x70,   // i32.rem_u - unsigned remainder

    // I32 bit manipulation
    I32_AND: 0x71,     // i32.and
    I32_OR: 0x72,      // i32.or
    I32_XOR: 0x73,     // i32.xor
    I32_SHL: 0x74,     // i32.shl
    I32_SHR_S: 0x75,   // i32.shr_s (signed shift right)
    I32_SHR_U: 0x76,   // i32.shr_u (unsigned shift right)
    I32_ROTL: 0x77,    // i32.rotl - rotate left
    I32_ROTR: 0x78,    // i32.rotr - rotate right

    // I32 comparison
    I32_EQZ: 0x45,     // i32.eqz (equal to zero)
    I32_EQ: 0x46,      // i32.eq (equal)
    I32_NE: 0x47,      // i32.ne (not equal)
    I32_LT_S: 0x48,    // i32.lt_s (signed less than)
    I32_LT_U: 0x49,    // i32.lt_u (unsigned less than)
    I32_GT_S: 0x4A,    // i32.gt_s (signed greater than)
    I32_GT_U: 0x4B,    // i32.gt_u (unsigned greater than)
    I32_LE_S: 0x4C,    // i32.le_s (signed less than or equal)
    I32_LE_U: 0x4D,    // i32.le_u (unsigned less than or equal)
    I32_GE_S: 0x4E,    // i32.ge_s (signed greater than or equal)
    I32_GE_U: 0x4F,    // i32.ge_u (unsigned greater than or equal)

    I32_CLZ: 0x67,     // i32.clz - count leading zeroes
    I32_CTZ: 0x68,     // i32.ctz - count trailing zeroes
    I32_POPCNT: 0x69,  // i32.popcnt - population count (number of set bits)

    I32_WRAP_I64: 0xA7, // i32.wrap_i64 - truncate i64 to i32
    I32_TRUNC_F32_S: 0xA8, // i32.trunc_f32_s - truncate f32 to i32 (signed)
    I32_TRUNC_F32_U: 0xA9, // i32.trunc_f32_u - truncate f32 to i32 (unsigned)
    I32_TRUNC_F64_S: 0xAA, // i32.trunc_f64_s - truncate f64 to i32 (signed)
    I32_TRUNC_F64_U: 0xAB, // i32.trunc_f64_u - truncate f64 to i32 (unsigned)
    I32_REINTERPRET_F32: 0xBC, // i32.reinterpret_f32 - reinterpret f32 as i32
    I32_EXTEND8_S: 0xC0, // i32.extend8_s - sign extend 8-bit to i32
    I32_EXTEND16_S: 0xC1, // i32.extend16_s - sign extend 16-bit to i32

    // I64 arithmetic and bitwise operations
    I64_ADD: 0x7C,     // i64.add
    I64_SUB: 0x7D,     // i64.sub
    I64_MUL: 0x7E,     // i64.mul
    I64_DIV_S: 0x7F,   // i64.div_s - signed division
    I64_DIV_U: 0x80,   // i64.div_u - unsigned division
    I64_REM_S: 0x81,   // i64.rem_s - signed remainder
    I64_REM_U: 0x82,   // i64.rem_u - unsigned remainder

    // I64 bit manipulation
    I64_AND: 0x83,     // i64.and
    I64_OR: 0x84,      // i64.or
    I64_XOR: 0x85,     // i64.xor
    I64_SHL: 0x86,     // i64.shl
    I64_SHR_S: 0x87,   // i64.shr_s (signed shift right)
    I64_SHR_U: 0x88,   // i64.shr_u (unsigned shift right)
    I64_ROTL: 0x89,    // i64.rotl - rotate left
    I64_ROTR: 0x8A,    // i64.rotr - rotate right

    // I64 comparison
    I64_EQZ: 0x50,     // i64.eqz (equal to zero)
    I64_EQ: 0x51,      // i64.eq (equal)
    I64_NE: 0x52,      // i64.ne (not equal)
    I64_LT_S: 0x53,    // i64.lt_s (signed less than)
    I64_LT_U: 0x54,    // i64.lt_u (unsigned less than)
    I64_GT_S: 0x55,    // i64.gt_s (signed greater than)
    I64_GT_U: 0x56,    // i64.gt_u (unsigned greater than)
    I64_LE_S: 0x57,    // i64.le_s (signed less than or equal)
    I64_LE_U: 0x58,    // i64.le_u (unsigned less than or equal)
    I64_GE_S: 0x59,    // i64.ge_s (signed greater than or equal)
    I64_GE_U: 0x5A,    // i64.ge_u (unsigned greater than or equal)

    // I64 additional operations
    I64_CLZ: 0x79,     // i64.clz - count leading zeroes
    I64_CTZ: 0x7A,     // i64.ctz - count trailing zeroes
    I64_POPCNT: 0x7B,  // i64.popcnt - population count (number of set bits)
    I64_EXTEND8_S: 0xC2, // i64.extend8_s - sign extend 8-bit to i64
    I64_EXTEND16_S: 0xC3, // i64.extend16_s - sign extend 16-bit to i64
    I64_EXTEND32_S: 0xC4, // i64.extend32_s - sign extend 32-bit to i64
    I64_EXTEND_I32_S: 0xAC, // i64.extend_i32_s - extend i32 to i64 (signed)
    I64_EXTEND_I32_U: 0xAD, // i64.extend_i32_u - extend i32 to i64 (unsigned)
    I64_TRUNC_F32_S: 0xAE, // i64.trunc_f32_s - truncate f32 to i64 (signed)
    I64_TRUNC_F32_U: 0xAF, // i64.trunc_f32_u - truncate f32 to i64 (unsigned)
    I64_TRUNC_F64_S: 0xB0, // i64.trunc_f64_s - truncate f64 to i64 (signed)
    I64_TRUNC_F64_U: 0xB1, // i64.trunc_f64_u - truncate f64 to i64 (unsigned)
    I64_REINTERPRET_F64: 0xBD, // i64.reinterpret_f64 - reinterpret f64 as i64

    // Stack manipulation
    DROP: 0x1A,        // drop - drop the top value from the stack
    SELECT: 0x1B,      // select - select one of two values based on condition
    SELECT_T: 0x1C,    // select t - typed select instruction with explicit result type

    // F32 operations
    F32_ADD: 0x92,     // f32.add
    F32_SUB: 0x93,     // f32.sub
    F32_MUL: 0x94,     // f32.mul
    F32_DIV: 0x95,     // f32.div
    F32_ABS: 0x8B,     // f32.abs - absolute value
    F32_NEG: 0x8C,     // f32.neg - negation
    F32_SQRT: 0x91,    // f32.sqrt - square root
    F32_MIN: 0x96,     // f32.min - minimum
    F32_MAX: 0x97,     // f32.max - maximum
    F32_CEIL: 0x8D,    // f32.ceil - ceiling (round up)
    F32_FLOOR: 0x8E,   // f32.floor - floor (round down)
    F32_TRUNC: 0x8F,   // f32.trunc - truncate (round toward zero)
    F32_NEAREST: 0x90, // f32.nearest - round to nearest integer
    F32_COPYSIGN: 0x98, // f32.copysign - copy sign from second operand

    // F32 comparison
    F32_EQ: 0x5B,      // f32.eq (equal)
    F32_NE: 0x5C,      // f32.ne (not equal)
    F32_LT: 0x5D,      // f32.lt (less than)
    F32_GT: 0x5E,      // f32.gt (greater than)
    F32_LE: 0x5F,      // f32.le (less than or equal)
    F32_GE: 0x60,      // f32.ge (greater than or equal)

    // F32 conversion operations
    F32_CONVERT_I32_S: 0xB2, // f32.convert_i32_s (signed int to float)
    F32_CONVERT_I32_U: 0xB3, // f32.convert_i32_u (unsigned int to float)
    F32_CONVERT_I64_S: 0xB4, // f32.convert_i64_s (signed long to float)
    F32_CONVERT_I64_U: 0xB5, // f32.convert_i64_u (unsigned long to float)
    F32_DEMOTE_F64: 0xB6,    // f32.demote_f64 (double to float)
    F32_REINTERPRET_I32: 0xBE, // f32.reinterpret_i32

    // Control flow
    NOP: 0x01,        // nop - no operation
    UNREACHABLE: 0x00, // unreachable - trap execution
    BLOCK: 0x02,       // block
    LOOP: 0x03,        // loop
    IF: 0x04,          // if
    ELSE: 0x05,        // else
    BR: 0x0C,          // br
    BR_IF: 0x0D,       // br_if
    BR_TABLE: 0x0E,    // br_table
    RETURN: 0x0F,      // return
    END: 0x0B,         // end

    // Memory operations
    MEMORY_SIZE: 0x3F, // memory.size
    MEMORY_GROW: 0x40, // memory.grow
    I32_LOAD: 0x28,    // i32.load
    I32_LOAD8_S: 0x2C, // i32.load8_s - load 8 bits and sign extend to i32
    I32_LOAD8_U: 0x2D, // i32.load8_u - load 8 bits and zero extend to i32
    I32_LOAD16_S: 0x2E, // i32.load16_s - load 16 bits and sign extend to i32
    I32_LOAD16_U: 0x2F, // i32.load16_u - load 16 bits and zero extend to i32
    I64_LOAD: 0x29,    // i64.load
    I64_LOAD8_S: 0x30,
    I64_LOAD8_U: 0x31,
    I64_LOAD16_S: 0x32,
    I64_LOAD16_U: 0x33,
    I64_LOAD32_S: 0x34,
    I64_LOAD32_U: 0x35,
    F32_LOAD: 0x2A,    // f32.load
    I32_STORE: 0x36,   // i32.store
    I32_STORE8: 0x3A,  // i32.store8 - store the low 8 bits
    I32_STORE16: 0x3B, // i32.store16 - store the low 16 bits
    I64_STORE: 0x37,   // i64.store
    I64_STORE8: 0x3C,  // i64.store8 - store the low 8 bits of i64
    I64_STORE16: 0x3D, // i64.store16 - store the low 16 bits of i64
    I64_STORE32: 0x3E, // i64.store32 - store the low 32 bits of i64
    F32_STORE: 0x38,   // f32.store

    // Bulk Memory Operations
    BULK_PREFIX: 0xFC,
    MEMORY_INIT: 0x08,          // memory.init
    DATA_DROP: 0x09,            // data.drop
    MEMORY_COPY: 0x0A,          // memory.copy

    // Table
    TABLE_GET: 0x25, // table.get
    TABLE_SET: 0x26, // table.set
    TABLE_INIT: 0x0C, // table.init
    ELEM_DROP: 0x0D, // elem.drop
    TABLE_COPY: 0x0E, // table.copy
    TABLE_GROW: 0x0F, // table.grow
    TABLE_SIZE: 0x10, // table.size
    TABLE_FILL: 0x11, // table.fill

    // F64 operations
    F64_LOAD: 0x2B,    // f64.load
    F64_STORE: 0x39,   // f64.store
    F64_ADD: 0xA0,     // f64.add
    F64_SUB: 0xA1,     // f64.sub
    F64_MUL: 0xA2,     // f64.mul
    F64_DIV: 0xA3,     // f64.div
    F64_ABS: 0x99,     // f64.abs - absolute value
    F64_NEG: 0x9A,     // f64.neg - negation
    F64_SQRT: 0x9F,    // f64.sqrt - square root
    F64_MIN: 0xA4,     // f64.min - minimum
    F64_MAX: 0xA5,     // f64.max - maximum
    F64_CEIL: 0x9B,    // f64.ceil - ceiling (round up)
    F64_FLOOR: 0x9C,   // f64.floor - floor (round down)
    F64_TRUNC: 0x9D,   // f64.trunc - truncate (round toward zero)
    F64_NEAREST: 0x9E, // f64.nearest - round to nearest integer
    F64_COPYSIGN: 0xA6,// f64.copysign - copy sign from second operand

    // F64 comparison
    F64_EQ: 0x61,      // f64.eq (equal)
    F64_NE: 0x62,      // f64.ne (not equal)
    F64_LT: 0x63,      // f64.lt (less than)
    F64_GT: 0x64,      // f64.gt (greater than)
    F64_LE: 0x65,      // f64.le (less than or equal)
    F64_GE: 0x66,      // f64.ge (greater than or equal)

    // F64 conversion operations
    F64_CONVERT_I32_S: 0xB7, // f64.convert_i32_s (signed int to double)
    F64_CONVERT_I32_U: 0xB8, // f64.convert_i32_u (unsigned int to double)
    F64_CONVERT_I64_S: 0xB9, // f64.convert_i64_s (signed long to double)
    F64_CONVERT_I64_U: 0xBA, // f64.convert_i64_u (unsigned long to double)
    F64_PROMOTE_F32: 0xBB,   // f64.promote_f32 (float to double)
    F64_REINTERPRET_I64: 0xBF, // f64.reinterpret_i64
  }
};
export default wasmConstants;