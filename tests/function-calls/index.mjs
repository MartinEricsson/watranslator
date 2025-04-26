import testFunctionCalls  from "./function-calls-test.mjs";

// Run the test
testFunctionCalls()
  .then(result => {
    if (result) {
      console.log('Function calls tests passed!');
      process.exit(0);
    } else {
      console.log('Function calls tests failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error running function calls tests:', error);
    process.exit(1);
  });