import records from '../data/movie-expansion.json' with {type:'json'};
import type {Movie} from './movie-bank.ts';

// Facts are a checked-in snapshot; no player needs an API key or third-party request.
// Original clue phrasing uses credits and metadata, never copied plot summaries.
function titleHint(title:string){
 return title.replace(/[A-Za-z0-9]+/g,word=>{
  if(/^\d+$/.test(word))return word;
  const shown=word.length>=6?2:1;
  return word.slice(0,shown)+'_'.repeat(word.length-shown);
 });
}
export const expandedMovies:Movie[]=records.map(row=>({
 title:row.title,year:row.year,region:row.region as Movie['region'],language:row.language,aliases:row.aliases,
 clues:[
  row.plot || `This ${row.year} ${row.genre} film includes ${row.cast[2]} and ${row.cast[3]} in its cast.`,
  `Released in ${row.year}, directed by ${row.director}, and featuring ${row.cast[1]}.`,
  `${row.character?`${row.cast[0]} plays ${row.character}.`:`The cast includes ${row.cast[0]} and ${row.cast[1]}.`} Title hint: ${titleHint(row.title)}`,
 ],
}));
