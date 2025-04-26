import testF64MathAndOps from "./f64-math-and-ops-test.mjs";
import testF64Load from "./f64-load-test.mjs";
import testF64Store from "./f64-store-test.mjs";

async function runTests(debug = false) {
    try {
        // Run all test suites
        console.log('Running f64 math and operations tests...');
        const f64MathResult = await testF64MathAndOps(debug);
        
        console.log('Running f64 load tests...');
        const f64LoadResult = await testF64Load(debug);
        
        console.log('Running f64 store tests...');
        const f64StoreResult = await testF64Store(debug);
        
        const allPassed = f64MathResult && f64LoadResult && f64StoreResult;
        
        if (allPassed) {
            console.log('✅ All f64 tests passed!');
            return true;
        } else {
            console.log('❌ Some f64 tests failed!');
            return false;
        }
    }
    catch (error) {
        console.error('Error running tests:', error);
        return false;
    }
}

// Run the tests with debug mode set to false
runTests(false);