import {cpSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const name of ['app', 'components', 'hooks', 'lib', 'data', 'public']) {
  rmSync(new URL(name, import.meta.url), {recursive:true, force:true});
  cpSync(root + name, new URL(name, import.meta.url), {recursive:true});
}
rmSync(new URL('app/api', import.meta.url), {recursive:true, force:true});
for (const endpoint of ['game', 'daily']) {
  mkdirSync(new URL(`app/api/${endpoint}`, import.meta.url), {recursive:true});
  writeFileSync(new URL(`app/api/${endpoint}/route.ts`, import.meta.url), `import {forwardGameRequest} from '@/lib/vercel-backend';\nexport const dynamic='force-dynamic';\nexport function POST(req:Request){return forwardGameRequest(req,'${endpoint}');}\n`);
}
writeFileSync(new URL('lib/vercel-backend.ts', import.meta.url), `
const backend = 'https://movie-in-three-clues.sugianand89.chatgpt.site';
export async function forwardGameRequest(req: Request, endpoint: 'game'|'daily') {
  const origin = req.headers.get('origin');
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (origin && new URL(origin).host !== host) return Response.json({error:'Request origin not allowed.'},{status:403});
  const body = await req.text();
  if (body.length > 4096) return Response.json({error:'Request too large.'},{status:413});
  try {
    const response = await fetch(backend + '/api/' + endpoint, {
      method:'POST', headers:{'Content-Type':'application/json','Origin':backend},
      body, cache:'no-store', signal:AbortSignal.timeout(15000), redirect:'error'
    });
    return new Response(await response.text(), {status:response.status, headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  } catch {
    return Response.json({error:'The game is temporarily unavailable. Please try again.'},{status:503});
  }
}
`);
