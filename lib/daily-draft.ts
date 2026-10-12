import type {DailyView} from './daily-types.ts';

type Progress=Pick<DailyView,'date'|'version'|'stage'|'done'>;
export type DailyDraft=Progress & {text:string};
export const dailyDraftKey=(token:string)=>`three-clues-daily-draft:${token}`;
// A draft belongs to one exact puzzle state, not simply to today's title.
export function sameDailyProgress(previous:Progress|null,next:Progress){
 return !!previous&&!next.done&&previous.date===next.date&&previous.version===next.version&&previous.stage===next.stage&&previous.done===next.done;
}
export function readDailyDraft(raw:string|null,next:Progress){
 try{
  const draft=JSON.parse(raw??'null') as DailyDraft|null;
  return draft&&sameDailyProgress(draft,next)&&typeof draft.text==='string'&&draft.text.length<=150?draft.text:'';
 }catch{return '';}
}
export function writeDailyDraft(progress:Progress,text:string){
 return !progress.done&&text?JSON.stringify({date:progress.date,version:progress.version,stage:progress.stage,done:progress.done,text:text.slice(0,150)}):null;
}
