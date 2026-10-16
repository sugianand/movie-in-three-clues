export const themeKey='three-clues-theme';
export const themes=[
 {id:'premiere',name:'Blue Premiere',description:'The original Missing Frame look in electric blue, white, and near-black.'},
 {id:'midnight',name:'Stranger Things',description:'Midnight Signal · crimson light, shadowy atmosphere, and an upside-down cinema.'},
 {id:'arena',name:'Squid Game',description:'Neon Arena · pink guards, teal tracksuits, and circle / triangle / square.'},
 {id:'scout',name:'Attack on Titan',description:'Scout Regiment · forest green, weathered brass, and walls on the horizon.'},
 {id:'classic',name:'Classic Cinema',description:'Cream lettering, deep red accents, and classic cinema framing.'},
] as const;
export type ThemeId=typeof themes[number]['id'];
export function parseTheme(value:unknown):ThemeId{return themes.some(t=>t.id===value)?value as ThemeId:'premiere';}
