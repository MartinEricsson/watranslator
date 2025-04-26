const TRUNC_SAT_PREFIX = 0xFC; // Prefix for truncation and saturation instructions
const I32_TRUNC_SAT_F32_S = 0x00;
const I32_TRUNC_SAT_F32_U = 0x01;
const I32_TRUNC_SAT_F64_S = 0x02;
const I32_TRUNC_SAT_F64_U = 0x03;
const I64_TRUNC_SAT_F32_S = 0x04;
const I64_TRUNC_SAT_F32_U = 0x05;
const I64_TRUNC_SAT_F64_S = 0x06;
const I64_TRUNC_SAT_F64_U = 0x07;

export function compileNonTrappingFloatToInt(instr, body) {
    if (instr.type === 'i32.trunc_sat_f32_s') {
        body.push(TRUNC_SAT_PREFIX);
        body.push(I32_TRUNC_SAT_F32_S);
        return true;
    } else if (instr.type === 'i32.trunc_sat_f32_u') {
        body.push(TRUNC_SAT_PREFIX);
        body.push(I32_TRUNC_SAT_F32_U);
        return true;
    } else if (instr.type === 'i32.trunc_sat_f64_s') {
        body.push(TRUNC_SAT_PREFIX);
        body.push(I32_TRUNC_SAT_F64_S);
        return true;
    } else if (instr.type === 'i32.trunc_sat_f64_u') {
        body.push(TRUNC_SAT_PREFIX);
        body.push(I32_TRUNC_SAT_F64_U);
        return true;
    } else if (instr.type === 'i64.trunc_sat_f32_s') {
        body.push(TRUNC_SAT_PREFIX);
        body.push(I64_TRUNC_SAT_F32_S);
        return true;
    } else if (instr.type === 'i64.trunc_sat_f32_u') {
        body.push(TRUNC_SAT_PREFIX);
        body.push(I64_TRUNC_SAT_F32_U);
        return true;
    } else if (instr.type === 'i64.trunc_sat_f64_s') {
        body.push(TRUNC_SAT_PREFIX);
        body.push(I64_TRUNC_SAT_F64_S);
        return true;
    } else if (instr.type === 'i64.trunc_sat_f64_u') {
        body.push(TRUNC_SAT_PREFIX);
        body.push(I64_TRUNC_SAT_F64_U);
        return true;
    }

    return false;
}