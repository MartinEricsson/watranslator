import { readFileSync } from 'node:fs';
import { compile } from '../../src/index.mjs';

const testSourceMapVisualizerIntegration = async () => {
	console.log('Testing source map visualizer integration...');
	
	// Test that the compile function works with sourceMap option
	const simpleWat = `(module
    (func $test (result i32)
        i32.const 42
        return
    )
    (export "test" (func $test))
)`;
	
	try {
		// Test compilation with source map
		const result = await compile(simpleWat, { sourceMap: true });
		
		// Verify result structure
		if (!result.binary) {
			throw new Error('Expected binary property in result');
		}
		
		if (!result.sourceMap) {
			throw new Error('Expected sourceMap property in result');
		}
		
		// Parse source map
		const sourceMap = JSON.parse(result.sourceMap);
		
		// Verify source map structure
		if (!Array.isArray(sourceMap)) {
			throw new Error('Source map should be an array');
		}
		
		if (sourceMap.length === 0) {
			throw new Error('Source map should contain mappings');
		}
		
		// Verify mapping structure
		const firstMapping = sourceMap[0];
		const requiredFields = ['file', 'line', 'column', 'funcIndex', 'bodyOffset'];
		
		for (const field of requiredFields) {
			if (!(field in firstMapping)) {
				throw new Error(`Source map entry missing required field: ${field}`);
			}
		}
		
		// Verify that line/column are 0-based
		if (firstMapping.line < 0 || firstMapping.column < 0) {
			throw new Error('Line and column should be 0-based (>= 0)');
		}
		
		console.log('✅ Source map visualizer integration test passed!');
		console.log(`   - Binary size: ${result.binary.byteLength} bytes`);
		console.log(`   - Source mappings: ${sourceMap.length}`);
		console.log(`   - Sample mapping: line ${firstMapping.line + 1}, col ${firstMapping.column + 1}, func[${firstMapping.funcIndex}], offset +${firstMapping.bodyOffset}`);
		
		return true;
		
	} catch (error) {
		console.error('❌ Source map visualizer integration test failed:', error.message);
		return false;
	}
};

// Run the test
testSourceMapVisualizerIntegration()
	.then(success => {
		process.exit(success ? 0 : 1);
	})
	.catch(error => {
		console.error('Test runner error:', error);
		process.exit(1);
	});