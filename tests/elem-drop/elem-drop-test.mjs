// Generated by 🤖
import assert from 'assert';
import { readTestData } from '../test-utils.mjs';

async function testElemDrop(debug = false) {
  try {
    const { wasmBuffer, ast } = await readTestData('elem-drop/elem-drop.wat', debug);

    // Verify AST structure
    assert(ast[0].tables && ast[0].tables.length > 0, 'Table should be present in AST');
    assert.strictEqual(ast[0].tables[0].min, 4, 'Table min size should be 4');
    
    // Verify element segments
    assert(ast[0].elements && ast[0].elements.length === 2, 'Should have two element segments');
    
    // Instantiate and test
    const { instance } = await WebAssembly.instantiate(wasmBuffer);
    
    // Test table contents
    const table = instance.exports.tbl;
    assert(table instanceof WebAssembly.Table, 'Table should be exported');
    assert.strictEqual(table.length, 4, 'Table should have length 4');
    
    const getFunc = instance.exports.get_func;
    
    // Verify initial state
    assert.strictEqual(getFunc(0)(), 42, 'Initial: Function at index 0 should return 42');
    assert.strictEqual(getFunc(1)(), 43, 'Initial: Function at index 1 should return 43');
    
    // Drop the passive element segment (index 1)
    instance.exports.drop_elem(1);
    
    // Active segment (index 0) functions should still work
    assert.strictEqual(getFunc(0)(), 42, 'After drop: Function at index 0 should still return 42');
    assert.strictEqual(getFunc(1)(), 43, 'After drop: Function at index 1 should still return 43');
    
    if (debug) console.log('✅ Element drop test passed');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

export default testElemDrop;