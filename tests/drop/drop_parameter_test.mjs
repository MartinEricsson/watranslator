import { readTestData } from "../test-utils.mjs";

// Test specifically the drop_parameter function
async function testDropParameter(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('drop/drop.wat', debug);

        // Instantiate the WASM module
        const {instance} = await WebAssembly.instantiate(wasmBuffer, {});
        
        // Test only drop_parameter function
        if (debug) {
            console.log('Testing drop_parameter function specifically...');
            console.log('Function signature:', instance.exports.drop_parameter.toString());
            
            // Try with different parameters
            const test1 = instance.exports.drop_parameter(42);
            console.log('drop_parameter(42) =', test1);
            
            const test2 = instance.exports.drop_parameter(0);
            console.log('drop_parameter(0) =', test2);
            
            const test3 = instance.exports.drop_parameter(99);
            console.log('drop_parameter(99) =', test3);
        }
        
        // Make the actual test assertion
        const dropParameterResult = instance.exports.drop_parameter(42);
        const dropParameterResultRes = dropParameterResult === 99;
        console.assert(dropParameterResultRes, `drop_parameter should return 99, got ${dropParameterResult}`);

        return dropParameterResultRes;
    } catch (error) {
        console.error('❌ Error testing drop_parameter function:', error);
        return false;
    }
}

// Run the test directly if this module is executed
testDropParameter(true)
    .then((success) => {
        if (success) {
            console.log('✅ drop_parameter test passed!');
        } else {
            console.log('❌ drop_parameter test failed!');
        }
    })
    .catch((error) => {
        console.error('❌ Unexpected error:', error);
    });

export default testDropParameter;