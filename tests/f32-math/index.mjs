import testF32MathOperations from "./f32-math-test.mjs";
import { testRunner } from "../test-utils.mjs";

try {
    const results = await Promise.all([
        testRunner(testF32MathOperations, "f32-math", true),
    ]);
    if (results.includes(false)) {
        throw new Error("One or more tests failed");
    }
}
catch (e) {
    console.error("Test failed:", e);
    process.exit(1);
}
