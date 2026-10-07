import {createRequire} from 'node:module';
import {readFileSync,readdirSync} from 'node:fs';
const wranglerRequire=createRequire(import.meta.resolve('wrangler/package.json'));
const {Miniflare}=wranglerRequire('miniflare');
const paths=readdirSync('dist/server',{recursive:true}).filter(p=>p.endsWith('.js')||p.endsWith('.mjs')).sort((a,b)=>a==='index.js'?-1:b==='index.js'?1:0);
const mf=new Miniflare({modules:paths.map(p=>({type:'ESModule',path:'dist/server/'+p})),modulesRoot:'dist/server',compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],assets:{directory:'dist/client',binding:'ASSETS',routerConfig:{has_user_worker:true}},cf:false});
try{
 const db=await mf.getD1Database('DB');await db.exec(readFileSync('drizzle/0000_magenta_namorita.sql','utf8').replace(/\n/g,' '));
 globalThis.fetch=(url,init)=>mf.dispatchFetch(url,init);
 await import('./integration.mjs');
}finally{await mf.dispose();}
