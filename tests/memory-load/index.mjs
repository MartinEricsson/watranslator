import testMemoryLoad from './memory-load-test.mjs';
import testI64Load from './i64-load-test.mjs';
import { testRunner } from '../test-utils.mjs';

try {
  const results = await Promise.all([
    testRunner(testMemoryLoad, 'memory-load', true),
    testRunner(testI64Load, 'i64-load', true),
  ]);
  if (results.includes(false)) {
    throw new Error('One or more tests failed');
  }
} catch (e) {
  console.error('Test failed:', e);
  process.exit(1);
}
