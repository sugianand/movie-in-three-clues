import {spawnSync,spawn} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));process.chdir(root);
const [major,minor]=process.versions.node.split('.').map(Number);if(major<22||(major===22&&minor<13)){console.error('Please install Node.js 22.13 or newer, then try again.');process.exit(1);}
function run(args){const r=spawnSync(process.execPath,args,{stdio:'inherit',cwd:root});if(r.error)throw r.error;if(r.status)process.exit(r.status);}
run(['scripts/run-framework.mjs','build']);
const config=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
config.d1_databases=config.d1_databases.map(db=>({...db,migrations_dir:'../../drizzle'}));
writeFileSync('dist/server/wrangler.local.json',JSON.stringify(config));
const wrangler=['--import','./scripts/sites-env.mjs','node_modules/wrangler/bin/wrangler.js'];
run([...wrangler,'d1','migrations','apply','DB','--local','--config','dist/server/wrangler.local.json','--persist-to','.wrangler/state']);
console.log('\nMovie in Three Clues: open http://localhost:3000 in your browser.\nKeep this window open while playing. Press Ctrl+C to stop.\n');
const child=spawn(process.execPath,[...wrangler,'dev','--config','dist/server/wrangler.local.json','--local','--persist-to','.wrangler/state','--ip','127.0.0.1','--port','3000','--inspector-port','0'],{stdio:'inherit'});
child.on('exit',code=>process.exit(code||0));process.on('SIGINT',()=>child.kill('SIGINT'));
