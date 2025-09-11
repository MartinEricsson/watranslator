import { compileWithProfile } from '../../src/index.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export default async function testProfile(debug=false){
  const src = readFileSync(join(process.cwd(),'tests/large-module/large-module.wat'),'utf8');
  const { profile, binary } = await compileWithProfile(src);
  const required = ['tokenize_ns','parse_ns','compile_ns','total_ns','wasm_bytes','input_bytes','lines'];
  const ok = required.every(k => typeof profile[k] === 'number' && profile[k] >= 0);
  if (debug){
    console.log('Profile', profile);
    console.log('Binary bytes', binary.byteLength);
  }
  return ok;
}
