import testNonTrappingConversions from "./non-trapping-conversions-test.mjs";

testNonTrappingConversions(true)
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
