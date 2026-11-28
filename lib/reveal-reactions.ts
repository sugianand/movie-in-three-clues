export const revealReactions=[
 {id:'great-pick',emoji:'🎬',label:'Great pick'},
 {id:'no-way',emoji:'🤯',label:'No way'},
 {id:'so-close',emoji:'😅',label:'So close'},
 {id:'great-clue',emoji:'🔥',label:'Great clue'},
] as const;

export type RevealReaction=typeof revealReactions[number]['id'];

export function isRevealReaction(value:unknown):value is RevealReaction{
 return typeof value==='string'&&revealReactions.some(reaction=>reaction.id===value);
}

export function revealReactionCounts(values:Iterable<RevealReaction>){
 const counts=new Map<RevealReaction,number>(revealReactions.map(reaction=>[reaction.id,0]));
 for(const value of values)counts.set(value,(counts.get(value)??0)+1);
 return revealReactions.map(reaction=>({...reaction,count:counts.get(reaction.id)??0}));
}
