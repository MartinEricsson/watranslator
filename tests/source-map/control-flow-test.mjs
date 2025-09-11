import { compile } from "../../src/index.mjs";

const controlFlowWat = `(module
  (func (export "test") (param $n i32) (result i32)
    local.get $n
    i32.const 10
    i32.lt_s
    if (result i32)
      i32.const 1
    else
      local.get $n
      i32.const 1
      i32.sub
    end
  )
)`;

async function testSourceMapControlFlow() {
	console.log("Testing source map generation with control flow...");
	
	try {
		// Test with source map enabled
		const result = await compile(controlFlowWat, { 
			sourceMap: true, 
			filename: "control-flow.wat" 
		});
		
		console.log("✅ Compilation with control flow source map works");
		console.log("Binary length:", result.binary.length);
		
		// Parse and validate source map
		const sourceMap = JSON.parse(result.sourceMap);
		console.log("Source map entries:", sourceMap.length);
		
		// Show all entries to understand the mapping
		console.log("Control flow source map entries:");
		sourceMap.forEach((entry, i) => {
			console.log(`  [${i}]:`, entry);
		});
		
		// Validate that we have mappings for control flow structures
		const hasControlFlowMappings = sourceMap.length > 5; // Should have several mappings for if/block/loop/etc
		
		if (hasControlFlowMappings) {
			console.log("✅ Source map contains control flow mappings");
		} else {
			console.log("❌ Source map should contain more control flow mappings");
			return false;
		}
		
		// Validate all entries have required fields and correct types
		const allValid = sourceMap.every(entry => {
			return entry.hasOwnProperty('file') && 
				   entry.hasOwnProperty('line') &&
				   entry.hasOwnProperty('column') &&
				   entry.hasOwnProperty('funcIndex') &&
				   entry.hasOwnProperty('bodyOffset') &&
				   typeof entry.line === 'number' &&
				   typeof entry.column === 'number' &&
				   typeof entry.funcIndex === 'number' &&
				   typeof entry.bodyOffset === 'number' &&
				   entry.line >= 0 &&
				   entry.column >= 0;
		});
		
		if (allValid) {
			console.log("✅ All source map entries are valid");
		} else {
			console.log("❌ Some source map entries are invalid");
			return false;
		}
		
		console.log("✅ Control flow source map test passed!");
		return true;
		
	} catch (error) {
		console.error("❌ Control flow source map test failed:", error);
		return false;
	}
}

export { testSourceMapControlFlow };

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testSourceMapControlFlow().catch(err => {
		console.error(err);
		process.exit(1);
	});
}