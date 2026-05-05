import { expectCompileError } from "../test-utils.mjs";

export default async function testGlobalInitErrors(debug = false) {
	try {
		await expectCompileError(
			`(module
				(global $bad (mut i32) (i32.add))
			)`,
			/Global initializer must be a constant expression, got i32\.add/,
		);

		if (debug) {
			console.log("mutable global non-const initializer rejected");
		}

		return true;
	} catch (error) {
		console.error("global initializer error test failed:", error);
		return false;
	}
}
