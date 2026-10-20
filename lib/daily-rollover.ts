export function shouldAutoOpenDaily(date:string,nextAt:number,now:number,attemptedDate:string,visible:boolean){
 return visible&&now>=nextAt&&attemptedDate!==date;
}
