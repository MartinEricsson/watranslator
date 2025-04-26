import testF32Operations from "./f32-ops-test.mjs";
import testF32Load from "./f32-load-test.mjs";
import testF32Store from "./f32-store-test.mjs";

async function runTests() {
    try {
        // Run all test suites
        console.log('Running f32 operations tests...');
        const f32OpsResult = await testF32Operations();
        
        console.log('Running f32 load tests...');
        const f32LoadResult = await testF32Load();
        
        console.log('Running f32 store tests...');
        const f32StoreResult = await testF32Store();
        
        const allPassed = f32OpsResult && f32LoadResult && f32StoreResult;
        
        if (allPassed) {
            console.log('✅ All f32 operations tests passed!');
            return true;
        } else {
            console.log('❌ Some f32 operations tests failed!');
            return false;
        }
    }
    catch (error) {
        console.error('Error running tests:', error);
        return false;
    }
}

// Run the tests
runTests();