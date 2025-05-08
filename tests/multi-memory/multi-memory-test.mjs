// filepath: /Users/martinericsson/dev/watranslator/tests/multi-memory/multi-memory-test.mjs
import { readTestData } from "../test-utils.mjs";

async function testMultiMemory(debug = false) {
    try {
        // Create memory instances for testing
        const memory0 = new WebAssembly.Memory({ initial: 1 });
        const memory1 = new WebAssembly.Memory({ initial: 2 });

        // Create imports object with memories
        const imports = {
            "": {
                memory0,
                memory1
            }
        };

        // Load and instantiate the first module (memory0)
        const { wasmBuffer: wasmBuffer0 } = await readTestData('multi-memory/memory0.wat', debug);
        const { instance: instance0 } = await WebAssembly.instantiate(wasmBuffer0, imports);

        // Load and instantiate the second module (memory1)
        const { wasmBuffer: wasmBuffer1 } = await readTestData('multi-memory/memory1.wat', debug);
        const { instance: instance1 } = await WebAssembly.instantiate(wasmBuffer1, imports);

        // Get direct access to memory buffers for testing isolation
        const mem0View = new Int32Array(memory0.buffer);
        const mem1View = new Int32Array(memory1.buffer);

        // Test writing and reading from both memories
        const tests = [
            {
                name: "store and load from memory0",
                execute: () => {
                    const addr = 0;
                    const value = 42;

                    // Store value using the memory0 module
                    instance0.exports.store(addr, value);

                    // Read value using the memory0 module
                    const result = instance0.exports.load(addr);

                    // Verify value was correctly stored
                    const directResult = mem0View[addr / 4]; // Int32Array indexes are in 4-byte units

                    if (debug) {
                        console.log(`Memory0 storage: Expected: ${value}, Got: func=${result}, direct=${directResult}`);
                    }

                    if (result !== value || directResult !== value) {
                        console.error(`❌ Memory0 storage failed. Expected: ${value}, Got: func=${result}, direct=${directResult}`);
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "store and load from memory1",
                execute: () => {
                    const addr = 4;
                    const value = 99;

                    // Store value using the memory1 module
                    instance1.exports.store(addr, value);

                    // Read value using the memory1 module
                    const result = instance1.exports.load(addr);

                    // Verify value was correctly stored
                    const directResult = mem1View[addr / 4]; // Int32Array indexes are in 4-byte units

                    if (debug) {
                        console.log(`Memory1 storage: Expected: ${value}, Got: func=${result}, direct=${directResult}`);
                    }

                    if (result !== value || directResult !== value) {
                        console.error(`❌ Memory1 storage failed. Expected: ${value}, Got: func=${result}, direct=${directResult}`);
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "separate memory isolation",
                execute: () => {
                    // Store values at same address in both memories
                    const addr = 8;
                    const value0 = 123;
                    const value1 = 456;

                    // Store in memory0
                    instance0.exports.store(addr, value0);

                    // Store in memory1
                    instance1.exports.store(addr, value1);

                    // Check that they don't interfere with each other
                    const result0 = instance0.exports.load(addr);
                    const result1 = instance1.exports.load(addr);

                    // Also check directly in the memory buffers
                    const direct0 = mem0View[addr / 4];
                    const direct1 = mem1View[addr / 4];

                    if (debug) {
                        console.log(`Memory isolation: memory0[${addr}]=${direct0}, memory1[${addr}]=${direct1}`);
                    }

                    if (result0 !== value0 || direct0 !== value0) {
                        console.error(`❌ Memory0 isolation failed. Expected: ${value0}, Got: func=${result0}, direct=${direct0}`);
                        return false;
                    }

                    if (result1 !== value1 || direct1 !== value1) {
                        console.error(`❌ Memory1 isolation failed. Expected: ${value1}, Got: func=${result1}, direct=${direct1}`);
                        return false;
                    }

                    return true;
                }
            }
        ];

        let results = [];
        for (const test of tests) {
            const result = test.execute();
            results.push(result);

            if (debug) {
                console.log(`Debug: ${test.name} - Result: ${result}`);
            }

            if (result) {
                console.log(`✅ ${test.name} test passed!`);
            } else {
                console.error(`❌ ${test.name} test failed.`);
            }
        }

        // Check if all tests passed
        const allTestsPassed = results.every(result => result);
        if (allTestsPassed) {
            console.log("✅ All multi-memory tests passed!");
            return true;
        } else {
            console.error("❌ Some multi-memory tests failed.");
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing multi-memory:', error);
        return false;
    }
}

export default testMultiMemory; // Generated by 🤖