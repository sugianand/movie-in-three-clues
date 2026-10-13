export type TitleEntry = {title:string;year:number;aliases:string[]};
export function normalizeTitle(value:string){
 return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
}
// Search the entire catalog. No room, collection, clue or answer enters this function.
export function findTitles(catalog:TitleEntry[],query:string):TitleEntry[]{
 const key=normalizeTitle(query);
 if(key.length<2)return [];
 return catalog.map(entry=>({entry,keys:[entry.title,...entry.aliases].map(normalizeTitle)}))
  .filter(row=>row.keys.some(value=>value.includes(key)))
  .sort((a,b)=>Number(b.keys.some(value=>value.startsWith(key)))-Number(a.keys.some(value=>value.startsWith(key)))||a.entry.title.localeCompare(b.entry.title)||a.entry.year-b.entry.year)
  .slice(0,6).map(row=>row.entry);
}
