import testComparisonOps from "./comparison-ops-test.mjs";

testComparisonOps(true)
  .then((result) => {
    if (result) {
      console.log("All tests passed!");
    } else {
      console.error("Some tests failed.");
    }
  })
  .catch((error) => {
    console.error("Error during testing:", error);
  });