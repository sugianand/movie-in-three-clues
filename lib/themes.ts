export const themeKey='three-clues-theme';
export const themes=[
 {id:'premiere',name:'Classic Cinema',description:'Cream lettering, deep red accents, and classic cinema framing.'},
 {id:'midnight',name:'Stranger Things',description:'Deep navy, glowing neon red, and bold retro-serif titles.'},
 {id:'arena',name:'Squid Game',description:'Charcoal, vivid pink, teal highlights, and circle, triangle, square motifs.'},
] as const;
export type ThemeId=typeof themes[number]['id'];
export function parseTheme(value:unknown):ThemeId{return themes.some(t=>t.id===value)?value as ThemeId:'premiere';}
