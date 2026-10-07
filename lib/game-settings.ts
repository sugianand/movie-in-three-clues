export const collections=[{value:'mixed',label:'Mixed cinema',description:'100 Indian + 100 American'},{value:'indian',label:'Indian cinema',description:'100 Hindi, Tamil & Telugu favorites'},{value:'hollywood',label:'American cinema',description:'100 popular Hollywood favorites'}] as const;
export const eras=[{value:'all',label:'All years'},{value:'classic',label:'Before 2010'},{value:'modern',label:'2010 onward'}] as const;
export const difficulties=[{value:'easy',label:'Easy',seconds:30},{value:'normal',label:'Normal',seconds:15},{value:'hard',label:'Hard',seconds:10}] as const;
export const teams=[{id:'purple',name:'Team Purple'},{id:'gold',name:'Team Gold'}] as const;
export type GameSettings={collection:'mixed'|'indian'|'hollywood';era:'all'|'classic'|'modern';mode?:'individual'|'teams';difficulty?:'easy'|'normal'|'hard'};
export const defaultSettings:GameSettings={collection:'mixed',era:'all',mode:'individual',difficulty:'normal'};
export function parseSettings(value:unknown):GameSettings{
 if(!value||typeof value!=='object')throw Error('Choose a movie collection and era.');
 const s=value as GameSettings;
 if(!collections.some(c=>c.value===s.collection)||!eras.some(e=>e.value===s.era))throw Error('Choose a valid movie collection and era.');
 if(s.mode!==undefined&&!['individual','teams'].includes(s.mode))throw Error('Choose individual or team play.');
 if(s.difficulty!==undefined&&!difficulties.some(d=>d.value===s.difficulty))throw Error('Choose a valid difficulty.');
 return {collection:s.collection,era:s.era,mode:s.mode??'individual',difficulty:s.difficulty??'normal'};
}
export function settingsLabel(s:GameSettings){return `${collections.find(c=>c.value===s.collection)?.label??'Mixed cinema'} · ${eras.find(e=>e.value===s.era)?.label??'All years'} · ${s.mode==='teams'?'Teams':'Solo'} · ${difficulties.find(d=>d.value===(s.difficulty??'normal'))?.label}`;}
export function clueSeconds(s?:GameSettings){return difficulties.find(d=>d.value===s?.difficulty)?.seconds??15;}
