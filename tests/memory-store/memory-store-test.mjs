import { readTestData } from '../test-utils.mjs';

async function testMemoryStore(debug = false) {
  try {
    const { wasmBuffer } = await readTestData('memory-store/memory-store.wat', debug);
    
    // Try to use WebAssembly API if available
    if (typeof WebAssembly !== 'undefined') {
      if(debug) console.log('Testing WebAssembly instantiation...');
      
      // Using WebAssembly.instantiate which returns a Promise
      try {
        const {instance} = await WebAssembly.instantiate(wasmBuffer);
        
        // Check for exported functions
        if(debug) console.log('Exported functions:', Object.keys(instance.exports));
        
        console.log('\nTesting i32.store:');
        const testValue1 = 0x12345678;
        const address1 = 0;
        instance.exports.store(address1, testValue1);
        const result1 = instance.exports.load(address1);
        console.log(`store(${address1}, 0x${testValue1.toString(16)}) -> load(${address1}) = 0x${result1.toString(16)} - ${result1 === testValue1 ? '✅' : '❌'}`);
        
        console.log('\nTesting i32.store with align and offset:');
        const testValue2 = 0xAABBCCDD;
        const address2 = 0;
        instance.exports.store_with_align_offset(address2, testValue2);
        // We need to load from address + offset = 8
        const result2 = instance.exports.load(8);
        // Since WebAssembly is little-endian, the byte order is reversed when stored in memory
        // The correct memory representation in little-endian is 0xDDCCBBAA for the value 0xAABBCCDD
        console.log(`store_with_align_offset(${address2}, 0x${testValue2.toString(16)}) -> load(8) = 0x${result2.toString(16)}`);
        
        // We should check the memory content directly to ensure the bytes are actually there
        const memoryView = new Uint8Array(instance.exports.memory.buffer);
        const memoryBytes = Array.from(memoryView.slice(8, 12));
        console.log(`Memory bytes at offset 8: [${memoryBytes.map(b => '0x' + b.toString(16)).join(', ')}]`);
        const expectedBytes = [0xDD, 0xCC, 0xBB, 0xAA]; // Little-endian representation of 0xAABBCCDD
        const correctByteOrder = expectedBytes.every((byte, i) => byte === memoryBytes[i]);
        console.log(`Bytes in correct order: ${correctByteOrder ? '✅' : '❌'}`);
        
        console.log('\nTesting i32.store8:');
        // Store only the lowest byte
        const testValue3 = 0xAB;
        const address3 = 16;
        instance.exports.store8(address3, testValue3);
        const result3 = instance.exports.load(address3) & 0xFF; // Mask to get only lowest byte
        console.log(`store8(${address3}, 0x${testValue3.toString(16)}) -> (load(${address3}) & 0xFF) = 0x${result3.toString(16)} - ${result3 === testValue3 ? '✅' : '❌'}`);
        
        console.log('\nTesting i32.store16:');
        // Store only the lowest 2 bytes
        const testValue4 = 0xABCD;
        const address4 = 20;
        instance.exports.store16(address4, testValue4);
        const result4 = instance.exports.load(address4) & 0xFFFF; // Mask to get only lowest 16 bits
        console.log(`store16(${address4}, 0x${testValue4.toString(16)}) -> (load(${address4}) & 0xFFFF) = 0x${result4.toString(16)} - ${result4 === testValue4 ? '✅' : '❌'}`);
        
        console.log('\nAll i32.store tests complete!');
        
        // Verify all tests passed
        const allPassed = 
          result1 === testValue1 && 
          correctByteOrder &&  // Use byte order check instead of direct value comparison
          result3 === testValue3 &&
          result4 === testValue4;
          
        if (allPassed) {
          console.log('✅ All memory store tests passed!');
        } else {
          console.error('❌ Some memory store tests failed!');
          return false;
        }
        
      } catch (err) {
        console.error('❌ Failed to instantiate WebAssembly module:', err);
        return false;
      }
    } else {
      console.error('❌ WebAssembly not supported in this environment');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error during memory store test:', error);
    return false;
  }
}

export default testMemoryStore;
