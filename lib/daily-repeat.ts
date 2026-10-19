// Exact normalized repeats only: different sequels, spellings and aliases remain guesses.
const key=(title:string)=>title.normalize('NFKD').toLowerCase().replace(/\p{M}/gu,'').replace(/[^\p{L}\p{N}]/gu,'');
export const dailyRepeatMessage='You already tried this title. Try another movie — no clue has been used.';
export function isRepeatedDailyGuess(guess:string,previous:readonly (string|null)[]=[]){
 const normalized=key(guess);
 return !!normalized&&previous.some(title=>typeof title==='string'&&key(title)===normalized);
}
