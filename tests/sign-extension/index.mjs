import testSignExtension from "./sign-extension-test.mjs";

testSignExtension()
	.then((success) => {
		if (!success) {
			console.error("❌ Test failed!");
			process.exit(1);
		}
		console.log("✅ Sign extension test passed!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("❌ Test failed:", error);
		process.exit(1);
	});
