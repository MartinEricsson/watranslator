import testMultiValue from "./multi-value-test.mjs";
import { testRunner } from "../test-utils.mjs";
 
try {
    const result = await Promise.all([
        testRunner(testMultiValue, "MultiValue", true)
    ]);
    if (result.includes(false)) {
        throw new Error("One or more tests failed");
    }
    console.log('✅ All MultiValue tests passed successfully!');
} catch (error) {
    console.error('❌ Error during MultiValue tests:', error);  
}
