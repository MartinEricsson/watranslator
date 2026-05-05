import * as esbuild from "esbuild";

const MAX_MINIFIED_BUNDLE_BYTES = 112_000;

export default async function testBundleSize(debug = false) {
	try {
		const result = await esbuild.build({
			entryPoints: ["src/index.mjs"],
			platform: "browser",
			bundle: true,
			target: ["es2020"],
			format: "esm",
			minify: true,
			sourcemap: false,
			define: {
				NODE_ONLY: "false",
			},
			dropLabels: ["NODE_ONLY"],
			write: false,
		});

		const bytes = result.outputFiles[0].contents.byteLength;
		if (bytes >= MAX_MINIFIED_BUNDLE_BYTES) {
			throw new Error(
				`Expected minified browser bundle under ${MAX_MINIFIED_BUNDLE_BYTES} bytes, got ${bytes}`,
			);
		}

		if (debug) {
			console.log("Bundle size", { bytes, max: MAX_MINIFIED_BUNDLE_BYTES });
		}

		return true;
	} catch (error) {
		console.error("Bundle size test failed:", error);
		return false;
	}
}
