// Generated by 🤖
import testImportedFunctions from './imported-functions-test.mjs';
import testImportedFunctionOrdered from './imported-functions-ordered-test.mjs';
import { testRunner } from '../test-utils.mjs';

try {
  const results = await Promise.all([
    testRunner(testImportedFunctions, 'imported-functions', true),
    testRunner(testImportedFunctionOrdered, 'imported-functions-ordered', true),
  ]);
  if (results.includes(false)) {
    throw new Error('One or more tests failed');
  }
}
catch (e) {
  console.error('Test failed:', e);
  process.exit(1);
}
