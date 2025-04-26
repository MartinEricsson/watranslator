import i64MathAndOps from "./i64-math-and-ops-test.mjs";

i64MathAndOps()
    .then((success) => {
        if (!success) {
            console.error("❌ Test failed!");
            process.exit(1);
        }
        console.log("✅ i64 math and ops test passed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });