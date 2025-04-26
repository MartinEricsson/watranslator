import testTypeConversion from "./type-conversion.mjs";

try {
    const results = await Promise.all([
        testTypeConversion(true),
    ]);
    if (results.includes(false)) {
        throw new Error('One or more tests failed');
    }
    console.log('✅ All type conversion tests passed!');
} catch (e) {
    console.error('❌ Error testing type conversion:', error);
    process.exit(1);
}
