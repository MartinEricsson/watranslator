import testBulkMemory from './bulk-memory-test.mjs';

// Run the test with debug output enabled
testBulkMemory(true)
  .then(success => {
    if (success) {
      console.log('✅ All tests passed!');
      process.exit(0);
    } else {
      console.error('❌ Tests failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
  });