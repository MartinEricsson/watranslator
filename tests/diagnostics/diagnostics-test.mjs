import { compile } from "../../src/index.mjs";

async function testDiagnostics() {
	const wat = `(module
  (func (export "main") (result i32)
    i32.doesnotexist
  )
)`;

	try {
		await compile(wat, { filename: "diagnostics.wat" });
		console.log(
			"❌ Diagnostic formatting test failed: compilation should not pass",
		);
		return false;
	} catch (error) {
		const message = error.message || "";
		const checks = [
			message.includes("ParseError"),
			message.includes("--> diagnostics.wat:3:5"),
			message.includes("3 |     i32.doesnotexist"),
			message.includes("help: Check the opcode spelling"),
		];

		if (checks.every(Boolean)) {
			console.log("✅ Diagnostic formatting test passed");
			return true;
		}

		console.log("❌ Diagnostic formatting test failed:");
		console.log(message);
		return false;
	}
}

export default testDiagnostics;
