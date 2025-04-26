import { testMultipleFunctionArguments } from "./multiple-function-arguments.mjs";
import { testRunner } from "../test-utils.mjs";

try {
    const result = await testRunner(testMultipleFunctionArguments, "multiple-function-arguments", true);
    if(!result) {
        throw new Error("Test failed for multiple-function-arguments");
    }
} catch (error) {
    console.error(error);
}
