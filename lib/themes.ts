export const themeKey='three-clues-theme';
export const themes=[
 {id:'premiere',name:'Blue Premiere',description:'The original Missing Frame look in electric blue, white, and near-black.'},
 {id:'midnight',name:'Midnight Signal',description:'Crimson neon, eerie shadows, and retro supernatural cinema.'},
 {id:'arena',name:'Neon Arena',description:'Pink and teal with geometric competition-show energy.'},
 {id:'classic',name:'Classic Cinema',description:'Cream lettering, deep red accents, and classic cinema framing.'},
] as const;
export type ThemeId=typeof themes[number]['id'];
export function parseTheme(value:unknown):ThemeId{return themes.some(t=>t.id===value)?value as ThemeId:'premiere';}
