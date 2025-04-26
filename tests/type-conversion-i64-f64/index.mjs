import { testTypeConversionI64ToF64 } from './type-conversion-i64-f64-test.mjs';
import { testRunner } from '../test-utils.mjs';

try {
  const results = await Promise.all([
    testRunner(testTypeConversionI64ToF64, 'type-conversion-i64-f64', true),
  ]);
  if (results.includes(false)) {
    throw new Error('One or more tests failed');
  }
  console.log('✅ All type conversion i64 to f64 tests passed!');
} catch (e) {
  console.error('Test failed:', e);
  process.exit(1);
}
