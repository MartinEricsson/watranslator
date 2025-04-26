import testAnonymousLocalVars from './anon-local-vars-test.mjs';
import { testRunner } from '../test-utils.mjs';

try {
    await testRunner(testAnonymousLocalVars, 'anon-local-vars', true);
    console.log('✅ Anonymous local variables test passed!');
} catch (e) {
    console.error('❌ Anonymous local variables test failed!', e);
    process.exit(1);
}
