import testControlFlow from './control-flow-test.mjs';

// Run the test
testControlFlow()
    .then(success => {
        if (success) {
            console.log('Control flow test completed successfully!');
            process.exit(0);
        } else {
            console.error('Control flow test failed!');
            process.exit(1);
        }
    });
