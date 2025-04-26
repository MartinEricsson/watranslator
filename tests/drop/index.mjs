import testDropInstruction from "./drop-test.mjs";

testDropInstruction(true)
  .then((success) => {
    if (!success) {
      console.error("❌ Test failed!");
      return;
    }
    console.log("✅ Drop instruction test passed!");
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
  });