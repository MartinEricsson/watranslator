import testMemoryStore from './memory-store-test.mjs';
import testI32Store from './i32-store-test.mjs';
import testI64Store from './i64-store-test.mjs';
import { testRunner } from '../test-utils.mjs';

try {
  const results = await Promise.all([
    testRunner(testMemoryStore, 'memory-store', true),
    testRunner(testI32Store, 'i32-store', true),
    testRunner(testI64Store, 'i64-store', true),
  ]);
  if (results.includes(false)) {
    throw new Error('One or more tests failed');
  }
} catch (e) {
  console.error('Test failed:', e);
  process.exit(1);
}