import testEmptyModuleCompilation from "./empty-module-test.mjs";

// Run the test
testEmptyModuleCompilation()
    .then(success => {
        if (success) {
            console.log('Empty module test completed successfully!');
            process.exit(0);
        } else {
            console.error('Empty module test failed!');
            process.exit(1);
        }
    });