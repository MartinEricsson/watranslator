import { testRunner } from "../test-utils.mjs";
import testNop from "./nop-test.mjs";

await testRunner(testNop, "nop", true);
