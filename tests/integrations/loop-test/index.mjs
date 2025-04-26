import { testRunner } from "../../test-utils.mjs";
import testLoopSum from "./loop-sum.mjs";

try {
    await testRunner(testLoopSum, "Test loop sum", true);
    console.log('Loop test completed successfully.');
} catch (e) {
    console.error('Error in loop test:', e);
}