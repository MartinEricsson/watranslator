import testReinterpretOps from "./reinterpret-ops-test.mjs";

async function runTests() {
	console.log("Running reinterpret operations tests...");
	const debug = process.argv.includes("--debug");
	const result = await testReinterpretOps(debug);

	process.exit(result ? 0 : 1);
}

runTests().catch((error) => {
	console.error("Error running tests:", error);
	process.exit(1);
});
