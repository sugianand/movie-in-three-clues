export const themeKey='three-clues-theme';
export const themes=[
 {id:'premiere',name:'Classic Cinema',description:'Cream lettering, deep red accents, and classic cinema framing.'},
 {id:'midnight',name:'Midnight Signal',description:'Crimson neon, eerie shadows, and retro supernatural cinema.'},
 {id:'arena',name:'Neon Arena',description:'Pink and teal with geometric competition-show energy.'},
] as const;
export type ThemeId=typeof themes[number]['id'];
export function parseTheme(value:unknown):ThemeId{return themes.some(t=>t.id===value)?value as ThemeId:'premiere';}
