import { readTestData } from '../test-utils.mjs';

// Test for i8x16.extract_lane_s instruction
async function simdExtractLaneSTest(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('simd-extract-lane-s/simd-extract-lane-s.wat');
        const { instance } = await WebAssembly.instantiate(wasmBuffer);

        // Test the positive lane extraction
        const positiveResult = instance.exports.i8x16_extract_lane_s_positive();
        console.assert(positiveResult === 127, `i8x16_extract_lane_s_positive returned ${positiveResult}, expected 127`);

        // Test the negative lane extraction
        const negativeResult = instance.exports.i8x16_extract_lane_s_negative();
        console.assert(negativeResult === -128, `i8x16_extract_lane_s_negative returned ${negativeResult}, expected -128`);

        // Test the signed vs unsigned extraction difference
        const diffResult = instance.exports.i8x16_extract_lane_s_vs_u();
        console.assert(diffResult === -56, `i8x16_extract_lane_s_vs_u returned ${diffResult}, expected -56`);

        return true;
    } catch (error) {
        console.error('Error during SIMD i8x16.extract_lane_s test:', error);
        return false;
    }
}

export default simdExtractLaneSTest;
