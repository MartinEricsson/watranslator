import { testRunner } from "../test-utils.mjs";
import testAtomicOps from "./atomic-ops-test.mjs";

try {
    await testRunner(testAtomicOps, 'atomic-ops', true);
} catch (e) {
    console.error('❌ Test failed:', e);
    process.exit(1);
}
