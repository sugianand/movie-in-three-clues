import type {GameSettings} from './game-settings';

export const gamePresets=[
 {id:'quick-cut',title:'Quick Cut',description:'3 rounds · free-for-all',settings:{rounds:3,mode:'individual',difficulty:'normal',speedBonus:false}},
 {id:'team-feature',title:'Team Feature',description:'5 rounds · two teams',settings:{rounds:5,mode:'teams',difficulty:'normal',speedBonus:false}},
 {id:'marathon',title:'Marathon',description:'10 rounds · free-for-all',settings:{rounds:10,mode:'individual',difficulty:'normal',speedBonus:false}},
] as const satisfies readonly {id:string;title:string;description:string;settings:Partial<GameSettings>}[];

export type GamePresetId=(typeof gamePresets)[number]['id'];

export function applyGamePreset(current:GameSettings,id:GamePresetId):GameSettings{
 const preset=gamePresets.find(candidate=>candidate.id===id);
 if(!preset)throw Error('Choose a valid game preset.');
 return {...current,...preset.settings,collection:current.collection,era:current.era};
}

export function matchesGamePreset(current:GameSettings,id:GamePresetId):boolean{
 const preset=gamePresets.find(candidate=>candidate.id===id);
 if(!preset)return false;
 const normalized={rounds:current.rounds??5,mode:current.mode??'individual',difficulty:current.difficulty??'normal',speedBonus:current.speedBonus??false};
 return Object.entries(preset.settings).every(([key,value])=>normalized[key as keyof typeof normalized]===value);
}
