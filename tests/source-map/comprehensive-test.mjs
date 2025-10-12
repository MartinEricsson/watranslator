import { compile } from "../../src/index.mjs";

// Test with various constructs to ensure comprehensive source map coverage
const comprehensiveWat = `(module
  (func (export "factorial") (param $n i32) (result i32)
    local.get $n
    i32.const 1
    i32.le_s
    if (result i32)
      i32.const 1
    else
      local.get $n
      local.get $n
      i32.const 1
      i32.sub
      call 0
      i32.mul
    end
  )
  
  (func (export "simpleLoop") (param $max i32) (result i32)
    (local $i i32)
    (local $sum i32)
    
    i32.const 0
    local.set $i
    
    i32.const 0
    local.set $sum
    
    block $exit
      loop $continue
        local.get $i
        local.get $max
        i32.ge_s
        br_if $exit
        
        local.get $sum
        local.get $i
        i32.add
        local.set $sum
        
        local.get $i
        i32.const 1
        i32.add
        local.set $i
        
        br $continue
      end
    end
    
    local.get $sum
  )
)`;

async function testComprehensiveSourceMap() {
	console.log("Testing comprehensive source map generation...");

	try {
		// Test with source map enabled
		const result = await compile(comprehensiveWat, {
			sourceMap: true,
			filename: "comprehensive.wat",
		});

		console.log("✅ Comprehensive compilation with source map works");
		console.log("Binary length:", result.binary.length);

		// Parse and validate source map
		const sourceMap = JSON.parse(result.sourceMap);
		console.log("Source map entries:", sourceMap.length);

		// Group mappings by function
		const func0Mappings = sourceMap.filter((m) => m.funcIndex === 0);
		const func1Mappings = sourceMap.filter((m) => m.funcIndex === 1);

		console.log(`Function 0 mappings: ${func0Mappings.length}`);
		console.log(`Function 1 mappings: ${func1Mappings.length}`);

		// Display some entries for verification
		console.log("Function 0 (factorial) source map entries:");
		func0Mappings.slice(0, 5).forEach((entry, i) => {
			console.log(`  [${i}]:`, entry);
		});

		console.log("Function 1 (simpleLoop) source map entries:");
		func1Mappings.slice(0, 5).forEach((entry, i) => {
			console.log(`  [${i}]:`, entry);
		});

		// Validate that we have mappings for both functions
		const hasBothFunctions =
			func0Mappings.length > 0 && func1Mappings.length > 0;

		if (hasBothFunctions) {
			console.log("✅ Source map contains mappings for multiple functions");
		} else {
			console.log("❌ Source map should contain mappings for both functions");
			return false;
		}

		// Validate body offsets are monotonically increasing within each function
		const func0Valid = func0Mappings.every(
			(entry, i, arr) => i === 0 || entry.bodyOffset >= arr[i - 1].bodyOffset,
		);
		const func1Valid = func1Mappings.every(
			(entry, i, arr) => i === 0 || entry.bodyOffset >= arr[i - 1].bodyOffset,
		);

		if (func0Valid && func1Valid) {
			console.log("✅ Body offsets are monotonically increasing");
		} else {
			console.log("❌ Body offsets should be monotonically increasing");
			return false;
		}

		// Validate all entries have required fields and correct types
		const allValid = sourceMap.every((entry) => {
			return (
				Object.hasOwn(entry, "file") &&
				Object.hasOwn(entry, "line") &&
				Object.hasOwn(entry, "column") &&
				Object.hasOwn(entry, "funcIndex") &&
				Object.hasOwn(entry, "bodyOffset") &&
				typeof entry.line === "number" &&
				typeof entry.column === "number" &&
				typeof entry.funcIndex === "number" &&
				typeof entry.bodyOffset === "number" &&
				entry.line >= 0 &&
				entry.column >= 0
			);
		});
		if (allValid) {
			console.log("✅ All source map entries are valid");
		} else {
			console.log("❌ Some source map entries are invalid");
			return false;
		}

		// Verify that source map provides useful debugging information
		const hasInstructionCoverage = sourceMap.length >= 15; // Should have at least 15 instructions mapped

		if (hasInstructionCoverage) {
			console.log("✅ Source map provides good instruction coverage");
		} else {
			console.log("❌ Source map should have better instruction coverage");
			return false;
		}

		console.log("✅ Comprehensive source map test passed!");
		return true;
	} catch (error) {
		console.error("❌ Comprehensive source map test failed:", error);
		return false;
	}
}

export { testComprehensiveSourceMap };

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testComprehensiveSourceMap().catch((err) => {
		console.error(err);
		process.exit(1);
	});
}
