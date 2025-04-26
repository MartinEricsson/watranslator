import { logger, readTestData } from '../../test-utils.mjs'

async function testLoopSum(debug = false) {
    const log = logger(debug);

    try {    
        const { wasmBuffer } = await readTestData('integrations/loop-test/loop-sum.wat', debug);
        log('Compiled WAT to WASM binary successfully.');
        log('Instantiating WASM module...');
        const { instance } = await WebAssembly.instantiate(wasmBuffer);
        log('WASM module instantiated successfully.');
        const result = instance.exports.sum(5);
        log('Testing loop sum with input 5...');
        if (result != 15) {
            log(`Loop sum result mismatch: expected 15, got ${result}`);
            return false;
        }
        log('Loop sum test passed.');
        return true;
    } catch (e) {
        log('Error in testLoopSum:', e);
        return false;
    }
}

export default testLoopSum;