import testEncodingi32 from "./encoding-i32-test.mjs";

testEncodingi32(true)
  .then((success) => {
    if (!success) {
      console.error("❌ Test failed!");
      return;
    }
    console.log("✅ Encoding i32 test passed!");
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
  });