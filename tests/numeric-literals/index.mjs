import { testRunner } from "../test-utils.mjs";
import testNumericLiterals from "./numeric-literals-test.mjs";

export default async function runNumericLiteralTests() {
	const results = await Promise.all([
		testRunner(testNumericLiterals, "numeric-literals", true),
	]);
	return results.every(Boolean);
}

runNumericLiteralTests();
