import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=readFileSync(new URL('../components/room-code.tsx',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
async function scenario(clipboard){
 const states=[],refs=[];let si=0,ri=0;
 const context={exports:{},navigator:{clipboard},require(name){
  if(name==='react')return {useState(initial){const i=si++;if(!(i in states))states[i]=initial;return [states[i],value=>states[i]=value];},useRef(initial){const i=ri++;return refs[i]??=( {current:initial});}};
  if(name==='react/jsx-runtime')return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
  if(name==='lucide-react')return {Copy:'icon'};
  throw Error(name);
 }};
 vm.runInNewContext(compiled,context);
 const render=()=>{si=0;ri=0;return context.exports.RoomCode({code:'ABC123'}).props.children;};
 const nodes=render();nodes[1].props.onClick();nodes[1].props.onClick();
 await new Promise(resolve=>setImmediate(resolve));
 return render();
}
for(const clipboard of [undefined,{}, {writeText:()=>{throw Error('Denied');}}, {writeText:async()=>{throw Error('Denied');}}]){
 const nodes=await scenario(clipboard);
 assert.match(nodes[2].props.children,/Copy is unavailable/);
 assert.equal(nodes[3].props.value,'ABC123');assert.equal(nodes[3].props.readOnly,true);
 let selected=false;nodes[3].props.onFocus({currentTarget:{select(){selected=true;}}});assert(selected);
 assert.equal(nodes[1].props.disabled,false);
}
let calls=0;
const nodes=await scenario({async writeText(code){calls++;assert.equal(code,'ABC123');}});
assert.equal(calls,1);assert.equal(nodes[2].props.children,'Room code copied.');assert.equal(nodes[2].props.role,'status');assert.equal(nodes[3],false);
console.log('PASS: room-code copying handles absent APIs, synchronous and async failures, selectable fallback, accessibility and duplicate clicks.');
