import { readTestData } from "../test-utils.mjs";

async function testParameters(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"parameters/parameters.wat",
			debug,
		);
		const { instance } = await WebAssembly.instantiate(wasmBuffer, {
			system: {
				logfv: (a, b, c, d) => {
					console.log("logfv called with:", a, b, c, d);
				},
			},
		});

		// Test parameters
		const resultv128 = instance.exports.param_128();

		return true;
	} catch (error) {
		console.error("❌ parameters test failed:", error);
		return false;
	}
}

export default testParameters;
