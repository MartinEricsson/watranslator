import { compile } from "../../src/index.mjs";

const wat = `(module
  (func $test (result i32)
    i32.const 42
    return)
  (export "test" (func $test)))`;

async function testSourceMap() {
	console.log("Testing source map generation...");
	
	try {
		// Test with source map disabled (default behavior)
		const resultNoSourceMap = await compile(wat);
		console.log("✅ Compilation without source map works");
		console.log("Binary length:", resultNoSourceMap.length);
		
		// Test with source map enabled
		const resultWithSourceMap = await compile(wat, { 
			sourceMap: true, 
			filename: "test.wat" 
		});
		
		console.log("✅ Compilation with source map works");
		console.log("Binary length:", resultWithSourceMap.binary.length);
		console.log("Source map generated:", !!resultWithSourceMap.sourceMap);
		
		// Parse and validate source map
		const sourceMap = JSON.parse(resultWithSourceMap.sourceMap);
		console.log("Source map entries:", sourceMap.length);
		
		// Show all entries to understand the mapping
		console.log("All source map entries:");
		sourceMap.forEach((entry, i) => {
			console.log(`  [${i}]:`, entry);
		});
		
		if (sourceMap.length > 0) {
			console.log("Sample source map entry:", sourceMap[0]);
			
			// Validate schema
			const entry = sourceMap[0];
			const hasRequiredFields = entry.hasOwnProperty('file') && 
									   entry.hasOwnProperty('line') &&
									   entry.hasOwnProperty('column') &&
									   entry.hasOwnProperty('funcIndex') &&
									   entry.hasOwnProperty('bodyOffset');
			
			if (hasRequiredFields) {
				console.log("✅ Source map entry has required fields");
			} else {
				console.log("❌ Source map entry missing required fields");
			}
			
			// Validate that values are 0-based
			const isZeroBased = entry.line >= 0 && entry.column >= 0;
			if (isZeroBased) {
				console.log("✅ Source map uses 0-based indexing");
			} else {
				console.log("❌ Source map should use 0-based indexing");
			}
		}
		
		console.log("✅ Source map test passed!");
		
	} catch (error) {
		console.error("❌ Source map test failed:", error);
		throw error;
	}
}

export { testSourceMap };

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testSourceMap().catch(err => {
		console.error(err);
		process.exit(1);
	});
}