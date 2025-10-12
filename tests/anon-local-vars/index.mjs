import { testRunner } from "../test-utils.mjs";
import testAnonymousLocalVars from "./anon-local-vars-test.mjs";

try {
	await testRunner(testAnonymousLocalVars, "anon-local-vars", true);
	console.log("✅ Anonymous local variables test passed!");
} catch (e) {
	console.error("❌ Anonymous local variables test failed!", e);
	process.exit(1);
}
