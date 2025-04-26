import testBitCnt from "./bit-cnt-test.mjs";

testBitCnt(true)
    .then((success) => {
        if (!success) {
        console.error("❌ Test failed!");
        return;
        }
        console.log("✅ Bit count test passed!");
    })
    .catch((error) => {
        console.error("❌ Test failed:", error);
    });