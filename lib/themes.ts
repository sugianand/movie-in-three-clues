export const themeKey='three-clues-theme';
export const themes=[
 {id:'original',name:'Original',description:'Bold white lettering, electric blue accents, and the full poster wall.'},
 {id:'premiere',name:'Classic Cinema',description:'Cream lettering, deep red accents, and classic cinema framing.'},
 {id:'midnight',name:'Stranger Things',description:'Enter the Upside Down. Crimson neon, drifting embers, and midnight skies.'},
 {id:'arena',name:'Squid Game',description:'Enter the arena. Electric pink, mint geometry, and competition after dark.'},
] as const;
export type ThemeId=typeof themes[number]['id'];
export function parseTheme(value:unknown):ThemeId{return themes.some(t=>t.id===value)?value as ThemeId:'original';}
