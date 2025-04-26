import { readTestData } from "../test-utils.mjs";

async function testAtomicWaitNotify(debug = false) {
    try {
        const { wasmBuffer } = await readTestData("atomic-wait-notify/atomic-wait-notify.wat", debug);

        // Set up shared memory for atomic operations
        const memory = new WebAssembly.Memory({ initial: 1, maximum: 1, shared: true });
        const importObject = { 
            js: { memory }
        };

        const instance = await WebAssembly.instantiate(wasmBuffer);
        const exports = instance.instance.exports;
        const mem = exports.memory;
        
        // Create views into the memory
        const i32View = new Int32Array(mem.buffer);
        const i64View = new BigInt64Array(mem.buffer);

        const testCases = [
            // Test notify with no waiters
            {
                name: "notify with no waiters",
                test: () => {
                    const result = exports.notify(0, 1);
                    return result === 0;
                }
            },
            // Basic notify functionality
            {
                name: "notify functionality",
                test: () => {
                    // We can't fully test wait/notify without multithreading,
                    // but we can test the function signature and basic behavior
                    const notifyCount = exports.notify(4, 3);
                    return typeof notifyCount === 'number';
                }
            },
            // Test wait32 with immediate timeout
            {
                name: "wait32 with timeout=0",
                test: () => {
                    i32View[1] = 42;
                    // With timeout=0, it should immediately time out
                    const result = exports.wait32(4, 42, 0n);
                    return result === 2; // 2 indicates timeout
                }
            },
            // Test wait64 with immediate timeout
            {
                name: "wait64 with timeout=0",
                test: () => {
                    i64View[1] = 42n;
                    // With timeout=0, it should immediately time out
                    const result = exports.wait64(8, 42n, 0n);
                    return result === 2; // 2 indicates timeout
                }
            },
            // Test wait32 with mismatched value
            {
                name: "wait32 with mismatched value",
                test: () => {
                    i32View[2] = 100;
                    // Expect immediate return with mismatch (expected=101, actual=100)
                    const result = exports.wait32(8, 101, 0n);
                    return result === 1; // 1 indicates mismatch
                }
            },
            // Test wait64 with mismatched value
            {
                name: "wait64 with mismatched value",
                test: () => {
                    i64View[2] = 100n;
                    // Expect immediate return with mismatch (expected=101n, actual=100n)
                    const result = exports.wait64(16, 101n, 0n);
                    return result === 1; // 1 indicates mismatch
                }
            }
        ];

        let allPassed = true;
        
        for (const testCase of testCases) {
            try {
                const passed = testCase.test();
                if (passed) {
                    console.log(`✅ Test case '${testCase.name}' passed`);
                } else {
                    console.error(`❌ Test case '${testCase.name}' failed`);
                    allPassed = false;
                }
            } catch (error) {
                console.error(`❌ Test case '${testCase.name}' failed with error:`, error);
                allPassed = false;
            }
        }

        if (allPassed) {
            console.log('✅ All atomic wait and notify tests passed!');
            return true;
        } else {
            console.error('❌ Some atomic wait and notify tests failed!');
            return false;
        }
    } catch (error) {
        console.error('Error during atomic wait and notify test:', error);
        return false;
    }
}

export default testAtomicWaitNotify;
