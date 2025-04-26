import { readTestData } from "../test-utils.mjs";

// Test the drop instruction implementation
async function testDropInstruction(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('drop/drop.wat', debug);

        // Instantiate the WASM module
        const {instance} = await WebAssembly.instantiate(wasmBuffer, {});
        
        // Test drop_value function
        const dropValueResult = instance.exports.drop_value();
        const dropValueResultRes = dropValueResult === 42;
        console.assert(dropValueResultRes, `❌ drop_value should return 42, got ${dropValueResult}`);

        // Test drop_computation function
        const dropComputationResult = instance.exports.drop_computation();
        const dropComputationResultRes = dropComputationResult === 10;
        console.assert(dropComputationResultRes, `❌ drop_computation should return 10, got ${dropComputationResult}`);

        // Test drop_parameter function
        const dropParameterResult = instance.exports.drop_parameter(42);
        const dropParameterResultRes = dropParameterResult === 99;
        console.assert(dropParameterResultRes, `❌ drop_parameter should return 99, got ${dropParameterResult}`);

        const dropParameterNoReturn = instance.exports.drop_parameter_no_return(42);
        const dropParameterNoReturnRes = dropParameterNoReturn === undefined;
        console.assert(dropParameterNoReturnRes, `❌ drop_parameter_no_return should return undefined, got ${dropParameterNoReturn}`);

        const dropParameterNoReturnParam = instance.exports.drop_parameter_no_return(42);
        const dropParameterNoReturnResParam = dropParameterNoReturnParam === undefined;
        console.assert(dropParameterNoReturnResParam, `❌ drop_parameter_no_return should return undefined, got ${dropParameterNoReturnParam}`);

        const dropData = instance.exports.data_drop();
        const dropDataRes = dropData === undefined;
        console.assert(dropDataRes, `❌ drop_data should return undefined, got ${dropData}`);

        if(dropValueResultRes && dropComputationResultRes && dropParameterResultRes) {
            console.log('✅ All drop instruction tests passed!');
            return true;
        } else {
            console.error('❌ Some drop instruction tests failed.');
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing drop instruction:', error);
        return false;
    }
}

export default testDropInstruction;