export type DailyResult = {date:string; score:number; marks:('miss'|'skip'|'hit')[]};
export type DailyView = {
 serverNow?:number;
 performance?:{counts:number[];played:number;average:number};
 date:string; number:number; stage:number; done:boolean; score:number;
 guesses:(string|null)[]; clues:string[]; marks:DailyResult['marks']; answer:{title:string;year:number;language:string}|null;
 nextAt:number; version:number; history:DailyResult[];
 stats:{played:number;wins:number;streak:number;bestStreak:number;points:number};
};
