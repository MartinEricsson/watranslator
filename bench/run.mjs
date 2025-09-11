import { readFileSync } from 'node:fs';
import { compileWithProfile } from '../src/index.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function hr(n){return `${(n/1e6).toFixed(3)}ms`;}

async function main(){
  const manifest = JSON.parse(readFileSync(join(__dirname,'manifest.json'),'utf8'));
  const results = [];
  for (const entry of manifest){
    const src = readFileSync(join(process.cwd(), entry.path),'utf8');
    try {
      // Warmup (discard)
      await compileWithProfile(src);
      const runProfiles = [];
      for (let i=0;i<5;i++){
        const { profile } = await compileWithProfile(src);
        runProfiles.push(profile);
      }
    const median = (arr) => { const s=[...arr].sort((a,b)=>a-b); return s[Math.floor(s.length/2)]; };
    const aggregate = {
      path: entry.path,
      tag: entry.tag,
      tokenize_ns_median: median(runProfiles.map(p=>p.tokenize_ns)),
      parse_ns_median: median(runProfiles.map(p=>p.parse_ns)),
      compile_ns_median: median(runProfiles.map(p=>p.compile_ns)),
      total_ns_median: median(runProfiles.map(p=>p.total_ns)),
      wasm_bytes: runProfiles[0].wasm_bytes,
      input_bytes: runProfiles[0].input_bytes,
      lines: runProfiles[0].lines
    };
    results.push({ runs: runProfiles, aggregate });
    console.log(entry.path, 'total', hr(aggregate.total_ns_median), 'compile', hr(aggregate.compile_ns_median));
    } catch (e) {
      console.error('Benchmark failed for', entry.path, e.message);
    }
  }
  console.log('\nJSON Results:\n');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(e=>{console.error(e);process.exit(1);});
