import { testTypeConversionF64 } from './type-conversion-f64-test.mjs';
import { testRunner } from '../test-utils.mjs';

try {
  const results = await Promise.all([
    testRunner(testTypeConversionF64, 'type-conversion-f64', true),
  ]);
  if (results.includes(false)) {
    throw new Error('One or more tests failed');
  }
  console.log('✅ All type conversion f64 tests passed!');
} catch (e) {
  console.error('Test failed:', e);
  process.exit(1);
}
