import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual component's event handlers without a browser dependency.
const source=readFileSync(new URL('../components/movie-title-input.tsx',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
function render(active=0){
 const changes=[];let focused=0,stateIndex=0;
 const exports={};
 const jsx=(type,props)=>({type,props});
 vm.runInNewContext(compiled,{exports,require(name){
  if(name==='react')return {useState:()=>[[true,active][stateIndex++],()=>{}]};
  if(name==='react/jsx-runtime')return {jsx,jsxs:jsx};
  if(name.includes('movie-titles'))return {};
  if(name.includes('title-search'))return {findTitles:()=>[{title:'Arrival',year:2016},{title:'Argo',year:2012}]};
  throw new Error(name);
 }});
 const tree=exports.MovieTitleInput({id:'guess',value:'ar',onChange:v=>changes.push(v),disabled:false,inputRef:{current:{focus(){focused++;}}},placeholder:'Movie'});
 return {input:tree.props.children[0],options:tree.props.children[1].props.children,changes,get focused(){return focused;}};
}
const touch=render();let prevented=false;
touch.options[0].props.onPointerDown({preventDefault(){prevented=true;}});
assert.equal(prevented,true,'Keep the input focused until the gesture resolves');
assert.deepEqual(touch.changes,[],'A touch-down or cancelled scroll must not select a movie');
touch.options[1].props.onClick();
assert.deepEqual(touch.changes,['Argo'],'Only a completed click/tap fills the field');
assert.equal(touch.focused,1);
const keyboard=render();let enterPrevented=false;
keyboard.input.props.onKeyDown({key:'Enter',nativeEvent:{isComposing:false},preventDefault(){enterPrevented=true;}});
assert.equal(enterPrevented,true,'Selecting via Enter must not submit the form');
assert.deepEqual(keyboard.changes,['Arrival']);
const composing=render();
composing.input.props.onKeyDown({key:'Enter',nativeEvent:{isComposing:true},preventDefault(){}});
assert.deepEqual(composing.changes,[],'IME confirmation must not choose a suggestion');
const stale=render(99);
assert.doesNotThrow(()=>stale.input.props.onKeyDown({key:'Enter',nativeEvent:{isComposing:false},preventDefault(){}}));
assert.deepEqual(stale.changes,[]);
console.log('PASS: title input defers selection until click, preserves keyboard selection, and guards IME/stale indexes.');
