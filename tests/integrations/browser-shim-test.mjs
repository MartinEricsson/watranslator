import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const wat = `(module
  (func (export "run") (result i32)
    i32.const 42
  )
)`;

function runShimProcess() {
	const moduleUrl = pathToFileURL(`${process.cwd()}/src/index.mjs`).href;
	const script = `
const moduleUrl = ${JSON.stringify(moduleUrl)};
const wat = ${JSON.stringify(wat)};
Object.defineProperty(globalThis, "Buffer", {
  value: undefined,
  configurable: true,
  writable: true,
});
Object.defineProperty(globalThis, "process", {
  value: undefined,
  configurable: true,
  writable: true,
});
const { compileWithProfile } = await import(moduleUrl);
const { binary, profile } = await compileWithProfile(wat);
if (!(binary instanceof Uint8Array)) {
  throw new Error("Expected compileWithProfile to return Uint8Array binary");
}
if (!WebAssembly.validate(binary)) {
  throw new Error("Expected browser-shim binary to validate");
}
if (profile.input_bytes !== new TextEncoder().encode(wat).byteLength) {
  throw new Error("Expected input_bytes to be computed without Buffer");
}
if (profile.wasm_bytes !== binary.byteLength) {
  throw new Error("Expected wasm_bytes to match binary.byteLength");
}
console.log(JSON.stringify(profile));
`;

	return new Promise((resolve) => {
		const child = spawn(
			process.execPath,
			["--input-type=module", "-e", script],
			{
				cwd: process.cwd(),
				stdio: ["ignore", "pipe", "pipe"],
			},
		);

		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (chunk) => {
			stdout += chunk;
		});
		child.stderr.on("data", (chunk) => {
			stderr += chunk;
		});
		child.on("close", (code) => {
			resolve({ code, stdout, stderr });
		});
		child.on("error", (error) => {
			resolve({ code: 1, stdout, stderr: error.message });
		});
	});
}

export default async function testBrowserShim(debug = false) {
	const result = await runShimProcess();

	if (result.code !== 0) {
		console.error("Browser shim test failed:", result.stderr || result.stdout);
		return false;
	}

	if (debug) {
		console.log("Browser shim profile", JSON.parse(result.stdout));
	}

	return true;
}
